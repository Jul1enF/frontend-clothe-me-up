import styles from "../../styles/Pickups.module.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Icon } from "leaflet";
import {useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationPin } from "@fortawesome/free-solid-svg-icons";

export default function Pickups(props) {


    // Création d'une zone sur laquelle centrer la map en fonction des différentes adresses des pickups

    const allCoords = props.pickupAddresses.map(e=>{
        return L.latLng([e.latitude, e.longitude])
    })

    const bounds = L.latLngBounds([...allCoords])

    // Changement des icones
    const markerIcon = new Icon({
  iconUrl: "/googleIcon.svg.png",
  iconSize: [25, 25]
})

    return (
        <div className={styles.body}>
            <MapContainer  zoom={12}  className={styles.map} bounds={bounds}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {props.pickupAddresses.map(e=>
                    <Marker
                    key={e.title}
                    position={[e.latitude, e.longitude]}
                    icon={markerIcon}
                    />
                )}
            </MapContainer>
        </div>
    )
}