import styles from "../../styles/MyOrders.module.css"
import { useSelector } from "react-redux"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons"
import Image from 'next/image'
import Link from 'next/link'

const moment = require('moment')


export default function MyOrders() {

    const user = useSelector((state) => state.user.value)

    const [orderSelected, setOrderSelected] = useState('')


    const orders = user.orders.map((e, i) => {


        // Map des articles de la commande
        const articles = e.articles.map((f, j) => {

            return <div className={styles.articleContainer} key={j}>
                <h6 className={styles.articleName}>- {f.name}</h6>
                <p>Taille : {f.size}</p>
                <p>{f.price.toFixed(2)}€</p>
                <div className={styles.imgContainer}>
                    <Image src={f.imgUrl} alt="Image du vêtement" layout='fill' objectFit='contain' />
                </div>
            </div>
        })

        // Infos à afficher en conditionnel

        let status
        e.sent ? status = "Expédiée" : status = "En cours de préparation"

        let title
        let address
        let postCode
        let city

        if (e.delivery_mode == "Colissimo : Point de retrait") {
            title = e.chosen_address2.title
            address = e.chosen_address2.address
            postCode = e.chosen_address2.post_code
            city = e.chosen_address2.city
        } else if (e.delivery_mode !== "Retrait en magasin") {
            title = e.chosen_address.title
            address = e.chosen_address.address
            postCode = e.chosen_address.post_code
            city = e.chosen_address.city
        }

        // Map des infos principales des commandes

        const date = moment(new Date(e.createdAt)).format("DD/MM/YYYY HH:mm")

        return <div key={i} className={styles.orderContainer}>
            <div className={styles.orderInfosContainer}>
                <h2 className={styles.orderNumber}>- Commande {e.order_number} :</h2>
                <h3 className={styles.articlesNumber}>Articles : {e.articles.length}</h3>
                <h3 className={styles.orderDate}>Date : {date}</h3>
                <FontAwesomeIcon className={styles.chevron} icon={orderSelected == e._id ? faChevronUp : faChevronDown} onClick={() => { orderSelected !== e._id ? setOrderSelected(e._id) : setOrderSelected('') }} />
            </div>
            <div className={styles.line3}  style={orderSelected == e._id ? { display: "flex" } : { display: "none" }}></div>
            <div className={styles.orderDetailsContainer} style={orderSelected == e._id ? { display: "flex" } : { display: "none" }}>
                <h4 className={styles.details}>Détails :</h4>
                <div className={styles.line}></div>
                <div className={styles.articlesContainer}>
                    {articles}
                </div>
                <div className={styles.detailLinesContainer}>
                    <div className={styles.detailLine}>
                        <div className={styles.startPartDetailLine}>
                            <h6>Prix total : </h6>
                            <p>{e.total_price.toFixed(2)}€</p>
                        </div>
                        <div className={styles.endPartDetailLine}>
                            <h6>Frais de port : </h6>
                            <p>{e.delivery_price.toFixed(2)}€</p>
                        </div>
                    </div>
                    <div className={e.delivery_mode == "Retrait en magasin" ? styles.lastDetailLine : styles.detailLine}>
                        <div className={styles.startPartDetailLine}>
                            <h6>Statut : </h6>
                            <p>{status}</p>
                        </div>
                        <div className={styles.endPartDetailLine}>
                            <h6>Mode de livraison : </h6>
                            <p>{e.delivery_mode}</p>
                        </div>
                    </div>
                    <div className={styles.lastDetailLine} style={e.delivery_mode == "Retrait en magasin" ? { display: "none" } : { display: "flex" }}>
                        <div className={styles.partDetailLine}>
                            <div className={styles.addressTitle}>
                                <h6>Adresse de livraison : </h6>
                            </div>
                            <p>{title}, {address} {postCode} {city}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    })

    return (
        <div className={styles.body}>
            <div className={styles.noCommandContainer} style={user.orders.length == 0 ? {display :"flex"} : {display : "none"}}>
                <h2>Vous n'avez pas encore passé de commande !</h2>
                <div className={styles.line2}></div>
                <h2>Découvrez dès maintenant nos articles :</h2>
                <div className={styles.linksContainer}>
                    <Link href='/tops'><h3>Hauts</h3></Link>
                    <Link href='/pants'><h3>Bas</h3></Link>
                </div>
            </div>
            {orders}
        </div>
    )
}