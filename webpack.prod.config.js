const { merge } = require("webpack-merge");

// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("./webpack.common.config");
// const path = require("path");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
// const { ESBuildMinifyPlugin } = require("esbuild-loader");
// const publicPath = "/";

module.exports = merge(common, {
	mode: "production",

	devtool: false,

	plugins: [
		new TerserPlugin(),

		new MiniCssExtractPlugin({
			filename: "styles/[name].[contenthash].css",
			chunkFilename: "[id].[contenthash].css",
		}),

		new WebpackManifestPlugin(),
	],

	performance: false,

	// optimization（生产环境下配置）
	optimization: {
		// 提取公共代码
		splitChunks: {
			chunks: "all",
		},
		usedExports: true,
		runtimeChunk: true,
		minimize: true,
		minimizer: [
			// 配置生产环境的压缩方案：js和css
			new TerserPlugin({
				// 多进程打包
				parallel: true,
				terserOptions: {
					// 启动source-map
					sourceMap: false,
				},
			}),
			new CssMinimizerPlugin({
				parallel: true,
			}),
		],
	},
});
