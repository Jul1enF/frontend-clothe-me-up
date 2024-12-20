import styles from "../../styles/Addresses.module.css"

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addAddress, deleteAddress, logout } from '../../reducers/user'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from "next/router"


export default function Addresses(props) {
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const user = useSelector((state)=>state.user.value)
    const router = useRouter()
    const dispatch = useDispatch()

    // Affichage ou non du formulaire d'adresse à l'arrivée

    useEffect(() => {
        (user.addresses.length == 0) ? props.changeNewAddressVisible(true) : props.changeNewAddressVisible(false)
    }, [])

    let newAddressStyle
    props.newAddressVisible ? newAddressStyle = { display: "flex" } : newAddressStyle = { display: "none" }

    // États pour enregistrement adresse
    const [title, setTitle] = useState('')
    const [firstname, setFirstname] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [additionals_intels, setAdditionals_intels] = useState('')
    const [city, setCity] = useState('')
    const [post_code, setPost_code] = useState('')
    const [phone, setPhone] = useState('')


    // Variables pour les erreurs

    const mobileRegex = /^(06|07)[0-9]{8}$/
    const validMobile = mobileRegex.test(phone)

    const postCodeRegex = /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/
    const validPostCode = postCodeRegex.test(post_code)

    const [error, setError] = useState("")

    // Fonction appelée au click sur enregistrer adresse

    const registerClick = async () => {
        if (!title || !firstname || !name || !address || !city || !post_code || !phone) {
            setError("Merci de remplir tous les champs obligatoires !")
        }
        else if (!validMobile) {
            setError("Numéro de téléphone incorrect !")
        }
        else if (!validPostCode) {
            setError("Code postal incorrect !")
        }
        else {
            const response = await fetch(`${url}/modification/addAddress`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    name,
                    firstname,
                    address,
                    additionals_intels,
                    city,
                    post_code,
                    phone,
                    jwtToken: user.token,
                })
            })
            const data = await response.json()

            if (data.error && data.error.name == "TokenExpiredError") {
                setError("Limite de temps de connexion dépassé. Merci de vous reconnecter.")
                setTimeout(() => {
                    dispatch(logout())
                    router.push('/')
                }, 4000)
            }
            else if (data.result) {
                dispatch(addAddress(data.address))
                props.changeNewAddressVisible(false)
            }
        }
    }

    // Fonction appelée au click sur la poubelle pour supprimer une adresse

    const deleteClick= async(_id)=>{

        const jwtToken = user.token

        const response = await fetch(`${url}/modification/deleteAddress/${_id}/${jwtToken}`, { method: 'DELETE' })
        const data = await response.json()

        if (data.result){
            dispatch(deleteAddress(_id))
        }
    }

    // Affichage des addresses enregistrées

    let addresses
    let addressesComponents

    if (user.addresses.length>0) {
        addressesComponents = user.addresses.map((e, i) => {
            return <div className={styles.singleAddressContainer} key={i}>
                 <h5 className={styles.addresseName}>{e.title} :</h5>
                 <h5 className={styles.addressInfos}>{e.address} {e.post_code} {e.city}</h5>
                 <FontAwesomeIcon className={styles.trash} icon={faTrash} onClick={()=>deleteClick(e._id)}/>
            </div>
        })
    }

    props.newAddressVisible ? addresses = <></> : addresses =
        <div className={styles.addressesContainer}>
            {addressesComponents}
            <div className={styles.getNewAddressContainer}>
            <h4 onClick={() => props.changeNewAddressVisible(true)}>Enregistrer une nouvelle adresse ?</h4>
            </div>
        </div>

    return (
        <div className={styles.body}>
            {addresses}
            <div className={styles.newAddress} style={newAddressStyle}>
                <div className={styles.registerSentenceContainer}>
                    <h3>Enregistrer une nouvelle adresse</h3>
                    <div className={styles.line2}></div>
                </div>
                <div className={styles.inputsContainer}>
                    <input type="text" placeholder="Titre de l'adresse* (maison, travail...)" onChange={(e) => {
                        setTitle(e.target.value)
                        setError("")
                    }
                    } value={title} className={styles.input}></input>
                    <input type="text" placeholder='Prénom*' onChange={(e) => setFirstname(e.target.value)} value={firstname} className={styles.input}></input>
                    <input type="text" placeholder='Nom*' onChange={(e) => {
                        setName(e.target.value)
                        setError("")
                    }} value={name} className={styles.input}></input>
                    <input type="text" placeholder='Adresse*' onChange={(e) => {
                        setAddress(e.target.value)
                        setError("")
                    }} value={address} className={styles.input}></input>
                    <input type="text" placeholder="Complément d'adresse" onChange={(e) => {
                        setAdditionals_intels(e.target.value)
                        setError("")
                    }} value={additionals_intels} className={styles.input}></input>
                    <input type="text" placeholder='Code postal*' onChange={(e) => {
                        setPost_code(e.target.value)
                        setError("")
                    }} value={post_code} className={styles.input}></input>
                     <input type="text" placeholder='Ville*' onChange={(e) => {
                        setCity(e.target.value)
                        setError("")
                    }} value={city} className={styles.input}></input>
                    <input type="text" placeholder='Téléphone mobile*' onChange={(e) => {
                        setPhone(e.target.value)
                        setError("")
                    }} value={phone} className={styles.mobileInput}></input>
                    <div className={styles.btnContainer}>
                        <button className={styles.registerBtn} onClick={() => registerClick()}>Enregistrer</button>
                        <h4 className={styles.errorMessage}>{error}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}