import styles from '../../styles/CartItem.module.css'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { deleteCartArticle, deleteArticleNotLinked } from '../../reducers/user'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'


export default function CartItem(props) {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const router = useRouter()
    const dispatch= useDispatch()
    const user = useSelector((state) => state.user.value)

    const price = props.price.toFixed(2) + '€'

    // Fonction appelée au click sur nom ou image pour envoyer vers la page de l'article
    const articleClick = () => {
        props.category == "tops" ? router.push(`/tops_article/${props.name}`) : router.push(`/pants_article/${props.name}`)
    }

    // Fonction appelée au click sur la poubelle pour supprimer du panier un article
    const trashClick = async () => {
        let jwtToken
        user.token ? jwtToken = user.token : jwtToken = "none"

        const response = await fetch(`${url}/cart/deleteArticle/${props._id}/${jwtToken}`, { method: 'DELETE' })
        const data = await response.json()
        console.log(data)
        
        if (data.result && !user.token){
            dispatch(deleteArticleNotLinked(props._id))
        }
        if (data.result){
            dispatch(deleteCartArticle(props._id))
        }
    }

    return (
        <div className={styles.body}>
            <p onClick={() => articleClick()} className={styles.name}>{props.name}</p>
            <p>Taille : {props.size}</p>
            <p>{price}</p>
            <div className={styles.imgContainer}>
                <Image src={props.imgUrl} alt="Image du vêtement" layout='fill' objectFit='contain' />
            </div>
            <div className={styles.trashContainer}>
                <FontAwesomeIcon icon={faTrash} className={styles.trashIcon} onClick={() => trashClick()} />
            </div>
        </div>
    )
}