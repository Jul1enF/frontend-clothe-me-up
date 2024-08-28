import styles from '../../styles/Tops.module.css'
import Header3 from '../Header3'
import { useSelector } from 'react-redux'
import FirstTopItem from './FirstTopItem'
import TopItem from './TopItem'

export default function Downs() {

    const allTops = useSelector((state) => state.tops.value)

    // Tri de tous les hauts pour ne garder que différents modèles (peu importe taille)
    const tops = allTops.filter((obj1, i, arr) => arr.findIndex(obj2 => (obj2.name === obj1.name)) === i)

    // Tri entre dernier haut posté et les autres

    const i = tops.length - 1

    const lastTop = tops[i]
    let lastTops = tops.slice(0, i)
    lastTops.reverse()

    // Affichage conditionnel pour le premier render de la page où allTops est []

    let lastT
    let lastTs

    if (allTops.length > 0) {
        lastT = <FirstTopItem {...lastTop} />
        lastTs= lastTops.map((e,i)=><TopItem key={i} {...e}/>)
    }

    return (
        <div className={styles.body}>
            <Header3 />
            <div className={styles.leftContainer}>
                <h2 className={styles.title}>Articles du moment</h2>
                <div className={styles.line}></div>
            </div>
            <div className={styles.rightContainer}>
                {lastT}
                <div className={styles.lastTsContainer}>
                {lastTs}
                </div>
            </div>
        </div>
    )
}