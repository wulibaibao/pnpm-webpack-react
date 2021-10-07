const common = require("./webpack.common.config");
const proxy = require("./config/proxy");
const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");

module.exports = merge(common, {
	mode: "development",

	output: {
		// 输出文件目录（将来所有资源输出的公共目录，包括css和静态文件等等）
		path: path.resolve(__dirname, "dist"), //默认
		// 文件名称（指定名称+目录）
		filename: "[name].js", // 默认
		// 所有资源引入公共路径前缀，一般用于生产环境，小心使用
		publicPath: "/",
		/* 
        非入口文件chunk的名称。所谓非入口即import动态导入形成的chunk或者optimization中的splitChunks提取的公共chunk
        它支持和 filename 一致的内置变量
        */
		chunkFilename: "[contenthash:10].chunk.js",
		clean: true, //打包前清空输出目录，相当于clean-webpack-plugin插件的作用。
	},

	devtool: "eval-source-map",

	target: "web",

	// devServer（开发环境下配置）：
	devServer: {
		// 运行代码的目录
		// contentBase: path.resolve(__dirname, "dist"),
		// 为每个静态文件开启gzip压缩
		// compress: true,
		host: "localhost",
		port: 5000,
		open: true, // 自动打开浏览器
		hot: true, //开启HMR功能
		// 设置代理
		proxy,
		historyApiFallback: true, // resolve GET error
	},

	plugins: [
		// new HotModuleReplacementPlugin(),
		new ReactRefreshWebpackPlugin({
			exclude: [/node_modules/],
		}),
	],
});
