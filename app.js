const express = require("express");
const path = require("path");

const server = express();

server.use("/", express.static("./build"));

server.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "build/index.html"));
});

server.listen(10086, () =>
	console.log(`Production server is running at : http://localhost:%s`, 10086)
);
