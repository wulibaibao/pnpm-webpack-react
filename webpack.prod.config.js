const { merge } = require("webpack-merge");
const { ProvidePlugin } = require("webpack");

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

	output: {
		// 输出文件目录（将来所有资源输出的公共目录，包括css和静态文件等等）
		path: path.resolve(__dirname, "build"), //默认
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

	devtool: false,

	plugins: [
		new TerserPlugin(),

		new MiniCssExtractPlugin({
			filename: "styles/[name].[contenthash].css",
			chunkFilename: "[id].[contenthash].css",
		}),

		new ProvidePlugin({
			React: "react",
		}),
		new WebpackManifestPlugin(),
	],

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "esbuild-loader",
				include: path.resolve(__dirname, "src"),
				options: {
					loader: "tsx", // Or 'ts' if you don't need tsx
					target: "es2015",
				},
			},
		],
	},

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
