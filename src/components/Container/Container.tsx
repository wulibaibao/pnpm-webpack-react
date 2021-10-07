import Footer from "@/components/Container/Footer";
import Header from "@/components/Container/Header";
import logoPic from "@/assets/React-Hook.png";
import styles from "./container.less";

const Container: React.FC = ({ children }) => {
	return (
		<>
			<Header />
			<div className={styles.body}>
				<img className={styles.logo} src={logoPic} />
				{children}
			</div>
			<Footer />
		</>
	);
};

export default Container;
