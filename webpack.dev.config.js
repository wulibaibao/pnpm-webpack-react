const path = require("path");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const proxy = require("./config/proxy");
const isDevelopment = process.env.NODE_ENV !== "production";

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
	mode: isDevelopment ? "development" : "production",
	entry: {
		main: "./src/index.tsx",
	},
	cache: {
		type: "filesystem",
	},
	devtool: false,
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: path.join(__dirname, "src"),
				use: "babel-loader",
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
	devServer: {
		historyApiFallback: true,
		proxy
	},
	plugins: [
		isDevelopment && new ReactRefreshPlugin(),
		new ForkTsCheckerWebpackPlugin(),
		new HtmlWebpackPlugin({
			filename: "./index.html",
			template: "./public/index.html",
		}),
	].filter(Boolean),
	resolve: {
		extensions: [".js", ".ts", ".tsx"],
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
};
