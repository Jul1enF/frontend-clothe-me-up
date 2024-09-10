import styles from "../../styles/Payment.module.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useDispatch } from "react-redux"
import { deleteCartArticle, actualiseCart, addOrder } from "../../reducers/user"
import Image from 'next/image'

export default function Payment(props) {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const router = useRouter()
    const dispatch = useDispatch()

    let total = props.total.toFixed(2)

    // useEffect pour vérifier que les articles sélectionnés sont bien encore dans les collections panier ou dans le stock

    const useEffectFunction = async () => {
        const response = await fetch(`${url}/orders/checkArticles`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cart_articles: props.cart_articles,
                jwtToken: props.jwtToken,
            })
        })

        const data = await response.json()
        console.log(data)
        if (!data.result) {
            setError("Erreur, merci de vous reconnecter.")
            setTimeout(() => { router.push("/") }, "4000")
        }
        if (data.badChange && data.articlesRemoved.length > 0) {
            data.articlesRemoved.map(e => dispatch(deleteCartArticle(e)))
            setError("Des articles de votre panier ne sont malheureusement plus disponibles !")
        }
    }

    useEffect(() => {
        useEffectFunction()
    }, [])

    // Affichage conditionnel des articles et du total

    let articles

    // Mise en commun de tous les articles et tri par date d'ajout au panier
    let allArticles = []
    props.cart_articles.map(e => allArticles.push(e))

    allArticles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Map pour afficher tous les articles
    articles = allArticles.map((e, i) => {
        return <div className={styles.articleContainer} key={i}><h5 className={styles.articleName}>- {e.name},</h5><h5 className={styles.articleSize}> Taille : {e.size} ,</h5><h5 className={styles.articlePrice}> Prix : {e.price.toFixed(2)}€</h5></div>
    })

    // États pour erreur et infos CB

    const [error, setError] = useState("")

    const [CardNumber, setCardNumber]=useState('')
    const [CardYear, setCardYear]=useState('')
    const [CardMonth, setCardMonth]=useState('')
    const [CardCVV, setCardCVV]=useState('')

    // Reg Ex pour les champs de la CB

    const regexNum = /[0-9]{16}/
    const numValid = regexNum.test(CardNumber)

    const regexMonth = /0[1-9]|1[0-2]/
    const monthValid = regexMonth.test(CardMonth)

    const regexYear = /[0-9]{4}/
    const yearValid = regexYear.test(CardYear)

    const regexCVV = /[0-9]{3}/
    const cvvValid = regexCVV.test(CardCVV)


    // Fonction appelée au click sur régler

    const payClick=async()=>{
        // Conditions pour vérifier que les champs CB ont été bien remplis

        if (!CardNumber || !CardMonth || !CardYear || !CardCVV){
            setError("Merci de remplir tous les champs ci dessous")
            return
        }
        if(!numValid){
            setError("Numéro de carte : Caractères manquants ou erronés")
            return
        }
        if(!monthValid){
            setError("Mois d'expiration : Caractères manquants ou erronés")
            return
        }
        if(!yearValid){
            setError("Année d'expiration : Merci d'écrire l'année avec 4 chiffres")
            return
        }
        if(!cvvValid){
            setError("Numéro de sécurité : Caractères manquants ou erronés")
            return
        }

        // Récupération de l'adresse ip du user

        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        
        const ClientIp = data.ip

        // Appel de la route pour payer

        const answer = await fetch(`${url}/orders/payOrder`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cart_articles: props.cart_articles,
                jwtToken: props.jwtToken,
                totalArticles : props.totalArticles,
                deliveryPrice: props.deliveryPrice,
                total: props.total,
                chosenAddress: props.chosenAddress,
                chosenAddress2: props.chosenAddress2,
                deliveryMode: props.deliveryMode,
                CardNumber,
                CardMonth,
                CardYear,
                CardCVV,
                ClientIp,
            })
        })
        const orderResult = await answer.json()
        console.log(orderResult)

        // Si token expiré
        if(!orderResult.result){
            setError("Payement non débité, expiration de votre connexion. Merci de vous reconnecter")
            setTimeout(()=>{router.push('/')},"4000")
        }
        // Si articles plus dispo
        else if (!orderResult.payment && missingArticles){
            setError(orderResult.errorSentence)
            orderResult.articlesRemoved.map(e=>dispatch(deleteCartArticle(e)))
             setTimeout(()=>{router.push('/cart/c')},"4000")
        }
        // Si payement refusé
        else if (!orderResult.payment){
            setError(orderResult.errorSentence)
        }
        // Si payement réussi
        else if (orderResult.result && orderResult.payment){
            dispatch(actualiseCart({cart_articles : []}))
            dispatch(addOrder(orderResult.newSavedOrder))
            props.changeStep("ordered")
        }

    }


    return (
        <div className={styles.body}>
            <h3>Récapitulatif</h3>
            <div className={styles.line}></div>
            <div className={styles.articlesContainer}>
                {articles}
            </div>
            <h4>Total (avec frais de port) : {total}€</h4>
            <div className={styles.line2}></div>
            <h4 style={{ color: "rgb(230, 25, 25)" }}>{error}</h4>
            <h5 className={styles.paymentSentence}>Faux règlement (mettre faux chiffres cb)</h5>
            <div className={styles.paymentContainer}>
                <div className={styles.cardInfosContainer}>
                    <h6>Votre carte</h6>
                    <div className={styles.cardLogosContainer}>
                        <div className={styles.logoImgContainer}>
                            <Image src='/cb.jpg' alt="logo carte bleue" layout="fill" objectFit="contain" />
                        </div>
                        <div className={styles.logoImgContainer}>
                            <Image src='/visa.png' alt="logo visa" layout="fill" objectFit="contain" />
                        </div>
                        <div className={styles.logoImgContainer}>
                            <Image src='/mastercard.png' alt="logo mastercard" layout="fill" objectFit="contain" />
                        </div>
                    </div>
                </div>
                <input type="text" className={styles.cardNumberInput} placeholder="Numéro de votre carte" maxLength="16" onChange={(e)=>{
                    setError('')
                    setCardNumber(e.target.value)
                }} value={CardNumber}></input>
                <div className={styles.moreInfosContainer}>
                    <div className={styles.expirationContainer}>
                        <h6 className={styles.expirationSentence}>Expiration</h6>
                        <div className={styles.expirationInputContainer}>
                            <input type="text" className={styles.monthInput} placeholder="MM" maxLength="2" onChange={(e)=>{
                                setError('')
                                setCardMonth(e.target.value)
                            }} value={CardMonth}></input>
                            <input type="text" className={styles.yearInput} placeholder="AAAA" maxLength="4" onChange={(e)=>{
                                setError('')
                                setCardYear(e.target.value)
                            }} value={CardYear}></input>
                        </div>
                    </div>
                    <div className={styles.securityContainer}>
                        <h6>Code de sécurité</h6>
                        <input type="text" className={styles.cvvInput} placeholder="CVV" maxLength="3" onChange={(e)=>{
                            setError('')
                            setCardCVV(e.target.value)
                        }} value={CardCVV}></input>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button onClick={()=>payClick()}>Régler {total}€</button>
                </div>
            </div>
        </div>
    )
}