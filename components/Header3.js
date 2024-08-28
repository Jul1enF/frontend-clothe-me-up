import styles from '../styles/Header3.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCartShopping, faMagnifyingGlass, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/user'
import { addPants } from '../reducers/pants'
import { addTops} from '../reducers/tops'
import { useRouter } from 'next/router'



export default function Header() {
    const [userMenuVisible, setUserMenuVisible] = useState(false)
    const [search, setSearch] = useState('')

    const dispatch = useDispatch()
    const router = useRouter()
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    const user = useSelector((state) => state.user.value)
    console.log(user)

    const articlesNumber = user.cart_pants.length + user.cart_tops.length

    // Vidage du reducer user et ejection sur la page d'accueil si connexion depuis plus de deux heures. Téléchargement de tous les articles réellement en stock.

    const useEffectFunction = async () => {
        // Ejection après 120 min
        const date = new Date()
        const connexionTime = date - user.connectionDate
        if (connexionTime / 1000 / 60 > 120) {
            dispatch(logout())
            router.push('/')
            return
        }

        //Téléchargement pantalons du shop (stocks réels)
        const response = await fetch(`${url}/pants/allPants`)
        const allPants = await response.json()
        if (allPants.result) {
            dispatch(addPants(allPants.pants))
        }

          //Téléchargement hauts du shop (stocks réels)
          const response2 = await fetch(`${url}/tops/allTops`)
          const allTops = await response2.json()
          if (allTops.result) {
              dispatch(addTops(allTops.tops))
          }
    }

    useEffect(() => {
        useEffectFunction()
    }, [])


    // Affichage conditionnel du lien vers le backoffice

    let boLink

    if (user.is_admin) {
        boLink = <Link href='/bo'><FontAwesomeIcon icon={faScrewdriverWrench} className={styles.boIcon}></FontAwesomeIcon></Link>
    }

    // Affichage conditionnel du prénom de l'utilisateur, du menu user et du nombre d'item dans cart

    let cartNumStyle

    articlesNumber>0 ? cartNumStyle={display:"flex"} : cartNumStyle={display:"none"}

    let userName
    let userDropdown

    if (user.firstname) {
        userName = <p className={styles.userName}>{user.firstname}</p>

        userDropdown = (
            <div className={styles.userDropdownContainer} style={userMenuVisible ? { display: "flex" } : { display: "none" }}>
                <p className={styles.firstP}>Mon compte</p>
                <Link href="/"><p className={styles.lastP} onClick={() => dispatch(logout())}>Se déconnecter</p></Link>
            </div>
        )
    }
    else {
        userDropdown = (
            <div className={styles.userDropdownContainer} style={userMenuVisible ? { display: "flex" } : { display: "none" }}>
                <Link href="/signin"><p className={styles.firstP}>Se connecter</p></Link>
                <Link href="/signup"><p className={styles.lastP}>S'inscrire</p></Link>
            </div>
        )
    }
    return (
        <div className={styles.headerBody} onMouseLeave={() => setUserMenuVisible(false)}>
            <div className={styles.searchContainer}>
                <div className={styles.inputContainer}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.glassIcon} />
                    <input className={styles.search} type="text" placeholder='Rechercher...' onChange={(e) => setSearch(e.target.value)} value={search}></input>
                </div>
            </div>
            <div className={styles.titleContainer}>
                <Link href='/'><h1 className={styles.nameSite}>CLOTHE ME UP !</h1></Link>
            </div>
            <div className={styles.iconsContainer}>
                {boLink}
                <div className={styles.userContainer}>
                    <FontAwesomeIcon className={styles.userIcon} icon={faUser} onClick={() => setUserMenuVisible(!userMenuVisible)} />
                    {userName}
                    {userDropdown}
                </div>
                <FontAwesomeIcon className={styles.cartIcon} icon={faCartShopping} onClick={()=>router.push('/cart/c')}/>
                <Link href='/cart/c'><div className={styles.cartCircle} style={cartNumStyle}><p>{articlesNumber}</p></div></Link>
            </div>
        </div>
    )
}