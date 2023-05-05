const path = require('path');
const pak = require('../package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '~': path.resolve(__dirname, './src'),
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
