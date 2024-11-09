import styles from '../../styles/Signup.module.css'
import Header2 from '../Header2'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { CloseOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import Image from 'next/image'


export default function Signup() {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    const user = useSelector((state) => state.user.value)

    // États pour affichage ou non passwords et modal

    const [eye1Visible, setEye1Visible] = useState(false)
    const [eye2Visible, setEye2Visible] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)


    // États pour les inputs et modal

    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [mobile, setMobile] = useState('')

    const [modalSentence1, setModalSentence1] = useState("Merci de confirmer votre adresse email.")
    const [modalSentence2, setModalSentence2] = useState("Un courrier vient de vous être envoyé. (Pensez à vérifier vos spams.)")

    // Variables pour les erreurs

    const mobileRegex = /^(06|07)[0-9]{8}$/
    const validMobile = mobileRegex.test(mobile)
    const [error, setError] = useState('')


    // Fonction pour au click sur "Enregistrer" pour checker les inputs, gérer les erreurs ou appeler la route Signup

    const registerClick = async () => {
        if (!firstname || !name || !email || !password || !password2 || !mobile) {
            setError("Merci de remplir tous les champs ci dessus !")
        }
        else if (password !== password2) {
            setError("Erreur de confirmation du mot de passe !")
        }
        else if (!validMobile) {
            setError("Numéro de téléphone incorrect !")
        }
        else {
            setModalVisible(true)
            const response = await fetch(`${url}/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    firstname,
                    email,
                    password,
                    mobile_phone: mobile,
                })
            })
            const data = await response.json()

            if (!data.result) {
                setModalSentence1(data.error)
                setModalSentence2('')
            }
            else {
                setModalSentence1("Merci de confirmer votre adresse email.")
                setModalSentence2("Un courrier vient de vous être envoyé. (Pensez à vérifier vos spams.)")
            }
        }
    }

    const googleClick = async () => {
        if (user.cart_articles.length > 0) {
            const response = await fetch(`${url}/cart/google`, { method: 'POST' })
            const data = await response.json()
            location.assign(data.url)
        }
        else {
            const response = await fetch(`${url}/users/google`, { method: 'POST' })
            const data = await response.json()
            location.assign(data.url)
        }
    }

    return (
        <div className={styles.body}>
            <Header2 />
            <Modal
                onCancel={() => setModalVisible(false)}
                open={modalVisible}
                footer={null}
                closeIcon={<CloseOutlined className={styles.closeIcon} />}
                classNames={{ content: styles.modalContent }} >
                <div className={styles.modalContainer}>
                    <h3 className={styles.modalSentence}>{modalSentence1}</h3>
                    <h3 className={styles.modalSentence} style={modalSentence2 ? { display: "flex" } : { display: "none" }}>{modalSentence2}</h3>
                </div>
            </Modal>
            <div className={styles.topContainer}>
                <h2 className={styles.phoneTitle}>Inscription</h2>
                <div className={styles.phoneLine}></div>
            </div>
            <div className={styles.downContainer}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>Inscription</h2>
                </div>
                <div className={styles.lineContainer}>
                    <div className={styles.line}></div>
                </div>
                <div className={styles.inputsContainer}>
                    <div className={styles.inputColumn}>

                        <div className={styles.phoneBtnContainer}>
                            <button onClick={() => googleClick()} className={styles.googleBtn}><div className={styles.imgContainer}><Image src="/googleIcon.svg.png" layout='fill' alt="google logo" /></div>S'inscrire avec Google </button>
                            <h2 className={styles.or}>Ou</h2>

                        </div>


                        <input className={styles.input} type="text" placeholder='Prénom*' onChange={(e) => {
                            setFirstname(e.target.value)
                            setError('')
                        }} value={firstname}></input>
                        <input className={styles.input} type="text" placeholder='Nom*' onChange={(e) => {
                            setName(e.target.value)
                            setError('')
                        }} value={name}></input>
                        <input className={styles.input} type="text" placeholder='Email*' onChange={(e) => {
                            setEmail(e.target.value)
                            setError('')
                        }} value={email}></input>
                    </div>
                    <div className={styles.inputColumn}>
                        <div className={styles.passwordContainer}>
                            <input type={eye1Visible ? "text" : "password"} placeholder='Mot de passe*' className={styles.password} onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }} value={password}></input>
                            <FontAwesomeIcon icon={eye1Visible ? faEyeSlash : faEye} className={styles.eyeIcon} onClick={() => setEye1Visible(!eye1Visible)} />
                        </div>
                        <div className={styles.passwordContainer}>
                            <input type={eye2Visible ? "text" : "password"} placeholder='Confirmation du mot de passe*' className={styles.password} onChange={(e) => {
                                setPassword2(e.target.value)
                                setError('')
                            }} value={password2}></input>
                            <FontAwesomeIcon icon={eye2Visible ? faEyeSlash : faEye} className={styles.eyeIcon} onClick={() => setEye2Visible(!eye2Visible)} />
                        </div>
                        <input className={styles.input} type="text" placeholder='Téléphone mobile*' onChange={(e) => {
                            setMobile(e.target.value)
                            setError('')
                        }} value={mobile}></input>
                        <h4 className={styles.errorMessage}>{error}</h4>
                        <button className={styles.registerBtn} onClick={() => registerClick()}>Enregistrer</button>
                    </div>
                    <div className={styles.btnContainer}>
                        <h2 className={styles.or}>Ou</h2>
                        <button onClick={() => googleClick()} className={styles.googleBtn}><div className={styles.imgContainer}><Image src="/googleIcon.svg.png" layout='fill' alt="google logo" /></div>S'inscrire avec Google </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

// <a href={`${url}/users/auth/google`} target='_blank'>