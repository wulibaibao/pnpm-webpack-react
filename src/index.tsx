import ReactDOM from "react-dom";
import Router from "@/pages/router";
import "./global.less";
import { ConfigProvider } from "antd";

ReactDOM.render(
	<ConfigProvider>
		<Router />
	</ConfigProvider>,
	document.querySelector("#root")
);
