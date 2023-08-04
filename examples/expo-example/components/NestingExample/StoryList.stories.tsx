import { ComponentMeta, ComponentStoryObj } from '@storybook/react';
import StoryListView from '@storybook/react-native/src/preview/components/StoryListView/StoryListView';

export default {
  title: 'StoryListView',
  component: StoryListView,
} as ComponentMeta<typeof StoryListView>;

export const Basic: ComponentStoryObj<typeof StoryListView> = {
  args: {
    storyIndex: {
      stories: {
        'chat-message--message-first': {
          id: 'chat-message--message-first',
          importPath: './components/NestingExample/ChatMessage.stories.tsx',
          name: 'Message First',
          title: 'Chat/Message',
        },
        'chat-message--message-second': {
          id: 'chat-message--message-second',
          importPath: './components/NestingExample/ChatMessage.stories.tsx',
          name: 'Message Second',
          title: 'Chat/Message',
        },
        'chat-message-bubble--first': {
          id: 'chat-message-bubble--first',
          importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
          name: 'First',
          title: 'Chat/Message/bubble',
        },
        'chat-message-bubble--second': {
          id: 'chat-message-bubble--second',
          importPath: './components/NestingExample/ChatMessageBubble.stories.tsx',
          name: 'Second Story',
          title: 'Chat/Message/bubble',
        },
        'chat-message-reactions--message-one': {
          id: 'chat-message-reactions--message-one',
          importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
          name: 'Message One',
          title: 'Chat/Message/Reactions',
        },
        'chat-message-reactions--message-two': {
          id: 'chat-message-reactions--message-two',
          importPath: './components/NestingExample/ChatMessageReactions.stories.tsx',
          name: 'Message Two',
          title: 'Chat/Message/Reactions',
        },
        'chat-messageinput--basic': {
          id: 'chat-messageinput--basic',
          importPath: './components/NestingExample/ChatMessageMessageInput.stories.tsx',
          name: 'Basic',
          title: 'Chat/MessageInput',
        },
        'storylistview--basic': {
          id: 'storylistview--basic',
          importPath: './components/NestingExample/StoryList.stories.tsx',
          name: 'Basic',
          title: 'StoryListView',
        },
        'text-control--basic': {
          id: 'text-control--basic',
          importPath: './components/ControlExamples/Text/Text.stories.tsx',
          name: 'Basic',
          title: 'Text control',
        },
      },
      v: 3,
    },
  },
};
