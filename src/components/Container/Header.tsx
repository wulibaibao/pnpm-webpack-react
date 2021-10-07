import routes from "../../../config/routes";
import { Link } from "react-router-dom";
import styles from "./header.less";

const Header: React.FC = () => {
	return (
		<div>
			{routes.map(
				(item: PageRoute) =>
					item.path && (
						<Link
							className={styles["margin-right-8"]}
							key={item.path}
							to={item.path}
						>
							{item.name}
						</Link>
					)
			)}
		</div>
	);
};
export default Header;
