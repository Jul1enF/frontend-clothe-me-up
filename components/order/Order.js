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

    //Fonctions IDF et états pour remonter les choix de commande

    const [chosenAdresse, setChosenAdresse] = useState({})
    const [chosenAdresse2, setChosenAdresse2] = useState('')
    const [deliveryMode, setDeliveryMode] = useState('')
    const [deliveryPrice, setDeliveryPrice] = useState(0)

    function getAddresse(addresse) {
        setChosenAdresse(addresse)
    }

    function getAddresse2(addresse2) {
        setChosenAdresse2(addresse2)
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

    user.cart_pants.length > 0 && user.cart_pants.map(e => totalArticles += e.price)

    user.cart_tops.length > 0 && user.cart_tops.map(e => totalArticles += e.price)

    let total = totalArticles + deliveryPrice

    // Affichage conditionnel des composants en fonction de l'étape en cours

    let content

    if (step === "address") {
        content = <Address addresses={user.addresses} token={user.token} getAddresse={getAddresse} changeStep={changeStep} />
    } else if (step === "delivery") {
        content = <Delivery changeStep={changeStep} totalArticles={totalArticles} getDeliveryMode={getDeliveryMode} getDeliveryPrice={getDeliveryPrice} getAddresse2={getAddresse2} />
    } else if (step == "payment") {
        content = <Payment total={total} totalArticles={totalArticles} cart_pants={user.cart_pants} cart_tops={user.cart_tops} jwtToken={user.token} chosenAdresse={chosenAdresse} chosenAdresse2={chosenAdresse2} deliveryMode={deliveryMode} deliveryPrice={deliveryPrice} />
    }

    let addresseStyle
    step === "address" ? addresseStyle = { color: "rgb(13, 1, 102)" } : addresseStyle = { color: "transparent" }

    let deliveryStyle
    step === "delivery" ? deliveryStyle = { color: "rgb(13, 1, 102)" } : deliveryStyle = { color: "transparent" }

    let paymentStyle
    step === "payment" ? paymentStyle = { color: "rgb(13, 1, 102)" } : paymentStyle = { color: "transparent" }


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
                        <h2 className={styles.title2}>Adresse de livraison</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={deliveryStyle} className={styles.arrowIcon} />
                        <h2 className={styles.title2}>Mode de livraison</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={paymentStyle} className={styles.arrowIcon} />
                        <h2 className={styles.title2}>Paiement</h2>
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