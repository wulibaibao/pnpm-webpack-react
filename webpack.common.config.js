
// 该插件将CSS提取到单独的文件中。它会为每个chunk创造一个css文件。需配合loader一起使用
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const chalk = require("chalk");
const path = require("path");

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

	cache: {
		type: "filesystem",
	},

	module: {
		rules: [
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
					{
						loader: "less-loader",
						options: {
							lessOptions: {
								javascriptEnabled: true,
							},
						},
					}
				),
				sideEffects: true,
			},
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
		
		new ProgressBarPlugin({
			format: ` build [:bar] ${chalk.green.bold(":percent")}  (:elapsed seconds)`,
			total : 3,
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
