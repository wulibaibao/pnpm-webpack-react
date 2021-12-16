import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import routes from "../../config/routes";
import Container from "@/components/Container/Container";
import Loading from "@/components/Loading";

const routerMap = (routes: PageRoute[]) => {
	return (
		<Routes>
			{routes.map((item: PageRoute, index: number) => {
				if (item.routes && !!item.routes.length)
					return routerMap(item.routes);

				// if (item.redirect)
				// 	return <Redirect key={index} to={item.redirect} />;

				const Component: React.FC | undefined = item.component;

				return (
					<Route
						path={item.path}
						key={item.path || index}
						element={
							<Container children={Component && <Component />} />
						}
					/>
				);
			})}
		</Routes>
	);
};

const PageRoute: React.FC = () => {
	return (
		<Suspense fallback={<Loading />}>
			<Router>{routerMap(routes)}</Router>
		</Suspense>
	);
};

export default PageRoute;
