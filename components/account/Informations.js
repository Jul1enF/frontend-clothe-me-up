import styles from "../../styles/Informations.module.css"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { logout, changeReducerFirstname, changeReducerName, changeReducerPhone, changeReducerPassword } from "../../reducers/user"
import { useRouter } from "next/router"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons"


export default function () {

    const user = useSelector((state) => state.user.value)
    const dispatch = useDispatch()
    const router = useRouter()
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    // États pour affichage ou non des inputs/boutons pour modifier champs

    const [modifyFirstname, setModifyFirstname] = useState(false)
    const [modifyName, setModifyName] = useState(false)
    const [modifyPhone, setModifyPhone] = useState(false)
    const [modifyEmail, setModifyEmail] = useState(false)
    const [modifyPassword, setModifyPassword] = useState(false)

    const [error, setError] = useState('')
    const [errorIsInformations, setErrorIsInformations] = useState(false)

    // États pour enregistrement valeurs des inputs

    const [newFirstname, setNewFirstname] = useState('')
    const [newName, setNewName] = useState('')
    const [newPhone, setNewPhone] = useState('')
    const [newEmail, setNewEmail] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPassword2, setNewPassword2] = useState('')

    // États pour affichage ou non passwords

    const [eye1Visible, setEye1Visible] = useState(false)
    const [eye2Visible, setEye2Visible] = useState(false)
    const [eye3Visible, setEye3Visible] = useState(false)



    // Affichage conditionnel des inputs/boutons de modifs + Fonctions appelées en sauvegardant

    // PRÉNOM
    // Fonction appelée en sauvegardant modifs prénom

    const changeFirstname = async () => {

        if (!newFirstname) {
            return setError("Merci de saisir le nouveau Prénom !")
        }

        const response = await fetch(`${url}/modification/newFirstname`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newFirstname,
                jwtToken: user.token,
            })
        })
        const data = await response.json()

        if (!data.result) {
            setError("Votre session a expiré, merci de vous reconnecter.")
            setTimeout(() => {
                dispatch(logout())
                router.push('/')
            }, "4000")
        }
        else {
            setErrorIsInformations(true)
            setError("Modification enregistrée !")
            dispatch(changeReducerFirstname(newFirstname))
            setModifyFirstname(false)

            setTimeout(() => {
                setError('')
                setErrorIsInformations(false)
            }, "4000")
        }
    }

    // Inputs/Boutons pour prénom

    let firstnameContent

    if (!modifyFirstname) {
        firstnameContent = <p>{user.firstname}</p>
    }
    else {
        firstnameContent =
            <div className={styles.lineInputContainer}>
                <input className={styles.input} type="text" placeholder={user.firstname} onChange={(e) => {
                    setNewFirstname(e.target.value)
                    setError('')
                }} value={newFirstname}></input>
            </div>
    }

    let firstnameBtns

    if (!modifyFirstname) {
        firstnameBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.changeBtn} onClick={() => setModifyFirstname(true)}>Modifier</button>
            </div>
    }
    else {
        firstnameBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.abortBtn} onClick={() => setModifyFirstname(false)}>Annuler</button>
                <button type="button" className={styles.saveBtn} onClick={() => changeFirstname()}>Sauvegarder</button>
            </div>
    }



    // NOM
    // Fonction appelée en sauvegardant modifs nom

    const changeName = async () => {

        if (!newName) {
            return setError("Merci de saisir le nouveau Nom !")
        }

        const response = await fetch(`${url}/modification/newName`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newName,
                jwtToken: user.token,
            })
        })
        const data = await response.json()

        if (!data.result) {
            setError("Votre session a expiré, merci de vous reconnecter.")
            setTimeout(() => {
                dispatch(logout())
                router.push('/')
            }, "4000")
        }
        else {
            setErrorIsInformations(true)
            setError("Modification enregistrée !")
            dispatch(changeReducerName(newName))
            setModifyName(false)

            setTimeout(() => {
                setError('')
                setErrorIsInformations(false)
            }, "4000")
        }
    }

    // Inputs/Boutons pour nom

    let nameContent

    if (!modifyName && user.name) {
        nameContent = <p>{user.name}</p>
    }
    else if (!modifyName && !user.name) {
        nameContent = <p>Non renseigné</p>
    }
    else {
        nameContent =
            <div className={styles.lineInputContainer}>
                <input className={styles.input} type="text" placeholder={user.name ? user.name : "Non renseigné"} onChange={(e) => {
                    setNewName(e.target.value)
                    setError('')
                }} value={newName}></input>
            </div>
    }

    let nameBtns

    if (!modifyName) {
        nameBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.changeBtn} onClick={() => setModifyName(true)}>Modifier</button>
            </div>
    }
    else {
        nameBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.abortBtn} onClick={() => setModifyName(false)}>Annuler</button>
                <button type="button" className={styles.saveBtn} onClick={() => changeName()}>Sauvegarder</button>
            </div>
    }



    // TÉLÉPHONE
    // Fonction appelée en sauvegardant modifs téléphone

    const changePhone = async () => {

        const mobileRegex = /^(06|07)[0-9]{8}$/
        const validMobile = mobileRegex.test(newPhone)

        if (!validMobile) {
            setError("Numéro de téléphone incorrect !")

            setTimeout(() => {
                setError('')
            }, "4000")
            return
        }

        const response = await fetch(`${url}/modification/newPhone`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newPhone,
                jwtToken: user.token,
            })
        })
        const data = await response.json()

        if (!data.result) {
            setError("Votre session a expiré, merci de vous reconnecter.")
            setTimeout(() => {
                dispatch(logout())
                router.push('/')
            }, "4000")
        }
        else {
            setErrorIsInformations(true)
            setError("Modification enregistrée !")
            dispatch(changeReducerPhone(Number(newPhone)))
            setModifyPhone(false)

            setTimeout(() => {
                setError('')
                setErrorIsInformations(false)
            }, "4000")
        }
    }

    // Inputs/Boutons pour téléphone

    let phoneContent

    if (!modifyPhone && user.mobile_phone) {
        phoneContent = <p>0{user.mobile_phone}</p>
    }
    else if (!modifyPhone && !user.mobile_phone) {
        phoneContent = <p>Non renseigné</p>
    }
    else {
        phoneContent =
            <div className={styles.lineInputContainer}>
                <input className={styles.input} type="text" placeholder={user.mobile_phone ? ("0" + user.mobile_phone) : "Non renseigné"} onChange={(e) => {
                    setNewPhone(e.target.value)
                    setError('')
                }} value={newPhone}></input>
            </div>
    }

    let phoneBtns

    if (!modifyPhone) {
        phoneBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.changeBtn} onClick={() => setModifyPhone(true)}>Modifier</button>
            </div>
    }
    else {
        phoneBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.abortBtn} onClick={() => setModifyPhone(false)}>Annuler</button>
                <button type="button" className={styles.saveBtn} onClick={() => changePhone()}>Sauvegarder</button>
            </div>
    }



    // EMAIL
    // Fonction appelée en sauvegardant modifs email

    const changeEmail = async () => {

        if (!newEmail) {
            return setError("Merci de saisir le nouvel email !")
        }

        const response = await fetch(`${url}/modification/newEmail`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newEmail,
                actualJwtToken: user.token,
            })
        })
        const data = await response.json()
        console.log(data)

        if (!data.result && data.error) {
            setError(data.error)
        }
        else if (!data.result) {
            setError("Votre session a expiré, merci de vous reconnecter.")
            setTimeout(() => {
                dispatch(logout())
                router.push('/')
            }, "4000")
        }
        else {
            setErrorIsInformations(true)
            setError("Modification enregistrée ! Un email vient de vous être envoyé pour confirmer votre adresse (pensez à vérifier vos spams).")
            setModifyFirstname(false)

            setTimeout(() => {
                dispatch(logout())
                router.push('/')
            }, "4000")
        }
    }

    // Inputs/Boutons pour email

    let emailContent

    if (!modifyEmail) {
        emailContent = <p>{user.email}</p>
    }
    else {
        emailContent =
            <div className={styles.lineInputContainer}>
                <input className={styles.input} type="text" placeholder={user.email} onChange={(e) => {
                    setNewEmail(e.target.value)
                    setError('')
                }} value={newEmail}></input>
            </div>
    }

    let emailBtns

    if (!modifyEmail) {
        emailBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.changeBtn} onClick={() => setModifyEmail(true)}>Modifier</button>
            </div>
    }
    else {
        emailBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.abortBtn} onClick={() => setModifyEmail(false)}>Annuler</button>
                <button type="button" className={styles.saveBtn} onClick={() => changeEmail()}>Sauvegarder</button>
            </div>
    }



    // MOT DE PASSE
    // Fonction appelée en sauvegardant modifs mdp

    const changePassword = async () => {

        if (!newPassword || !newPassword2) {
            return setError("Merci de saisir deux fois le nouveau mot de passe !")
        }

        if (user.password && !oldPassword){
            return setError("Merci de saisir l'ancien mot de passe !")
        }

        if (newPassword !== newPassword2) {
            return setError("Confirmation du mot de passe incorrect !")
        }

        const response = await fetch(`${url}/modification/newPassword`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                newPassword,
                oldPassword,
                jwtToken: user.token,
            })
        })
        const data = await response.json()

        if (!data.result && data.error) {
            setError(data.error)
        }
        else if (!data.result) {
            setError("Votre session a expiré, merci de vous reconnecter.")
            setTimeout(() => {
                dispatch(logout())
                router.push('/')
            }, "4000")
        }
        else {
            setErrorIsInformations(true)
            setError("Modification enregistrée !")
            setModifyPassword(false)
            setOldPassword('')
            setNewPassword('')
            setNewPassword2('')
            dispatch(changeReducerPassword(true))

            setTimeout(() => {
                setError('')
                setErrorIsInformations(false)
            }, "4000")
        }
    }

    // Inputs/Boutons pour mdp

    let passwordContent

    if (!modifyPassword) {
        passwordContent = <p>*********</p>
    }
    else {
        passwordContent =
            <div className={styles.linePasswordsContainer}>
                <div className={styles.passwordContainer} style={user.password ? {display : "flex"} : {display : "none"}}>
                    <input type={eye1Visible ? "text" : "password"} placeholder='Ancien mot de passe' className={styles.password} onChange={(e) => {
                        setOldPassword(e.target.value)
                        setError('')
                    }} value={oldPassword}></input>
                    <FontAwesomeIcon icon={eye1Visible ? faEyeSlash : faEye} className={styles.eyeIcon} onClick={() => setEye1Visible(!eye1Visible)} />
                </div>
                <div className={styles.passwordContainer}>
                    <input type={eye2Visible ? "text" : "password"} placeholder='Nouveau mot de passe' className={styles.password} onChange={(e) => {
                        setNewPassword(e.target.value)
                        setError('')
                    }} value={newPassword}></input>
                    <FontAwesomeIcon icon={eye2Visible ? faEyeSlash : faEye} className={styles.eyeIcon} onClick={() => setEye2Visible(!eye2Visible)} />
                </div>
                <div className={styles.passwordContainer}>
                    <input type={eye3Visible ? "text" : "password"} placeholder='Confirmation mot de passe' className={styles.password} onChange={(e) => {
                        setNewPassword2(e.target.value)
                        setError('')
                    }} value={newPassword2}></input>
                    <FontAwesomeIcon icon={eye3Visible ? faEyeSlash : faEye} className={styles.eyeIcon} onClick={() => setEye3Visible(!eye3Visible)} />
                </div>
            </div>
    }

    let passwordBtns

    if (!modifyPassword) {
        passwordBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.changeBtn} onClick={() => setModifyPassword(true)}>Modifier</button>
            </div>
    }
    else {
        passwordBtns =
            <div className={styles.lineBtnsContainer}>
                <button type="button" className={styles.abortBtn} onClick={() => setModifyPassword(false)}>Annuler</button>
                <button type="button" className={styles.saveBtn} onClick={() => changePassword()}>Sauvegarder</button>
            </div>
    }



    return (
        <div className={styles.body}>
            <div className={styles.infosContainer}>
                <h3>Prénom</h3>
                {firstnameContent}
                {firstnameBtns}
            </div>
            <div className={styles.infosContainer}>
                <h3>Nom</h3>
                {nameContent}
                {nameBtns}
            </div>
            <div className={styles.infosContainer}>
                <h3>Téléphone</h3>
                {phoneContent}
                {phoneBtns}
            </div>
            <div className={styles.infosContainer}>
                <h3>Email</h3>
                {emailContent}
                {emailBtns}
            </div>
            <div className={styles.infosContainer}>
                <h3>Mot de passe</h3>
                {passwordContent}
                {passwordBtns}
            </div>
            <h6 className={styles.error} style={!errorIsInformations ? { color: "rgb(230,25,25)" } : { color: "rgb(13,1,102)" }}>{error}</h6>
        </div>
    )
}