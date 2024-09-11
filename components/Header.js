import styles from '../styles/Header.module.css'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCartShopping, faMagnifyingGlass, faScrewdriverWrench, faCaretUp, faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/user'
import { addArticles } from "../reducers/articles"
import { useRouter } from 'next/router'


export default function Header() {
    const [userMenuVisible, setUserMenuVisible] = useState(false)
    const [menuVisible, setMenuVisible] = useState(false)
    const [autocompleteVisible, setAutocompleteVisible] = useState(false)
    const [articleSearched, setArticleSearched] = useState('')

    const dispatch = useDispatch()
    const router = useRouter()
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    const user = useSelector((state) => state.user.value)
    console.log(user)

    let articlesNumber = user.cart_articles.length

    

    // Vidage du reducer user et ejection sur la page d'accueil si connexion depuis plus de deux heures. Téléchargement de tous les articles réellement en stock.

    const useEffectFunction = async () => {
        // Ejection après 120 min
        const date = new Date()
        const connexionTime = date - user.connectionDate
        if (connexionTime / 1000 / 60 > 180) {
            dispatch(logout())
            router.push('/')
            return
        }
        //Téléchargement des articles du shop (stocks réels)
        const response = await fetch(`${url}/articles/allArticles`)
        const allArticles = await response.json()

        if (allArticles.result) {
            dispatch(addArticles(allArticles.articles))
        }
    }

    useEffect(() => {
        useEffectFunction()
    }, [])



    // Liste pour l'autocomplete

    let articles = useSelector((state) => state.articles.value)
    let articlesList = []

    articles.map((e, i) => {
        if (i = 0) {
            articlesList.push({name : e.name, category : e.category})
        } else {
            !articlesList.some(item => item.name == e.name) && articlesList.push({name : e.name, category : e.category})
        }
    })

    let autocompleteList = []

    const setAutocompleteList = (typped) => {
        const regex = new RegExp(typped, "i")

        articlesList.map((e, i) => {
            regex.test(e.name) && autocompleteList.push(
                <p onClick={() => {
                    setArticleSearched(e.name)
                    setAutocompleteVisible(false)
                    e.category=="tops" ? router.push(`/tops_article/${e.name}`) : router.push(`/pants_article/${e.name}`)
                }} key={i}>{e.name}</p>
            )
        })
        if (autocompleteList.length == 0) { autocompleteList = <p>Aucun article trouvé !</p> }
    }

    setAutocompleteList(articleSearched)



    // Fonction appelée en appuyant sur entrée dans input recherche

    const inputKeyDown = (event)=>{
        if (event.code === 'Enter' && articlesList.some(item => item.name == articleSearched)){

            const itemFound = articlesList.find(e=>e.name == articleSearched)
            
            itemFound.category=="tops" ? router.push(`/tops_article/${articleSearched}`) : router.push(`/pants_article/${articleSearched}`)
        }
        else{return}
    }


    // Affichage conditionnel du lien vers le backoffice

    let boLink

    if (user.is_admin) {
        boLink = <Link href='/bo'><FontAwesomeIcon icon={faScrewdriverWrench} className={styles.boIcon}></FontAwesomeIcon></Link>
    }


    // Affichage conditionnel du prénom de l'utilisateur, du menu user et du nombre d'item dans cart

    let cartNumStyle

    articlesNumber > 0 ? cartNumStyle = { display: "flex" } : cartNumStyle = { display: "none" }

    let userName
    let userDropdown

    if (user.firstname) {
        userName = <p className={styles.userName}>{user.firstname}</p>

        userDropdown = (
            <div className={styles.userDropdownContainer} style={userMenuVisible ? { display: "flex" } : { display: "none" }}>
                <FontAwesomeIcon icon={faCaretUp} className={styles.triangle} />
                <Link href="/account"><p className={styles.firstP}>Mon compte</p></Link>
                <Link href="/"><p className={styles.lastP} onClick={() => dispatch(logout())}>Se déconnecter</p></Link>
            </div>
        )
    }
    else {
        userDropdown = (
            <div className={styles.userDropdownContainer} style={userMenuVisible ? { display: "flex" } : { display: "none" }}>
                <FontAwesomeIcon icon={faCaretUp} className={styles.triangle} />
                <Link href="/signin"><p className={styles.firstP}>Se connecter</p></Link>
                <Link href="/signup"><p className={styles.lastP}>S'inscrire</p></Link>
            </div>
        )
    }


    // Menu Dropdown

    let menuDropdown = (
        <div className={styles.userDropdownContainer} style={menuVisible ? { display: "flex" } : { display: "none" }}>
            <FontAwesomeIcon icon={faCaretUp} className={styles.triangle} />
            <p className={styles.firstP} onClick={() => router.push('/')}>Accueil</p>
            <Link href="/tops"><p className={styles.P}>Hauts</p></Link>
            <Link href="/pants"><p className={styles.lastP}>Bas</p></Link>
        </div>
    )



    return (
        <div className={styles.headerBody} onMouseLeave={() => {
            setUserMenuVisible(false)
            setMenuVisible(false)
            setAutocompleteVisible(false)
        }}>
            <div className={styles.searchContainer}>
                <div className={styles.inputContainer}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.glassIcon} />
                    <input 
                    className={styles.search} type="text" placeholder='Rechercher...' onChange={(e) =>{
                        setArticleSearched(e.target.value)
                        setAutocompleteVisible(true)
                    }} value={articleSearched}
                    onClick={()=>setAutocompleteVisible(true)}
                    onKeyDown={inputKeyDown}
                    ></input>
                    <div className={styles.autocompleteContainer} style={autocompleteVisible ? { display: "flex" } : { display: "none" }}>
                        <div className={styles.autocomplete}>
                            {autocompleteList}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.titleContainer}>
                <Link href='/'><h1 className={styles.nameSite}>CLOTHE ME UP !</h1></Link>
            </div>
            <div className={styles.iconsContainer}>
                {boLink}
                <div className={styles.menuContainer}>
                    <FontAwesomeIcon className={styles.menuIcon} icon={faBars} onClick={() => {
                        setMenuVisible(!menuVisible)
                        setUserMenuVisible(false)
                    }} />
                    {menuDropdown}
                </div>
                <div className={styles.userContainer}>
                    <FontAwesomeIcon className={styles.userIcon} icon={faUser} onClick={() => {
                        setUserMenuVisible(!userMenuVisible)
                        setMenuVisible(false)
                    }} />
                    {userName}
                    {userDropdown}
                </div>
                <div className={styles.cartContainer} onClick={() => router.push('/cart/c')}>
                    <FontAwesomeIcon className={styles.cartIcon} icon={faCartShopping} />
                </div>
                <Link href='/cart/c'><div className={styles.cartCircle} style={cartNumStyle}><p>{articlesNumber}</p></div></Link>
            </div>
        </div>
    )
}