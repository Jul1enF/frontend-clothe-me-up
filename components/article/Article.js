import styles from '../../styles/Article.module.css'
import Header3 from '../Header3'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'


export default function Article() {

    const router = useRouter()
    const { infos } = router.query
    const pants = useSelector((state) => state.pants.value)

    const [article, setArticle] = useState({})
    const [menuVisible, setMenuVisible] = useState(false)
    const [menuSentence, setMenuSentence] = useState('Choisissez votre taille')
    const [chosenArticle, setChosenArticle] = useState('')

    console.log(article)


    const useEffectFunction = () => {
        if (!infos) { return }
        else if (infos[1] == "pants") {
            pants.map(e => {
                if (e._id == infos[0]) {
                    setArticle(e)
                }
            })
        }
    }

    useEffect(() => {
        useEffectFunction()
    }, [infos])

    let img
    let name
    let price
    let description
    let sizesDropdown = []
    
    // Enregistrement en conditionnel des attributs de l'article pour le premier render sans enregistrement du router.query

    if (article.imgUrl) {
        img = <Image src={article.imgUrl} alt="Une image de vêtement" layout="fill" objectFit='contain' />

        name = article.name
        price = article.price.toFixed(2).toString() + "€"
        description = article.description

        // Map des stocks pour le dropdown des tailles

        article.stocks.map((e, i) => {
            if (e.stock == 0) {
                sizesDropdown.push(
                    <div className={styles.empty} key={i}>
                        <p className={styles.size}>Taille : {e.size}</p>
                        <p className={styles.stock}>(stock : {e.stock})</p>
                    </div>
                )
            }
            else {
                sizesDropdown.push(
                    <div className={styles.stocks} key={i} onClick={()=>sizeClick(e.size, e._id)}>
                        <p className={styles.size}>Taille : {e.size}</p>
                        <p className={styles.stock}>(stock : {e.stock})</p>
                    </div>
                )
            }
        })

    }

    let dropStyle
    menuVisible ? dropStyle={display :"flex"} : dropStyle={display :"none"}

    // Fonction appelée au click sur une taille

    const sizeClick=(size, id)=>{
        setMenuSentence(`${article.name} (taille : ${size})`)
    }

    // Affichage avec moins d'opacité du bouton d'ajout au panier si pas de taille sélectionnée

    let cartBtnStyle

    if(menuSentence==="Choisissez votre taille"){cartBtnStyle={border: "none", backgroundColor: "rgb(13, 1, 102, 30%)"}}

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
                        <div className={styles.dropDown} style={dropStyle}>
                            {sizesDropdown}
                        </div>
                    </div>
                    <button className={styles.cartBtn} style={cartBtnStyle}>Ajouter au panier</button>
                </div>
            </div>
        </div>
    )
}