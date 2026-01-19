const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 添加 .sql 文件支持（由 babel-plugin-inline-import 处理为字符串）
config.resolver.sourceExts.push("sql");

// 确保 .wasm 作为静态资源处理，而不是当作 JS 源码解析
config.resolver.assetExts.push("wasm");

module.exports = config;
