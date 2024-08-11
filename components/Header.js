import styles from '../styles/Header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCartShopping, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'


export default function Header(){

    return(
        <div className={styles.headerBody}>
            <div className={styles.searchContainer}>
                <div className={styles.inputContainer}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.glassIcon} />
                    <input className={styles.search} type="text" placeholder='Rechercher...'></input>
                </div>
            </div>
            <div className={styles.titleContainer}>
                <h1 className={styles.nameSite}>CLOTHE ME UP !</h1>
            </div>
            <div className={styles.iconsContainer}>
                <FontAwesomeIcon className={styles.userIcon} icon={faUser}/>
                <FontAwesomeIcon className={styles.cartIcon} icon={faCartShopping}/>
            </div>
        </div>
    )
}