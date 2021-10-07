import { lazy } from "react";
export default [
	{
		path: "/user",
		name: "user",
		component: lazy(() => import("@/pages/User")),
	},
	{
		path: "/",
		name: "home",
		component: lazy(() => import("@/pages/HomePage")),
	},
	{
		redirect: "/home",
	},
];
