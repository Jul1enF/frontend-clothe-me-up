import styles from '../../styles/Verification.module.css'
import Header3 from '../Header3'
import {useRouter} from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../reducers/user'

export default function Verification(){

    const router = useRouter()
    const {infos} = router.query
    const dispatch = useDispatch()
    const user=useSelector((state)=>state.user.value)

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    const [sentence1, setSentence1]=useState('')
    const [sentence2, setSentence2]=useState('')
    const [validated, setValidated]=useState(false)

    const useEffectFunction=async()=>{
        if (!infos){return}
        const response = await fetch(`${url}/users/verification`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jwtToken : infos[0],
                email : infos[1],
                articlesNotLinked : user.articlesNotLinked,
            })
            })
        const data = await response.json()

        if(data.result){
            setSentence1("Merci d'avoir confirmé votre email, votre inscription est maintenant terminée !")
            setSentence2("Vous allez être redirigé vers la page d'accueil.")
            dispatch(login({firstname : data.firstname, token:data.token, connectionDate: new Date(), is_admin : data.is_admin, cart_articles: data.cart_articles, addresses : data.addresses}))
            setValidated(true)
        }
        else if (!data.result && data.error =="no data")
        {
            setSentence1("Mauvaise redirection")
        }
        else{
            setSentence1("La validité du lien a expiré.")
            setSentence2("Un nouvel email de confirmation vous a été envoyé.")
        }
    }

    useEffect(()=>{
        useEffectFunction()
    },[infos])

    if (validated){
        setTimeout(()=>router.push('/'), "4000")
    }

    return(
        <div className={styles.body}>
            <Header3/>
            <div className={styles.mainContainer}>
                <div className={styles.leftContainer}></div>
                <div className={styles.rightContainer}>
                    <div className={styles.centralContainer}>
                        <h2 className={styles.sentence}>{sentence1}</h2>
                        <div className={styles.line}></div>
                        <h2 className={styles.sentence}>{sentence2}</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}