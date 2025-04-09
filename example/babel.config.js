const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~': path.resolve(__dirname, './src'),
          'react-native-chartiq': path.resolve(__dirname, '../src/index'),
        },
        extensions: [
          '.tsx',
          '.ts',
          '.ios.js',
          '.android.js',
          '.json',
          '.native.js',
          '.ttf',
          '.d.ts',
          '.svg',
        ],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
