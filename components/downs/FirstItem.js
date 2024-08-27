import styles from '../../styles/FirstItem.module.css'
import Image from 'next/image'
import Link from 'next/link'

export default function FirstItem(props){
    const price = props.price.toFixed(2).toString()+"€"
    return(
        <div className={styles.body}>
            <div className={styles.infosContainer}>
                <h4>{props.name}</h4>
                <h5>{price}</h5>
                <Link href={`/pants_article/${props.name}`}>
                 <button>Découvrir</button>
                </Link>
            </div>
            <div className={styles.imgContainer}>
                <Image src={props.imgUrl} alt="Une image du pantalon" layout="fill" objectFit='contain' />
            </div>
        </div>
    )
}