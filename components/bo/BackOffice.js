import styles from '../../styles/BackOffice.module.css'
import Header2 from '../Header2'
import Post from './Post'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'


export default function BackOffice() {

const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
const user = useSelector((state)=>state.user.value)
const router = useRouter()

// UseEffect pour vérifier que le user est bien admin et sinon le push sur la page d'accueil

const useEffectFunction=async()=>{
const response = await fetch(`${url}/bo/checkUser/${user.token}`)
const data = await response.json()
if (!data.result){
router.push('/')
}
}

useEffect(()=>{
    useEffectFunction()
},[])


// Affichage conditionel en fonction de l'utilisation de la page souhaitée
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
