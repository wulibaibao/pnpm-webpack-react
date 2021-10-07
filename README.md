## Webpack5+React17+Ts demo

该学习了，发现最近好开源新项目都是使用 pnpm 重构，最近要给公司小伙伴聊聊优化与 Webpack 配置这些，做了这套 webpack 配置，同样的使用到了 pnpm，简直洁癖福音。。。

目前使用到的：

1. pnpm
2. webpack 5
3. react 17
4. Ts（较少配置）

支持相关
webpack 配置相关：

1. esbuild-loader 替换 babel-loader
2. less modules 配置
3. css\js 优化配置、资源压缩
4. externals cdn（后续添加）
5. 实时刷新
6. 路由+代理 配置分离

> 为什么使用 pnpm

-   包安装速度极快；
-   磁盘空间利用非常高效。

安装：
`npm i -g pnpm`

模块安装：
`pnpm i`

开始：
`pnpm start`

构建：
`pnpm build`

### esbuild-loader 替换 babel-loader

> 参考：https://github.com/privatenumber/esbuild-loader-examples

```js
const { ProvidePlugin } = require("webpack");
module.exports = {
	modules: {
		rules: [
			//loader替换babel-loader
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
	plugins: [
		//plugins增加
		new ProvidePlugin({
			React: "react",
		}),
	],
};
```

### 配置 less modules

> 用惯了 ant-pro 的 styles，webpack 哪儿能没有 modules？看了一圈基本配置 less modules 大多是借鉴 create-react-app run eject 后的 webpack 配置，稍稍简化下

less modules 使用？

index.less

```less
.red-color {
	color: red;
}
```

index.tsx

```js
import styles from "./index.less";

return <div className={styles["red-color"]}>一行红色字体</div>;
```

#### webpack 配置

webpack.common.config.js

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 新增如下方法 getStyleLoaders
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

//      css / less loader 替换如下
module.exports = {
	modules: {
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
					"less-loader"
				),
				sideEffects: true,
			},
		],
	},
};
```

### mainfest.json

资源清单，使用 webpack-manifest-plugin 模块

```js
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = {
	plugins: [new WebpackManifestPlugin()],
};
```

### externals+cdn

早之前在 react-demo 中常用的模块，可以把包都转移到 cdn，用的好可以让 1M 带宽个人博客秒开

近期使用的话按需加载可能影响 antd+moment 组合依然会打包，这时候需要修改添加 babel.config.js 文件

bable 使用该文件规则，可以方便插入环境变量，production 的时候取消按需加载

具体操作

参考：https://github.com/wulibaibao/react-antd-demo/blob/master/config/webpack.config.prod.js

bable.config.js

```js
module.exports = (api) => {
	var plugins = [];

	process.env.NODE_ENV !== "production" &&
		plugins.push([
			"import",
			[
				{
					// 导入一个插件
					libraryName: "antd", // 暴露的库名
					style: true, // 直接将ants样式文件动态编译成行内样式插入，就不需要每次都导入
				},
			],
		]);
	return {
		presets: [],
		plugins,
	};
};
```

### 实时刷新

参考：https://segmentfault.com/a/1190000040427502

webpack.dev.config.js

```js
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
	plugins: [
		new ReactRefreshWebpackPlugin({
			exclude: [/node_modules/],
		}),
	],
};
```

bable.config.js

```js
module.exports = (api) => {
	var plugins = [];

	process.env.NODE_ENV !== "production" &&
		plugins.push("react-refresh/babel");
	return {
		presets: [],
		plugins,
	};
};
```

### devServer

tips :

1. contentBase 替换为 static
2. historyApiFallback:true 解决 get error

担水不忘挖井人：

> https://juejin.cn/post/6971743815434993671
