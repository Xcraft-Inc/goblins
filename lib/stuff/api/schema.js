module.exports = (paramBuilder) => {
  const buildParam = paramBuilder({
    name: {
      type: 'string',
      example: 'Twinky',
    },
  });

  return {
    hello: {
      verb: 'GET',
      route: 'hello/:name',
      params: buildParam('name'),
    },
  };
};
