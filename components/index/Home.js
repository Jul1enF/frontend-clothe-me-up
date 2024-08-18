import styles from '../../styles/Home.module.css';
import Header from '../Header';

function Home() {
  return (
    <div className={styles.body}>
      <Header/>
      <div className={styles.leftContainer}>
        <div className={styles.topsContainer}>
          <h2 className={styles.tops}>HAUTS</h2>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.downsContainer}>
          <h2 className={styles.downs}>BAS</h2>
        </div>
      </div>
    </div>
  );
}

export default Home;
