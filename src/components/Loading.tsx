import styles from "./loading.less";

const Loading: React.FC = () => {
	return (
		<div className={styles.loading}>
			<div className={styles.loader} />
		</div>
	);
};

export default Loading;
