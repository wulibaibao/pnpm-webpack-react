import routes from "../../../config/routes";
import { Link } from "react-router-dom";
import styles from "./header.less";
import { Menu } from "antd";

const Header: React.FC = () => {
	return (
		<div>
			<Menu mode="horizontal">
				{routes.map(
					(item: PageRoute) =>
						item.path && (
							<Menu.Item key={item.path}>
								<Link
									className={styles["margin-right-8"]}
									to={item.path}
								>
									{item.name}
								</Link>
							</Menu.Item>
						)
				)}
			</Menu>
		</div>
	);
};

export default Header;
