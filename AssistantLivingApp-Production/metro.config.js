// metro.config.js

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// If you don't need this, you can skip it
// Or if you're disabling it intentionally:
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
