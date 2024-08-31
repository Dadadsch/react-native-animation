// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Hinzufügen der Unterstützung für .glb, .gltf und .svg-Dateien
config.resolver.assetExts.push('glb', 'gltf', 'svg');
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
