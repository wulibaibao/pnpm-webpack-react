const common = require("./webpack.common.config");
const proxy = require("./config/proxy");
const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");

module.exports = merge(common, {
	mode: "development",

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
