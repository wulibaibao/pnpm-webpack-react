declare module "*.less";
declare module '*.module.less'
declare module '*.css'
declare module '*.module.css'
declare module '*.png'

declare type PageRoute = {
	path?: string;
	component?: React.LazyExoticComponent<React.FC<{}>>;

	name?: string;
	routes?: PageRoute[];
	redirect?: string;
};