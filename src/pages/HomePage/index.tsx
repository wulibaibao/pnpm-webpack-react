import styles from "./index.less";
import Loading from "@/components/Loading";
import { useEffect, useState } from "react";

const HomePage: React.FC = () => {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	if (loading) return <Loading />;
	return <div className={styles.color}>this page is home page</div>;
};

export default HomePage;
