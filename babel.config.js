module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@assets': './assets',
            '@images': './assets/images',
            '@items': './assets/images/items',
            '@actions': './assets/images/actions',
            '@equipment': './assets/images/equipment',
            '@spells': './assets/images/spells',
          },
        },
      ],
    ],
  };
};
