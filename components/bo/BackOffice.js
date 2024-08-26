import styles from '../../styles/BackOffice.module.css'
import Header2 from '../Header2'
import Post from './Post'
import { useState } from 'react'


export default function BackOffice() {

const [methodSelected, setMethodSelected]=useState('POST')

let boContent

if (methodSelected == "POST"){boContent=<Post/>}

    return (
        <div className={styles.body}>
            <Header2 />
            <div className={styles.topContainer}></div>
            <div className={styles.downContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title} onClick={()=>setMethodSelected('POST')}>Ajouter des articles</h2>
                    <h2 className={styles.title} onClick={()=>setMethodSelected('GET')}>Consulter les stocks</h2>
                </div>
                <div className={styles.lineContainer}>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.inputsContainer}>
                    {boContent}
                </div>
            </div>
        </div>
    )
}
