const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Metro no resuelve .cjs por defecto; necesario para @tanstack/query-core (dep. de @clerk/expo)
config.resolver.sourceExts = [...config.resolver.sourceExts, "cjs"];

module.exports = withNativewind(config);
