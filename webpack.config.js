const webpack = require('webpack');
const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['nativewind'],
    },
  }, argv);

  // Asegurar que los archivos CSS se procesen correctamente
  config.module.rules.push({
    test: /\.css$/i,
    use: ['style-loader', 'css-loader', 'postcss-loader'],
  });

  return config;
};
