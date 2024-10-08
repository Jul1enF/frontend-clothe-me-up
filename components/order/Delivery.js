import styles from "../../styles/Delivery.module.css"
import Image from "next/image"
// import Pickups from "./Pickups"
import dynamic from 'next/dynamic'
const Pickups = dynamic(() => import("./Pickups"), { ssr: false })
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

export default function Delivery(props) {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    const [chosenDelivery, setChosenDelivery] = useState('')
    const [deliveryPrice, setDeliveryPrice] = useState(0)

    const [pickupAddresses, setPickupAddresses] = useState("")
    const [pickupsVisible, setPickupsVisible] = useState(false)


    // useEffect pour obtenir les adresses de point relais

    const useEffectFunction = async()=>{
        const response = await fetch(`${url}/deliveries/pickups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chosenAddress: props.chosenAddress,
            })
        })
        const data = await response.json()

        setPickupAddresses(data.pickups)
    }

    useEffect(()=>{
        useEffectFunction()
    },[])


    // Fixation du prix d'envoi en fonction frais de port offerts ou non

    let colissimoPrice
    props.totalArticles >= 0.4 ? colissimoPrice = 0.00 : colissimoPrice = 0.20

    // Fonction appelée au click pour sélectionner un mode d'envoi
    const selectClick = () => {
        if (chosenDelivery == "Colissimo : Point de retrait") {
            return
        }
        props.getDeliveryMode(chosenDelivery)
        props.getDeliveryPrice(deliveryPrice)
        props.changeStep("payment")
    }

    // Fonction à envoyer en props à Pickups pour IDF et enregistrement du point de retrait colissimo

    const choosePickup = (pickup) => {
        props.getAddress2(pickup)
        props.getDeliveryMode(chosenDelivery)
        props.getDeliveryPrice(deliveryPrice)
        props.changeStep("payment")
    }


    return (
        <div className={styles.body}>
            <div className={styles.transporterContainer}>
                <input type="radio" id="colissimo1" name="transporter" value="Colissimo : Domicile sans signature" onChange={(e) => {
                    setChosenDelivery(e.target.value)
                    setDeliveryPrice(colissimoPrice)
                    setPickupsVisible(false)
                    props.getAddress2('')
                }}></input>
                <label htmlFor="colissimo1">
                    <div className={styles.imgContainer}>
                        <Image src="/colissimo.png" alt="logo colissimo" layout="fill" objectFit="contain" objectPosition='left' />
                    </div>
                    <div className={styles.deliverySentence}>
                        <h4>Colissimo : Domicile sans signature</h4>
                    </div>
                    <h4>{colissimoPrice.toFixed(2)} €</h4>
                </label>
            </div>
            <div className={`${styles.colissimo2Container} ${styles.transporterContainer}`}>
                <div className={styles.inputAndLabelContainer}>
                    <input type="radio" id="colissimo2" name="transporter" value="Colissimo : Point de retrait" onChange={(e) => {
                        setChosenDelivery(e.target.value)
                        setDeliveryPrice(colissimoPrice)
                    }} onClick={() => setPickupsVisible(true)}></input>
                    <label htmlFor="colissimo2">
                        <div className={styles.imgContainer}>
                            <Image src="/colissimo.png" alt="logo colissimo" layout="fill" objectFit="contain" objectPosition="left" />
                        </div>
                        <div className={styles.deliverySentence}>
                            <h4>Colissimo : Point de retrait</h4>
                        </div>
                        <h4>{colissimoPrice.toFixed(2)} €</h4>
                    </label>
                </div>
                <div className={styles.pickupsContainer}>
                    {pickupsVisible && <Pickups pickupAddresses={pickupAddresses} choosePickup={choosePickup} />}
                </div>
            </div>
            <div className={styles.transporterContainer}>
                <input type="radio" id="chronopost" name="transporter" value="Chronopost 24h" onChange={(e) => {
                    setChosenDelivery(e.target.value)
                    setDeliveryPrice(0.80)
                    setPickupsVisible(false)
                    props.getAddress2('')
                }}></input>
                <label htmlFor="chronopost">
                    <div className={styles.imgContainer}>
                        <Image src="/chronopost.png" alt="logo chronopost" layout="fill" objectFit="contain" objectPosition='left' />
                    </div>
                    <div className={styles.deliverySentence}>
                        <h4>Chronopost : Livraison en 24h</h4>
                    </div>
                    <h4>0,80 €</h4>
                </label>
            </div>
            <div className={`${styles.transporterContainer} ${styles.shopContainer}`}>
                <input type="radio" id="shop" name="transporter" value="Retrait en magasin" onChange={(e) => {
                    setChosenDelivery(e.target.value)
                    setDeliveryPrice(0)
                    setPickupsVisible(false)
                    props.getAddress2('')
                }}></input>
                <label htmlFor="shop">
                    <div className={styles.iconContainer}>
                        <FontAwesomeIcon icon={faHome} className={styles.shopIcon} />
                    </div>
                    <div className={styles.deliverySentence}>
                        <h4>Retrait en magasin</h4>
                    </div>
                    <h4>Gratuit</h4>
                </label>
            </div>
            <button type="button" className={styles.selectBtn} onClick={() => selectClick()}>Sélectionner</button>
        </div>
    )
}