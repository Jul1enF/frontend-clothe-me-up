import styles from '../../styles/Home.module.css';
import Header from '../Header';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../reducers/user';
import Link from 'next/link'

function Home() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { infos } = router.query
  const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
  const user = useSelector((state)=>state.user.value)

  // useEffect pour gérer l'arrivée avec google et récupérer les infos du user
  
  const useEffectFunction = async () => {
    if (!infos) { return }
    const response = await fetch(`${url}/users/googleUserInfos`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          jwtToken : infos[0],
          pantsNotLinked : user.pantsNotLinked,
          topsNotLinked : user.topsNotLinked,
      })
      })
      const data = await response.json()
      dispatch(login({firstname : data.firstname, token:data.token, connectionDate: new Date(), is_admin : data.is_admin, cart_pants: data.cart_pants,  cart_tops : data.cart_tops}))
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
