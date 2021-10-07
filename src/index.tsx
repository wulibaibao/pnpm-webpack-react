import ReactDom from "react-dom";
import Router from "@/pages/router";
import "./global.less";
import { ConfigProvider } from "antd";
import zhCN from "antd/lib/locale/zh_CN";
import "moment/locale/zh-cn";

ReactDom.render(
	<ConfigProvider locale={zhCN}>
		<Router />
	</ConfigProvider>,
	document.querySelector("#root")
);
