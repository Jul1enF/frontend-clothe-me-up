import styles from '../../styles/Address.module.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addAddress, logout } from '../../reducers/user'
import { useRouter } from 'next/router'


export default function Address(props) {
    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS
    const router = useRouter()
    const dispatch = useDispatch()

    // Affichage ou non du formulaire d'adresse à l'arrivée
    const [newAddressVisible, setNewAddressVisible] = useState(false)

    useEffect(() => {
        (!props.addresses || props.addresses.length == 0) ? setNewAddressVisible(true) : setNewAddressVisible(false)
    }, [])

    let newAddressStyle
    newAddressVisible ? newAddressStyle = { display: "flex" } : newAddressStyle = { display: "none" }

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
                    jwtToken: props.token,
                })
            })
            const data = await response.json()

            if (data.error && data.error.name == "TokenExpiredError") {
                setError("Limite de temps de connexion dépassé. Merci de vous reconnecter.")
                setTimeout(() => {
                    dispatch(logout())
                    router.push('/')
                }, "4000")
            }
            else if (data.result) {
                dispatch(addAddress(data.address))
                props.getAddress(data.address)
                props.changeStep("delivery")
            }
        }
    }

    // Affichage des addresses enregistrées

    let addresses
    let addressesComponents

    if (props.addresses) {
        addressesComponents = props.addresses.map((e, i) => {
            return <h4 key={i} onClick={() => {
                props.getAddress(e)
                props.changeStep("delivery")
            }}><span className={styles.addresseName}>{e.title} :  </span>{e.address} {e.post_code} {e.city}</h4>
        })
    }

    newAddressVisible ? addresses = <></> : addresses =
        <div className={styles.addressesContainer}>
            <h3>Sélectionnez une adresse :</h3>
            <div className={styles.line}></div>
            {addressesComponents}
            <h2>Ou</h2>
            <h4 onClick={() => setNewAddressVisible(true)}>Enregistrer une nouvelle adresse ?</h4>
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
                        <button className={styles.registerBtn} onClick={() => registerClick()}>Enregistrer et choisir</button>
                        <h4 className={styles.errorMessage}>{error}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}