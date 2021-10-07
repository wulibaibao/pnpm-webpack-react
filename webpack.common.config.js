// HtmlWebpackPlugin帮助你创建html文件，并自动引入打包输出的bundles文件。支持html压缩。
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const chalk = require("chalk");
const path = require("path");
const { ProvidePlugin } = require('webpack');

const getStyleLoaders = (cssOptions, preProcessor) => {
	const loaders = [
		process.env.NODE_ENV === "production"
			? MiniCssExtractPlugin.loader
			: "style-loader",
		{
			loader: "css-loader",
			options: cssOptions,
		},
		{
			loader: "postcss-loader",
			options: {
				postcssOptions: {
					plugins: ["postcss-flexbugs-fixes", "postcss-preset-env"],
				},
			},
		},
	].filter(Boolean);

	preProcessor && loaders.push(preProcessor);

	return loaders;
};

module.exports = {
	entry: "./src/index.tsx",

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

	cache: {
		type: "filesystem",
	},
	
	module: {
		rules: [
			// {
			// 	test: /\.(t|j)sx?$/,
			// 	// 注意需要在package.json配置browserslist，否则babel-loader不生效
			// 	// js兼容处理 babel
			// 	loader: "babel-loader", // 规则只使用一个loader时推荐写法
			// 	options: {
			// 		cacheDirectory: true, // 这是一个webpack优化点，使用缓存
			// 	},
			// 	include: path.resolve(__dirname, "src"),
			// 	exclude: /node_modules/, // 这个也是webpack优化的点 exclude排除不需要编译的文件夹
			// },
			{
				test: /\.tsx?$/,
				loader: "esbuild-loader",
				include: path.resolve(__dirname, "src"),
				options: {
					loader: "tsx", // Or 'ts' if you don't need tsx
					target: "es2015",
				},
			},
			{
				test: /\.css$/,
				use: getStyleLoaders({
					modules: false,
					importLoaders: 1,
				}),
			},
			{
				test: /\.less$/,
				exclude: /\.module\.less$/,
				use: getStyleLoaders(
					{
						importLoaders: 2,
						sourceMap: process.env.NODE_ENV !== "production",
						modules: {
							localIdentName: "[local]",
						},
					},
					"less-loader"
				),
				sideEffects: true,
			},
			/* 
        Webpack5.0新增资源模块(asset module)，它是一种模块类型，允许使用资源文件（字体，图标等）而无需     配置额外 loader。支持以下四个配置
        asset/resource 发送一个单独的文件并导出 URL。之前通过使用 file-loader 实现。
        asset/inline 导出一个资源的 data URI。之前通过使用 url-loader 实现。
        asset/source 导出资源的源代码。之前通过使用 raw-loader 实现。
        asset 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 url-loader，并且配置资     源体积限制实现。
        */
			// Webpack4使用file-loader实现
			{
				test: /\.(eot|svg|ttf|woff|)$/,
				type: "asset/resource",
				generator: {
					// 输出文件位置以及文件名
					filename: "fonts/[name][ext]",
				},
			},
			// Webpack4使用url-loader实现
			{
				//处理图片资源
				test: /\.(jpg|png|gif|)$/,
				type: "asset",
				generator: {
					// 输出文件位置以及文件名
					filename: "images/[name][ext]",
				},
				parser: {
					dataUrlCondition: {
						maxSize: 10 * 1024, //超过10kb不转base64
					},
				},
			},
			{
				test: /\.svg$/,
				use: ["@svgr/webpack"],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "styles/[name].[contenthash].css",
			chunkFilename: "[id].[contenthash].css",
		}),

		// Generates an HTML file from a template
		// Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
		new HtmlWebpackPlugin({
			title: "Webpack5+React17+Ts",
			favicon:
				path.resolve(__dirname, "src") + "/assets/React-Hook.png",
			template: path.resolve(__dirname, "public") + "/index.html", // template file
			filename: "index.html", // output file
		}),
		new ProgressBarPlugin({
			format:
				"  build [:bar] " +
				chalk.green.bold(":percent") +
				" (:elapsed seconds)",
			clear: false,
		}),
		new ProvidePlugin({
			React: 'react',
		}),
	],

	// 解析模块的规则：
	resolve: {
		// 配置 解析模块路径别名：可简写路径。
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
		// 配置 省略文件路径的后缀名。默认省略js和json。也是webpack默认认识的两种文件类型
		extensions: [".ts", ".tsx", ".less", ".json", ".js", ".css"],
		symlinks: false,
		// 告诉webpack解析模块是去找哪个目录
		// 该配置明确告诉webpack，直接去上一层找node_modules。
		modules: [path.resolve(__dirname, "node_modules")],
	},
};
