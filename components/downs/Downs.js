import styles from '../../styles/Downs.module.css'
import Header3 from '../Header3'
import { useEffect } from 'react'
import { addPants } from '../../reducers/pants'
import { useDispatch, useSelector } from 'react-redux'
import FirstItem from './FirstItem'
import Item from './Item'

export default function Downs() {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const dispatch = useDispatch()

    useEffect(() => {
        fetch(`${url}/pants/allPants`)
            .then(response => response.json())
            .then(data => {
                dispatch(addPants(data.articles))
            })
    }, [])

    const allPants = useSelector((state) => state.pants.value)
    const i = allPants.length - 1

    const lastPant = allPants[i]
    let lastPants = allPants.slice(0, i)
    lastPants.reverse()

    // Affichage conditionnel pour le premier render de la page où allPants est []

    let lastP
    let lastPs

    if (allPants.length > 0) {
        lastP = <FirstItem {...lastPant} />
        lastPs= lastPants.map((e,i)=><Item key={i} {...e}/>)
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