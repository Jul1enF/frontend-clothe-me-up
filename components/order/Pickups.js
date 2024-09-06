import styles from "../../styles/Pickups.module.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";
import { renderToStaticMarkup } from 'react-dom/server';
import React from "react"

export default function Pickups(props) {

    const [selectedMarker, setSelectedMarker] = useState('')

    
    // useRef et useEffect pour ouvrir popup à chaque rerender causé par selectedMarker

    const markerRefs = useRef({})

    useEffect(() => {
        if (selectedMarker) {
            const markerToOpen = markerRefs.current[selectedMarker];
            markerToOpen.openPopup()
        }
    }, [selectedMarker])


    // Lorsque fermé, remplacement des horaires par "Fermé"

    let pickupAddresses = [...props.pickupAddresses]
    pickupAddresses = pickupAddresses.map(e => {
        for (let element in e) {
            if (e[element] == "00:00-00:00 00:00-00:00") {
                e[element] = "Fermé"
            }
        } return e
    })


    // Création d'une zone sur laquelle centrer la map en fonction des différentes adresses des pickups

    const allCoords = pickupAddresses.map(e => {
        return L.latLng([e.latitude, e.longitude])
    })

    const bounds = L.latLngBounds([...allCoords])


    return (
        <div className={styles.body}>
            <MapContainer zoom={12} className={styles.map} bounds={bounds}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {pickupAddresses.map((e, i) =>
                    <Marker
                        ref={(m) => markerRefs.current[e.title] = m}
                        key={e.title}
                        position={[e.latitude, e.longitude]}
                        icon={L.divIcon({
                            html: renderToStaticMarkup(
                                <div className={styles.markerContainer}>
                                    <img src='/colissimo-logo.png' alt="logo colissimo" className={styles.colissimoLogo} />
                                    <FontAwesomeIcon icon={faLocationPin} className={selectedMarker !== e.title ? styles.markerIcon : styles.selectedMarkerIcon}></FontAwesomeIcon>
                                </div>
                            ),
                            className: "markerIcon",
                        })}
                        eventHandlers={{
                            click: () => {
                                setSelectedMarker(e.title)
                            },
                        }}
                    >
                        <Popup
                            key={i}
                            position={[e.latitude, e.longitude]}
                        >
                            <div className={styles.popupContainer}>
                                <p>{e.title}</p>
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    )
}