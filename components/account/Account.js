import styles from "../../styles/Account.module.css"
import Header3 from "../Header3"
import Informations from "./Informations"
import Addresses from "./Addresses"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"


export default function Account(){

    const [step, setStep] = useState("informations")
    
    // État et fonction pour arrêt affichage fenêtre enregistrement d'une nouvelle addresse (Addresses) au click sur "Mes adresses"

    

    let content
    if (step == "informations"){
        content=<Informations/>
        informationsStyle={color:"rgb(13, 1, 102)"}
    }
    else if (step == "addresses"){
        content=<Addresses/>
        addressesStyle={color:"rgb(13, 1, 102)"}
    }

    let informationsStyle
    let addressesStyle
    let ordersStyle

    return(
        <div className={styles.body}>
             <Header3 />
            <div className={styles.leftContainer}>
                <h2 className={styles.title}>Mon compte</h2>
                <div className={styles.line}></div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.stepsTitleContainer}>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={informationsStyle} className={styles.arrowIcon} />
                        <h2 className={styles.title2} onClick={()=>setStep("informations")}>Mes informations</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={addressesStyle} className={styles.arrowIcon} />
                        <h2 className={styles.title2} onClick={()=>setStep("addresses")}>Mes addresses</h2>
                    </div>
                    <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={ordersStyle} className={styles.arrowIcon} />
                        <h2>Mes commandes</h2>
                    </div>
                    {/* <div className={styles.stepAndIconContainer}>
                        <FontAwesomeIcon icon={faArrowRight} style={validationStyle} className={styles.arrowIcon} />
                        <h2 >Validation</h2>
                    </div> */}
                </div>
                <div className={styles.line2}></div>
                <div className={styles.stepContainer}>
                    {content}
                </div>
            </div>
        </div>
    )
}