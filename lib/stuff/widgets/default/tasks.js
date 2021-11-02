import T from 'goblin-nabu';

export default [
  {
    text: T('Réhydrateur'),
    glyph: 'solid/leaf',
    workitem: {
      name: 'rehydrate-summaries-wizard',
      description: T('Réglages'),
      view: 'default',
      icon: 'solid/leaf',
      kind: 'dialog',
      isClosable: true,
      navigate: true,
    },
  },
  {
    text: T('Réindexeur'),
    glyph: 'solid/book',
    workitem: {
      name: 'reindex-summaries-wizard',
      description: T('Réglages'),
      view: 'default',
      icon: 'solid/book',
      kind: 'dialog',
      isClosable: true,
      navigate: true,
    },
  },
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
