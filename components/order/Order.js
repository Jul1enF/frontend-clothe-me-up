import styles from '../../styles/Order.module.css'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import Header3 from '../Header3'
import Address from './Address'
import Delivery from './Delivery'
import Payment from './Payment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Order() {

    const user = useSelector((state) => state.user.value)

    const [step, setStep] = useState('address')



    // État bidon juste là pour reseter le composant adresse au click sur le nom de la catégorie

    const [toogleAddressComponent, setToogleAddressComponent]=useState(false)


    

    //Fonctions IDF et états pour remonter les choix de commande

    const [chosenAddress, setChosenAddress] = useState({})
    const [chosenAddress2, setChosenAddress2] = useState('')
    const [deliveryMode, setDeliveryMode] = useState('')
    const [deliveryPrice, setDeliveryPrice] = useState(0)


    function getAddress(address) {
        setChosenAddress(address)
    }

    function getAddress2(address2) {
        setChosenAddress2(address2)
    }

    function changeStep(nextStep) {
        setStep(nextStep)
    }

    function getDeliveryMode(delivery) {
        setDeliveryMode(delivery)
    }

    function getDeliveryPrice(price) {
        setDeliveryPrice(price)
    }




    // Calcul du montant total des articles + frais de port
    let totalArticles = 0

    user.cart_articles.length > 0 && user.cart_articles.map(e => totalArticles += e.price)

    let total = totalArticles + deliveryPrice



    // Affichage conditionnel des composants en fonction de l'étape en cours

    let content

    if (step === "address") {
        content = <Address addresses={user.addresses} token={user.token} getAddress={getAddress} changeStep={changeStep} toogleAddressComponent={toogleAddressComponent}/>
    } else if (step === "delivery") {
        content = <Delivery changeStep={changeStep} totalArticles={totalArticles} getDeliveryMode={getDeliveryMode} getDeliveryPrice={getDeliveryPrice} getAddress2={getAddress2} chosenAddress={chosenAddress}/>
    } else if (step == "payment") {
        content = <Payment changeStep={changeStep} total={total} totalArticles={totalArticles} cart_articles={user.cart_articles} jwtToken={user.token} chosenAddress={chosenAddress} chosenAddress2={chosenAddress2} deliveryMode={deliveryMode} deliveryPrice={deliveryPrice} />
    } else if (step == "ordered") {
        content = <div className={styles.successContainer}>
            <h3>Félicitation, votre achat est bien validé ! Votre commande arrive bientôt !</h3>
            <h3>Un email de confirmation avec votre reçu vous a été adressé (pensez à vérifier vos spams).</h3>
        </div>
    }




    // Affichage conditionnel des flèches en fonction de l'étape

    let addresseStyle
    step === "address" ? addresseStyle = { color: "rgb(13, 1, 102)" } : addresseStyle = { color: "transparent" }

    let deliveryStyle
    step === "delivery" ? deliveryStyle = { color: "rgb(13, 1, 102)" } : deliveryStyle = { color: "transparent" }

    let paymentStyle
    step === "payment" ? paymentStyle = { color: "rgb(13, 1, 102)" } : paymentStyle = { color: "transparent" }

    let validationStyle
    step === "ordered" ? validationStyle = { color: "rgb(13, 1, 102)" } : validationStyle = { color: "transparent" }




    // Fonction appelée au click sur les noms d'étapes pour revenir à celles ci

    const addressClick = ()=>{
        if (step=== "ordered"){return}
        else {
            setStep("address")
            setToogleAddressComponent(previousState => !previousState)
        }
    }

    const deliveryClick = ()=>{
        if (step=== "ordered" || step === "address"){return}
        else {setStep("delivery")}
    }

    return (
        <div className={styles.body}>
            <Header3 />
            <div className={styles.leftContainer}>
                <h2 className={styles.title}>Commander</h2>
                <div className={styles.line}></div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.stepsTitleContainer}>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={addresseStyle} className={styles.arrowIcon} />
                        <h2 className={`${styles.title2} ${step == "address" && styles.chosenCategory}`} onClick={()=>addressClick()}>Adresse de livraison</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={deliveryStyle} className={styles.arrowIcon} />
                        <h2 className={`${styles.title2} ${step == "delivery" && styles.chosenCategory}`}onClick={()=>deliveryClick()}>Mode de livraison</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={paymentStyle} className={styles.arrowIcon} />
                        <h2 className={`${styles.title3} ${step == "payment" && styles.chosenCategory}`}>Paiement</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={validationStyle} className={styles.arrowIcon} />
                        <h2 className={`${styles.title3} ${step == "ordered" && styles.chosenCategory}`}>Validation</h2>
                    </div>
                </div>
                <div className={styles.line2}></div>
                <div className={styles.stepContainer}>
                    {content}
                </div>
            </div>
        </div>
    )
}