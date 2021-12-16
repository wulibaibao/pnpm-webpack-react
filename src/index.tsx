import { render } from "react-dom";
import Router from "@/pages/router";
import "./global.less";
import { ConfigProvider } from "antd";

render(
	<ConfigProvider>
		<Router />
	</ConfigProvider>,
	document.querySelector("#root")
);