import React from "react";
import taxi from '../img/taxi.webp'
import '../styles.css';

export default function Dashboard() {

    return (<div className="dashboard">
        <img src={taxi} />
        <p >
            Get taxi apps, products, and other offerings<br />
            Get taxi is a technology company whose mission is to reimagine the way the world moves for the better.<br />
            Our technology helps us develop and maintain multisided platforms that match consumers looking for
            rides and independent providers of ride services, as well as with other forms of transportation,<br />
            including public transit, bikes, and scooters.<br />
            We also connect consumers and restaurants, grocers, and other merchants so they can buy and sell meals,<br />
            groceries, and other items, then we match them with independent delivery service providers.<br />
            Plus, Get taxi connects shippers and carriers in the freight industry.<br />
            Our technology helps people connect and move in over 70 countries and 10,000 cities around the world.
        </p>
        <footer className="street">
            <div className="taxi"></div>
        </footer>
    </div>)
}