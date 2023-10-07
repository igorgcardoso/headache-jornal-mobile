module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      [
        'module-resolver',
        {
          alias: {
            '@src': './src/',
            '@components': './src/components',
          },
          extensions: ['.tsx'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
