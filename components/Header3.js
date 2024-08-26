import styles from '../styles/Header3.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCartShopping, faMagnifyingGlass, faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/user'
import {useRouter} from 'next/router'



export default function Header() {
    const [userMenuVisible, setUserMenuVisible] = useState(false)
    const [search, setSearch]=useState('')

    const dispatch=useDispatch()
    const router = useRouter()

    const user = useSelector((state) => state.user.value)

    // Vidage du reducer user et ejection sur la page d'accueil si connexion depuis plus de deux heures.

    useEffect(()=>{
        const date = new Date()
        const connexionTime = date - user.connectionDate
        if(connexionTime/1000/60 > 120){
            dispatch(logout())
            router.push('/')
        }
    },[])

    // Affichage conditionnel du lien vers le backoffice

    let boLink

    if (user.is_admin){
       boLink= <Link href='/bo'><FontAwesomeIcon icon={faScrewdriverWrench}className={styles.boIcon}></FontAwesomeIcon></Link>
    }

    // Affichage conditionnel du prénom de l'utilisateur et du menu user

    let userName
    let userDropdown

    if (user.firstname) {
        userName = <p className={styles.userName}>{user.firstname}</p>

        userDropdown = (
            <div className={styles.userDropdownContainer} style={userMenuVisible ? { display: "flex" } : { display: "none" }}>
                <p className={styles.firstP}>Mon compte</p>
                <Link href="/"><p className={styles.lastP} onClick={()=>dispatch(logout())}>Se déconnecter</p></Link>
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
                    <input className={styles.search} type="text" placeholder='Rechercher...' onChange={(e)=>setSearch(e.target.value)} value={search}></input>
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
                <FontAwesomeIcon className={styles.cartIcon} icon={faCartShopping} />
            </div>
        </div>
    )
}