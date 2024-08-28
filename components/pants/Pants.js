import styles from '../../styles/Pants.module.css'
import Header3 from '../Header3'
import { useSelector } from 'react-redux'
import FirstPantItem from './FirstPantItem'
import PantItem from './PantItem'

export default function Downs() {

    const allPants = useSelector((state) => state.pants.value)

    // Tri de tous les pantalons pour ne garder que différents modèles (peu importe taille)
    const pants = allPants.filter((obj1, i, arr) => arr.findIndex(obj2 => (obj2.name === obj1.name)) === i)

    // Tri entre dernier pantalon posté et les autres

    const i = pants.length - 1

    const lastPant = pants[i]
    let lastPants = pants.slice(0, i)
    lastPants.reverse()

    // Affichage conditionnel pour le premier render de la page où allPants est []

    let lastP
    let lastPs

    if (allPants.length > 0) {
        lastP = <FirstPantItem {...lastPant} />
        lastPs= lastPants.map((e,i)=><PantItem key={i} {...e}/>)
    }

    return (
        <div className={styles.body}>
            <Header3 />
            <div className={styles.leftContainer}>
                <h2 className={styles.title}>Articles du moment</h2>
                <div className={styles.line}></div>
            </div>
            <div className={styles.rightContainer}>
                {lastP}
                <div className={styles.lastPsContainer}>
                {lastPs}
                </div>
            </div>
        </div>
    )
}