var plugins = [
	[
		"@babel/plugin-transform-runtime",
		{
			regenerator: true,
		},
	],
	"@babel/plugin-proposal-class-properties",
	"@babel/plugin-syntax-dynamic-import",
];

module.exports = (api) => {
	api.cache.using(() => process.env.NODE_ENV);

	if (process.env.NODE_ENV !== "production") {
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
		plugins.push("react-refresh/babel");
	}

	return {
		presets: [
			[
				"@babel/preset-env", // 预设：指示babel做怎么样的兼容处理
				{
					useBuiltIns: "usage", //按需加载
					corejs: {
						version: "3",
					},
					targets: "defaults",
				},
			],
			[
				"@babel/preset-react",
				{
					runtime: "automatic",
				},
			],
			"@babel/preset-typescript",
		],
		plugins,
	};
};
