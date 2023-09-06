const path = require('path');

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
    '@babel/plugin-transform-export-namespace-from',
    'react-native-reanimated/plugin',
  ],
};
