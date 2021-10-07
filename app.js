const express = require("express");
const path = require("path");
const proxy = require("./config/proxy");

const { createProxyMiddleware } = require("http-proxy-middleware");

const server = express();

server.use("/", express.static("./build"));

Object.keys(proxy).forEach((i) => {
	server.use(i, createProxyMiddleware(proxy[i]));
});

server.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build/index.html"));
});

server.listen(10086, () =>
	console.log(`Production server is running at : http://localhost:%s`, 10086)
);
