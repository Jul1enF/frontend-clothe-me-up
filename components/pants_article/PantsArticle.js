import styles from '../../styles/PantsArticle.module.css'
import Header3 from '../Header3'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { addCartArticle, addArticleNotLinked } from '../../reducers/user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'


export default function PantsArticle() {

    const router = useRouter()
    const { infos } = router.query
    const dispatch = useDispatch()
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    let allArticles = useSelector((state) => state.articles.value)
    let pants = allArticles.filter(e => e.category == "pants")
    const user = useSelector((state) => state.user.value)

    const [articles, setArticles] = useState([])
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuSentence, setMenuSentence] = useState('Choisissez votre taille')
    const [chosenSize, setChosenSize] = useState('')

    const useEffectFunction = () => {
        if (!infos) { return }
        else {
            setArticles(pants.filter(e => e.name == infos[0]))
        }
    }

    useEffect(() => {
        useEffectFunction()
    }, [infos])

    let img
    let name
    let price
    let description
    let stocks = []
    let sizesDropdown = []

    // Enregistrement en conditionnel des attributs de l'article pour le premier render sans enregistrement du router.query

    if (articles.length > 0) {
        img = <Image src={articles[0].imgUrl} alt="Une image de vêtement" layout="fill" objectFit='contain' />

        name = articles[0].name
        price = articles[0].price.toFixed(2).toString() + "€"
        description = articles[0].description

        // Mise en place d'un tableau d'objets des stocks en fonction des tailles

        articles.map((e, i) => {
            if (i === 0) { stocks.push({ size: e.size, stock: 1 }) }
            else {
                let sizeFound = false
                stocks.map(j => {
                    if (j.size === e.size) {
                        j.stock++
                        sizeFound = true
                    }
                })
                if (!sizeFound) { stocks.push({ size: e.size, stock: 1 }) }
            }
        })


        // Map des stocks pour le dropdown des tailles

        stocks.map((e, i) => {
            sizesDropdown.push(
                <div className={styles.stocks} key={i} onClick={() => sizeClick(e.size)}>
                    <p className={styles.size}>Taille : {e.size}</p>
                    <p className={styles.stock}>(stock : {e.stock})</p>
                </div>
            )
        })
    }

    // Condition pour affichage ou non dropdown

    let dropStyle
    menuVisible ? dropStyle = { display: "flex" } : dropStyle = { display: "none" }

    // Fonction appelée au click sur une taille

    const sizeClick = (size) => {
        setMenuSentence(`${articles[0].name} (taille : ${size})`)
        setChosenSize(size)
    }

    // Affichage avec moins d'opacité du bouton d'ajout au panier si pas de taille sélectionnée

    let cartBtnStyle

    if (menuSentence === "Choisissez votre taille") { cartBtnStyle = { border: "none", backgroundColor: "rgb(13, 1, 102, 30%)" } }


    // Fonction appelée au click de rajout dans panier

    const cartBtnClick = async () => {
        if (!chosenSize) { return }
        const chosenSizeArticles = articles.filter(e => e.size == chosenSize)

        let jwtToken
        if (user.token) { jwtToken = user.token }

        const response = await fetch(`${url}/articles/addCartArticle`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jwtToken,
                _id: chosenSizeArticles[0]._id
            })
        })
        const data = await response.json()
        dispatch(addCartArticle(data.cartArticleSaved))
        // Si l'utilisateur pas connecté, mise de côté id item
        if (data.noLink) { dispatch(addArticleNotLinked(data.noLink)) }

        setMenuSentence('Choisissez votre taille')
        setChosenSize('')
        setArticles(articles.filter(e => e._id !== chosenSizeArticles[0]._id))
    }

    return (
        <div className={styles.body}>
            <Header3 />
            <div className={styles.leftContainer}>
                <div className={styles.imgContainer}>
                    {img}
                </div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>{name}</h2>
                </div>
                <div className={styles.line}></div>
                <div className={styles.productInfosContainer}>
                    <h4 className={styles.price}>{price}</h4>
                    <p className={styles.description}>{description}</p>
                    <div className={styles.sizeMenu} onClick={() => setMenuVisible(!menuVisible)}>
                        <p className={styles.menuSentence}>{menuSentence}</p>
                        <FontAwesomeIcon icon={faChevronDown} className={styles.dropDownIcon}></FontAwesomeIcon>
                        <div className={styles.dropContainer} style={dropStyle} >
                            <div className={styles.dropDown} onMouseLeave={() => setMenuVisible(false)}>
                                {sizesDropdown}
                            </div>
                        </div>
                    </div>
                    <button className={styles.cartBtn} style={cartBtnStyle} onClick={() => cartBtnClick()}>Ajouter au panier</button>
                </div>
            </div>
        </div>
    )
}