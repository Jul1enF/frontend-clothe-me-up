import styles from '../../styles/Post.module.css'
import { useState } from 'react'

export default function Post() {

    const url = process.env.NEXT_PUBLIC_BACK_ADDRESS

    const [error, setError] = useState('')

    // États inputs

    const [name, setName] = useState('')
    const [imgUrl, setImgUrl] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')

    const [size1, setSize1] = useState('')
    const [stock1, setStock1] = useState('')
    const [size2, setSize2] = useState('')
    const [stock2, setStock2] = useState('')
    const [size3, setSize3] = useState('')
    const [stock3, setStock3] = useState('')
    const [size4, setSize4] = useState('')
    const [stock4, setStock4] = useState('')
    const [size5, setSize5] = useState('')
    const [stock5, setStock5] = useState('')
    const [size6, setSize6] = useState('')
    const [stock6, setStock6] = useState('')
    const [size7, setSize7] = useState('')
    const [stock7, setStock7] = useState('')
    const [size8, setSize8] = useState('')
    const [stock8, setStock8] = useState('')

    let errorStyle

    if (error == "Article(s) enregistré(s) avec succès !") {
        errorStyle = { color: "green" }
    }

    // Fonction appelée au click sur enregistrer

    const registerClick = () => {
        if (!name || !imgUrl || !price || !description || !category || !size1 || !stock1) {
            setError('Tous les champs ne sont pas renseignés !')
            return
        }
        if ((size1 && !stock1) || (size2 && !stock2) || (size3 && !stock3) || (size4 && !stock4) || (size5 && !stock5) || (size6 && !stock6) || (size7 && !stock7) || (size8 && !stock8)) {
            setError('Stocks non renseignés !')
            return
        }

        fetch(`${url}/bo/addArticles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                imgUrl,
                price,
                description,
                category,
                size1,
                stock1,
                size2,
                stock2, size3, stock3, size4, stock4, size5, stock5, size6, stock6, size7, stock7, size8, stock8,
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    setError("Article(s) enregistré(s) avec succès !")
                }
                else { setError(data.error) }
            });
    }

    return (
        <div className={styles.body}>
            <div className={styles.inputColumn}>
                <div className={styles.inputContainer}>
                    <h5>Nom</h5>
                    <input className={styles.input} onChange={(e) => {
                        setName(e.target.value)
                        setError('')
                    }} value={name}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Lien image</h5>
                    <input className={styles.input} onChange={(e) => {
                        setImgUrl(e.target.value)
                        setError('')
                    }} value={imgUrl}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Prix</h5>
                    <input type="number" className={styles.input} onChange={(e) => {
                        setPrice(e.target.value)
                        setError('')
                    }} value={price} ></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Description</h5>
                    <textarea className={styles.descriptionInput} onChange={(e) => {
                        setDescription(e.target.value)
                        setError('')
                    }} value={description}></textarea>
                </div>
            </div>
            <div className={styles.inputColumn}>
                <div className={styles.inputContainer}>
                    <h5>Catégorie</h5>
                    <label htmlFor="category">Pantalon</label>
                    <input type='checkbox' id="category" checked={category == "pants"} value="pants" onChange={(e) => {
                        setCategory(e.target.value)
                        setError('')
                    }}></input>
                    <label htmlFor="category">Hauts</label>
                    <input type='checkbox' id="category" checked={category == "tops"} value="tops" onChange={(e) => {
                        setCategory(e.target.value)
                        setError('')
                    }}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 1</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize1(e.target.value)
                        setError('')
                    }} value={size1} placeholder='Nom*'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock1(e.target.value)
                        setError('')
                    }} value={stock1}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 2</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize2(e.target.value)
                        setError('')
                    }} value={size2} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock2(e.target.value)
                        setError('')
                    }} value={stock2}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 3</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize3(e.target.value)
                        setError('')
                    }} value={size3} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock3(e.target.value)
                        setError('')
                    }} value={stock3}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 4</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize4(e.target.value)
                        setError('')
                    }} value={size4} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock4(e.target.value)
                        setError('')
                    }} value={stock4}></input>
                </div>
                <h4 className={styles.errorMessage} style={errorStyle}>{error}</h4>
            </div>
            <div className={styles.inputColumn}>
                <div className={styles.inputContainer}>
                    <h5>Taille 5</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize5(e.target.value)
                        setError('')
                    }} value={size5} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock5(e.target.value)
                        setError('')
                    }} value={stock5}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 6</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize6(e.target.value)
                        setError('')
                    }} value={size6} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock6(e.target.value)
                        setError('')
                    }} value={stock6}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 7</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize7(e.target.value)
                        setError('')
                    }} value={size7} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock7(e.target.value)
                        setError('')
                    }} value={stock7}></input>
                </div>
                <div className={styles.inputContainer}>
                    <h5>Taille 8</h5>
                    <input className={styles.sizeInput} onChange={(e) => {
                        setSize8(e.target.value)
                        setError('')
                    }} value={size8} placeholder='Nom'></input>
                    <h5>Stock</h5>
                    <input type="number" className={styles.stockInput} onChange={(e) => {
                        setStock8(e.target.value)
                        setError('')
                    }} value={stock8}></input>
                </div>
                <button className={styles.registerBtn} onClick={() => registerClick()}>Enregistrer</button>
            </div>
        </div>
    )
}