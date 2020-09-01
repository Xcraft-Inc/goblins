import T from 'goblin-nabu/widgets/helpers/t.js';

export default [
  {
    text: T('Compositor'),
    glyph: 'solid/music',
    workitem: {
      name: 'theme-editor',
      description: T('Theme compositor'),
      kind: 'tab',
      view: 'theme-editor',
      icon: 'solid/music',
      isClosable: true,
      navigate: true,
    },
  },
];
