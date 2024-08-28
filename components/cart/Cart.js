import styles from '../../styles/Cart.module.css'
import Header2 from '../Header2'
import Link from 'next/link'
import CartItem from './CartItem';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux'
import { login, actualiseCart } from '../../reducers/user'
import { useEffect, useState } from 'react'

export default function Cart() {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const router = useRouter()
    const dispatch = useDispatch()
    const { infos } = router.query
    const user = useSelector((state) => state.user.value)
    console.log(user)

    const [error, setError] = useState('')

    // Fonction useEffect pour vérifier que les articles mis dans le panier sont encore dispos (dans les collections cart) et gérer l'arrivée avec la connexion Google

    const useEffectFunction = async () => {
        // Si arrivée avec Google, récup des infos users
        if (!infos) { return }
        if (infos[0] == 'g') {
            const response = await fetch(`${url}/cart/googleUserInfos`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jwtToken: infos[1],
                    pantsNotLinked: user.pantsNotLinked,
                    topsNotLinked: user.topsNotLinked,
                })
            })
            const data = await response.json()
            dispatch(login({ firstname: data.firstname, token: data.token, connectionDate: new Date(), is_admin: data.is_admin, cart_pants: data.cart_pants, cart_tops: data.cart_tops }))
            if (data.change) {
                setError('Des articles de votre panier ont été remis en rayon !')
                setTimeout(() => setError(''), "4000")
            }
            return
        }

        // Sinon vérif des dispos des articles mis dans le panier

        if (user.cart_pants.length > 0 || user.cart_tops.length > 0) {

            let jwtToken

            if (user.token) { jwtToken = user.token }

            const response = await fetch(`${url}/cart/checkArticles`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pantsNotLinked: user.pantsNotLinked,
                    topsNotLinked: user.topsNotLinked,
                    cart_pants: user.cart_pants,
                    cart_tops: user.cart_tops,
                    jwtToken,
                })
            })

            const data = await response.json()

            // Actualisation du panier quand pas connecté
            if (data.change && !jwtToken) {
                dispatch(login({
                    pantsNotLinked: data.pantsNotLinked,
                    topsNotLinked: data.topsNotLinked,
                    cart_pants: data.cart_pants,
                    cart_tops: data.cart_tops,
                }))
                setError('Des articles de votre panier ont été remis en rayon !')
                setTimeout(() => setError(''), "4000")
            }
            // Actualisation du panier quand connecté
            else if (data.change) {
                dispatch(actualiseCart({
                    cart_pants: data.cart_pants,
                    cart_tops: data.cart_tops,
                }))
                setError('Des articles de votre panier ont été remis en rayon !')
                setTimeout(() => setError(''), "4000")
            }
        }
        else { return }
    }

    useEffect(() => {
        useEffectFunction()
    }, [infos])


    // Affichage conditionnel des articles et du total

    let articles
    let total = 0

    if (user.cart_tops.length == 0 && user.cart_pants.length == 0) {
        articles = <h4>Aucun article enregistré !</h4>
    } else {
        // Mise en commun de tous les articles et tri par date d'ajout au panier
        let allArticles = []
        user.cart_pants.map(e => allArticles.push(e))
        user.cart_tops.map(e => allArticles.push(e))

        allArticles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        console.log(allArticles)

        articles = allArticles.map((e, i) => {
            return <CartItem key={i} {...e} />
        })

        allArticles.map(e=>total+=e.price)
    }

    let totalSection
    if(total>0){
        totalSection = <h3 className={styles.total}>Total : {total.toFixed(2)}€</h3>
    }


    // Affichage conditionnel des boutons pour commander ou se connecter

    let payment
    let sentence
    if (user.cart_tops.length == 0 && user.cart_pants.length == 0 && !user.token) {
        payment = <div className={styles.connexionContainer}>
            <Link href="/signin"><button className={styles.orderBtn}>Se connecter</button></Link>
            <Link href="/signup"><button className={styles.orderBtn}>S'inscrire</button></Link>
        </div>
    }
    else if (user.cart_tops.length == 0 && user.cart_pants.length == 0 && user.token){
        payment=<></>
    }
    else if (user.token) {
        payment = <div className={styles.connexionContainer}>
            <Link href="/order"><button className={styles.orderBtn}>Commander</button></Link>
        </div>
    }
    else {
        sentence = <h3 className={styles.connexion}>Connectez vous pour commander :</h3>

        payment = <div className={styles.connexionContainer}>
            <Link href="/signin"><button className={styles.orderBtn}>Se connecter</button></Link>
            <Link href="/signup"><button className={styles.orderBtn}>S'inscrire</button></Link>
        </div>
    }

    return (
        <div className={styles.body}>
            <Header2 />
            <div className={styles.topContainer}></div>
            <div className={styles.downContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Mon Panier</h2>
                </div>
                <div className={styles.lineContainer}>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.rightContainer}>
                    <h2>Mes articles</h2>
                    <div className={styles.articlesContainer}>
                        {articles}
                    </div>
                    {totalSection}
                    {sentence}
                    {payment}
                </div>
            </div>
            <h4 className={styles.error}>{error}</h4>
        </div>
    )
}