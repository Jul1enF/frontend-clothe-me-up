import styles from "../../styles/Pickups.module.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { renderToStaticMarkup } from 'react-dom/server';
import React from "react"

export default function Pickups (props) {

    // const isBrowser = typeof window !== 'undefined';
    // let L
    // if (isBrowser) {
    //     L = require('leaflet')
    // }

    const [selectedPickup, setSelectedPickup] = useState('')

    
    // useRef et useEffect pour ouvrir popup à chaque rerender causé par selectedMarker et scroller jusqu'à la fiche du point retrait sélectionné

    const markerRefs = useRef({})
    const pickupsRefs = useRef({})
    const pickupsComponentRef = useRef(null)

    useEffect(() => {
        if (selectedPickup) {

            const markerToOpen = markerRefs.current[selectedPickup];
            markerToOpen.openPopup()

            const pickupToScroll = pickupsRefs.current[selectedPickup]
            const componentToScroll = pickupsComponentRef.current

            const pickupOffsetTop = pickupToScroll.offsetTop
            const componentOffsetTop = componentToScroll.offsetTop
            const distanceToScroll = pickupOffsetTop - componentOffsetTop

            componentToScroll.scroll({
                top: distanceToScroll,
                behavior: "smooth"
              })
        }
    }, [selectedPickup])


    // Lorsque fermé, remplacement des horaires par "Fermé"

    let pickupAddresses = [...props.pickupAddresses]
    pickupAddresses = pickupAddresses.map(e => {
        for (let element in e) {
            if (e[element] == "00:00-00:00 00:00-00:00") {
                e[element] = "Fermé"
            }
        } return e
    })

    // Si un seul horaire par jour, suppression du 00:00 qui le suit

    pickupAddresses = pickupAddresses.map(e => {
        for (let element in e) {
            const regex = /00:00-00:00/
            if(regex.test(e[element])){
            e[element]=e[element].replace(regex, '')
            }
        } return e
    })

    // Fonction appelée en cas de sélection d'un point relais
    const choosePickup=(id)=>{
        pickupAddresses.map(e=>{
            if (e.id === id){
                props.choosePickup({
                    title : e.title,
                    address : e.address,
                    city : e.city,
                    post_code : e.post_code,
                })
            }
        })
    }


    // Création d'une zone sur laquelle centrer la map en fonction des différentes adresses des pickups

    // let allCoords
    // if (isBrowser){
    //     allCoords = pickupAddresses.map(e => {
    //         return L.latLng([e.latitude, e.longitude])
    //     })
    // }

    const allCoords = pickupAddresses.map(e => {
                return L.latLng([e.latitude, e.longitude])
            })

    // let bounds
    // if (isBrowser){
    //     bounds = L.latLngBounds([...allCoords])
    // }

    const bounds = L.latLngBounds([...allCoords])


    // Création des fiches des points de retraits

    const pickups = pickupAddresses.map((e,i)=>{
       return <div className={styles.pickContainer} key={i} ref={(m) => pickupsRefs.current[e.id] = m}>
            <h4>{e.title}</h4>
            <h6>{e.address} {e.post_code} {e.city}</h6>
            <h5>Horaires d'ouverture :</h5>
            <div className={styles.schedulesContainer}>
                <div className={styles.schedules}>
                    <div className={styles.dayContainer}>
                    <p>Lundi :</p><p> {e.openingMonday}</p>
                    </div>
                    <div className={styles.dayContainer}>
                    <p>Mardi :</p><p> {e.openingTuesday}</p>
                    </div>
                    <div className={styles.dayContainer}>
                    <p>Mercredi :</p><p> {e.openingWenesday}</p>
                    </div>
                </div>
                <div className={styles.schedules}>
                    <div className={styles.dayContainer}>
                    <p>Jeudi :</p><p> {e.openingThursday}</p>
                    </div>
                    <div className={styles.dayContainer}>
                    <p>Vendredi :</p><p> {e.openingFriday}</p>
                    </div>
                    <div className={styles.dayContainer}>
                    <p>Samedi :</p><p> {e.openingSaturday}</p>
                    </div>
                </div>
            </div>
            <div className={e.openingSunday.length<13 ? styles.sundayShortContainer : styles.sundayContainer}>
            <p>Dimanche :</p><p> {e.openingSunday}</p>
            </div>
            <button type="button" className={styles.pickupBtn} onClick={() => choosePickup(e.id)}>Choisir</button>
        </div>
    })


    return (
        <div className={styles.body}>
            <MapContainer zoom={12} className={styles.map} bounds={bounds}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {pickupAddresses.map((e, i) =>
                    <Marker
                        ref={(m) => markerRefs.current[e.id] = m}
                        key={e.id}
                        position={[e.latitude, e.longitude]}
                        icon={L.divIcon({
                            html: renderToStaticMarkup(
                                <div className={styles.markerContainer}>
                                    <img src='/colissimo-logo.png' alt="logo colissimo" className={styles.colissimoLogo} />
                                    <FontAwesomeIcon icon={faLocationPin} className={selectedPickup !== e.id ? styles.markerIcon : styles.selectedMarkerIcon}></FontAwesomeIcon>
                                </div>
                            ),
                            className: "markerIcon",
                        })}
                        eventHandlers={{
                            click: () => {
                                setSelectedPickup(e.id)
                            },
                        }}
                    >
                        <Popup
                            position={[e.latitude, e.longitude]}
                        >
                            <div className={styles.popupContainer}>
                                <p>{e.title}</p>
                                <button type="button" className={styles.popupBtn} onClick={() => choosePickup(e.id)}>Choisir</button>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
            <div className={styles.pickupsContainer} ref={pickupsComponentRef}>
                {pickups}
            </div>
        </div>
    )
}