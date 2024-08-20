import styles from '../../styles/Article.module.css'
import Header3 from '../Header3'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


export default function Article(){

    const router = useRouter()
    const {infos} = router.query
    const pants = useSelector((state)=>state.pants.value)

    const [article, setArticle]=useState({})
    console.log(article)
    
    const useEffectFunction=()=>{
        if (!infos){ return}
        else if (infos[1]=="pants"){
            pants.map(e=>{
                if (e._id==infos[0]){
                    setArticle(e)
                }
            })
        }
    }

    useEffect(()=>{
        useEffectFunction()
    },[infos])


    let img
    // Enregistrement en conditionnel de l'image pour le premier render sans enregistrement du router.query

    if(article.imgUrl){
        img = <Image src={article.imgUrl} alt="Une image de vêtement" layout="fill" objectFit='contain' />
    }


    return(
        <div className={styles.body}>
            <Header3/>
            <div className={styles.leftContainer}>
                <div className={styles.imgContainer}>
                    {img}
                </div>
            </div>
            <div className={styles.rightContainer}></div>
        </div>
    )
}