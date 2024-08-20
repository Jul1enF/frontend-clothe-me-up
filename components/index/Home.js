import styles from '../../styles/Home.module.css';
import Header from '../Header';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../reducers/user';
import Link from 'next/link'

function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { infos } = router.query

  const useEffectFunction = () => {
    if (!infos) { return }
    dispatch(login({ firstname: infos[0], token: infos[1], connectionDate: new Date() }))
  }

  useEffect(() => {
    useEffectFunction()
  }, [infos])

  return (
    <div className={styles.body}>
      <Header />
      <div className={styles.leftContainer}>
        <div className={styles.topsContainer}>
          <h2 className={styles.tops}>HAUTS</h2>
        </div>
      </div>
      <div className={styles.rightContainer}>
        <div className={styles.downsContainer}>
          <Link href='/downs'><h2 className={styles.downs}>BAS</h2></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
