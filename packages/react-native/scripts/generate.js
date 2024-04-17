const {
  toRequireContext,
  ensureRelativePathHasDot,
  getMain,
  getPreviewExists,
} = require('./common');
const { normalizeStories, globToRegexp } = require('@storybook/core-common');
const fs = require('fs');
const prettier = require('prettier');
const path = require('path');

const cwd = process.cwd();

function generate({ configPath, absolute = false, useJs = false }) {
  const storybookRequiresLocation = path.resolve(
    cwd,
    configPath,
    `storybook.requires.${useJs ? 'js' : 'ts'}`
  );

  const mainImport = getMain({ configPath });

  const main = mainImport.default ?? mainImport;

  // const reactNativeOptions = main.reactNativeOptions;

  const storiesSpecifiers = normalizeStories(main.stories, {
    configDir: configPath,
    workingDir: cwd,
  });

  const normalizedStories = storiesSpecifiers.map((specifier) => {
    // TODO why????
    const reg = globToRegexp(`./${specifier.files}`);

    const { path: p, recursive: r, match: m } = toRequireContext(specifier);

    const pathToStory = ensureRelativePathHasDot(path.posix.relative(configPath, p));
    return `{
      titlePrefix: "${specifier.titlePrefix}",
      directory: "${specifier.directory}",
      files: "${specifier.files}",
      importPathMatcher: /${reg.source}/,
      ${useJs ? '' : '// @ts-ignore'}
      req: require.context('${pathToStory}', ${r}, ${m})
    }`;
  });

  const registerAddons = main.addons?.map((addon) => `import "${addon}/register";`).join('\n');

  const doctools = 'require("@storybook/react-native/dist/preview")';

  // TODO: implement presets or something similar
  const enhancer = main.addons?.includes('@storybook/addon-ondevice-actions')
    ? "require('@storybook/addon-actions/preview')"
    : '';

  const previewExists = getPreviewExists({ configPath });

  const annotations = `[${previewExists ? "require('./preview')," : ''}${doctools}, ${enhancer}]`;

  const globalTypes = `
    declare global {
      var view: ReturnType<typeof start>;
      var STORIES: typeof normalizedStories;
    }
  `;

  const fileContent = `
  /* do not change this file, it is auto generated by storybook. */
  
  import { start, prepareStories, getProjectAnnotations } from '@storybook/react-native';
  
  ${registerAddons}

  const normalizedStories = [${normalizedStories.join(',')}];

  ${useJs ? '' : globalTypes}

  const annotations = ${annotations};

  global.STORIES = normalizedStories;
  
  ${useJs ? '' : '// @ts-ignore'}
  module?.hot?.accept?.();

  if (!global.view) {
    global.view = start({
      annotations,
      storyEntries: normalizedStories
    });
  } else {
    const { importMap } = prepareStories({ storyEntries: normalizedStories });
    
    global.view._preview.onStoriesChanged({
      importFn: async (importPath${useJs ? '' : ': string'}) => importMap[importPath],
    });

    global.view._preview.onGetProjectAnnotationsChanged({
      getProjectAnnotations: getProjectAnnotations(global.view, annotations),
    });
  }

  export const view = global.view;
`;

  const formattedFileContent = prettier.format(fileContent, { parser: 'babel-ts' });

  fs.writeFileSync(storybookRequiresLocation, formattedFileContent, {
    encoding: 'utf8',
    flag: 'w',
  });
}

module.exports = {
  generate,
};