const common = require("./webpack.common.config");
const proxy = require("./config/proxy");
const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const { WebpackPluginServe: ServePlugin } = require("webpack-plugin-serve");

const path = require("path");

module.exports = merge(common, {
	mode: "development",

	entry: {
		main: ["webpack-plugin-serve/client", "./src/index.tsx"],
	},

	devtool: "eval-source-map",

	target: "web",

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: path.join(__dirname, "src"),
				exclude: /node_modules/,
				use: [
					{
						loader: "ts-loader",
						options: {
							transpileOnly: true,
							getCustomTransformers: () => ({
								before: [ReactRefreshTypeScript()],
							}),
						},
					},
				].filter(Boolean),
			},
		],
	},

	plugins: [
		new ServePlugin({
			port: 5000,
			static: path.resolve(__dirname, "dist"),
			status: false,
			middleware: (app, builtins) => {
				Object.keys(proxy).forEach((i) => {
					app.use(builtins.proxy(i, proxy[i]));
				});
			},
		}),
		new ReactRefreshWebpackPlugin({
			overlay: {
				sockIntegration: "wps",
			},
		}),
	],
});
