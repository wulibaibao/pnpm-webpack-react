module.exports = {
	'/api': {
		target: "htttp://localhost:3000",
		// 发送请求时，请求路径重写：将/api/xxx  --> /xxx （去掉/api）
		pathRewrite: {
			"^api": "",
		},
	},
};
