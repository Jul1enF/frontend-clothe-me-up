import styles from '../../styles/Signin.module.css'
import Header2 from '../Header2'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../reducers/user'
import { useRouter } from 'next/router'
import Image from 'next/image'

export default function Signin() {

    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector((state)=>state.user.value)

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    // États pour affichage ou non passwords et erreur

    const [eye1Visible, setEye1Visible] = useState(false)
    const [error, setError] = useState('')

    // États pour les inputs et modal

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginClick=async ()=>{
        if (!email){
            setError('Merci de renseigner votre email.')
        }
        else if (!password){
            setError("Merci de renseigner votre mot de passe")
        }
        else{
            const response = await fetch(`${url}/users/signin`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    pantsNotLinked : user.pantsNotLinked,
                    topsNotLinked : user.topsNotLinked,
                })
                })
            const data = await response.json()

            if (!data.result){
                setError(data.error)
            }
            else{
                dispatch(login({firstname : data.firstname, token:data.token, connectionDate: new Date(), is_admin : data.is_admin, cart_pants: data.cart_pants,  cart_tops : data.cart_tops, addresses : data.addresses}))

                if(data.cart_pants.length>0 || data.cart_pants.length>0){router.push('/cart/c')}
                
                else {router.push('/')}
            }
        }
    }

    const googleClick=async()=>{
        if(user.cart_pants.length>0 || user.cart_tops.length>0){
            const response = await fetch(`${url}/cart/google`, {method:'POST'})
            const data = await response.json()
            window.location.href = data.url
        }
        else{
            const response = await fetch(`${url}/users/google`, {method:'POST'})
            const data = await response.json()
            window.location.href = data.url
        }
     }

    return (
        <div className={styles.body}>
            <Header2 />
            <div className={styles.topContainer}></div>
            <div className={styles.downContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Connexion</h2>
                </div>
                <div className={styles.lineContainer}>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.inputsContainer}>
                    <div className={styles.inputColumn}>
                        <input className={styles.input} type="text" placeholder='Email' onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }} value={email}></input>
                        <div className={styles.passwordContainer}>
                            <input type={eye1Visible ? "text" : "password"} placeholder='Mot de passe' className={styles.password} onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }} value={password} onKeyDown={(event)=>{
                                if (event.code === 'Enter')
                                {loginClick()}
                              }}></input>
                            <FontAwesomeIcon icon={eye1Visible ? faEyeSlash : faEye} className={styles.eyeIcon} onClick={() => setEye1Visible(!eye1Visible)} />
                        </div>
                        <button className={styles.registerBtn} onClick={() => loginClick()}>Se connecter</button>
                    </div>
                    <div className={styles.btnContainer}>
                        <h2 className={styles.or}>Ou</h2>
                        <button onClick={()=>googleClick()} className={styles.googleBtn}><div className={styles.imgContainer}><Image src="/googleIcon.svg.png" layout='fill' alt="google logo" /></div>Se connecter avec Google </button>
                        <h4 className={styles.errorMessage}>{error}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}