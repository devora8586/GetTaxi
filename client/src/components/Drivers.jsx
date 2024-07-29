import React, { useEffect, useState, useContext, useReducer, useRef } from "react";
import { PATCH } from "../fetchFunctions";
import { UserContext } from "../components/Main.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notification from '../audio/notification.mp3'
import useCookie from "./useCookie";
import cookies from "js-cookie";
import LogErrors from "./LogErrors.jsx";
import { Messages } from 'primereact/messages';
import { loadGoogleMapsScript, geocodeAddress } from "../functions.js";
import io from 'socket.io-client'
import '../styles.css';

export default function Drivers() {

    const socket = io('http://localhost:3000');

    const { user } = useContext(UserContext);
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const [available, setAvailable] = useCookie('available', false)
    const toasts = Object.create(null)
    const callMsg = useRef();
    const toastDefinition = {
        position: "bottom-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: 1,
        theme: "light",
        className: "toast-message"
    }
    const availableTitle = <div>
        <h1 className="page-big-title">Now you can get passengers</h1>
        <h3 className="page-title">Do you want to stop working today? click here ↓</h3>
    </div>
    const busyTitle = <div>
        <h1 className="page-big-title">Start your day with<br /> Get Taxi</h1>
        <h3 className="page-title">Click to get passengers</h3>
    </div>
    const [title, setTitle] = useState(busyTitle)


    useEffect(() => {
        setAvailable(JSON.parse(cookies.get('available')))
    }, [])

    useEffect(() => {
        if (available) {
            callMsg.current.clear()
            setTitle(availableTitle)
            socket.emit('join_room', { room: user.id });
            socket.on('call', (order) => {
                showToast(order)
            })
            socket.on('reject_order', (orderId) => {
                if (toasts[orderId] != undefined)
                    toast.dismiss(toasts[orderId])
            })
            return () => socket.off('call');
        }
        else {
            socket.emit('leave_room', { room: user.id });
            toast.dismiss()
            setTitle(busyTitle)
        }
    }, [available])

    function showToast(order) {
        loadGoogleMapsScript().then(() => {
            geocodeAddress(order.location).then(location => {
                geocodeAddress(order.destination).then(destination => {
                    const audio = new Audio(notification)
                    audio.play();
                    toasts[order.id] = toast(
                        <div className="toast-container">
                            <p className="toast-line">New call</p>
                            <p className="toast-line">From: {location}</p>
                            <p className="toast-line">To: {destination}</p>
                            <p className="toast-line">Contact phone number: {order.contactPhone}</p>
                            <div className="toast-button-container">
                                <button className="toast-button" onClick={() => acceptOrder(order, location, destination)}>Accept</button>
                                <button className="toast-button" onClick={() => { toast.dismiss(toasts[order.id]); }}>Reject</button>
                            </div>
                        </div>, toastDefinition);
                });
            })
        })
    }

    function showMessage(location, destination, phone) {
        callMsg.current.show([{
            detail: <div className="msg-container">
                <p className="msg-line">You confirmed the call</p>
                <p className="msg-line">From: {location}</p>
                <p className="msg-line">To: {destination}</p>
                <p className="msg-line">Contact phone number: {phone}</p>
            </div>,
            sticky: true, closable: true, custom: true
        }])
    }

    function acceptOrder(order, location, destination) {
        PATCH(`orders/${order.id}`, { driverId: user.id },
            () => {
                showMessage(location, destination, order.contactPhone)
                setAvailable(!available);
                socket.emit('accept_order', {
                    room: order.id,
                    driver: { name: user.username, contactPhone: user.phoneNumber }
                });
                socket.emit('join_room', { room: order.id });
                socket.on('cancel_order', () => {
                    const audio = new Audio(notification)
                    audio.play();
                    callMsg.current.clear()
                    toast('The call was cancelled', toastDefinition)
                });
            }, (error) => {
                if (error.status == 404)
                    setErrorMsg('Order not found')
                else if (error.status == 500)
                    setErrorMsg('Something went wrong...')
                else
                    setErrorMsg(error.statusText)
                setShowError(true);
            })
    }

    function trackDriverLocation(value) {
        let id;
        if (value == 'available')
            id = navigator.geolocation.watchPosition((position) => {
                PATCH(`drivers/${user.username}`,
                    { location: { latitude: position.coords.latitude, longitude: position.coords.longitude } },
                    () => { },
                    (error) => {
                        if (error.status == 404)
                            setErrorMsg('Driver not found')
                        else if (error.status == 500)
                            setErrorMsg('Something went wrong...')
                        else
                            setErrorMsg(error.statusText)
                        setShowError(true);
                    })
            })
        else navigator.geolocation.clearWatch(id);
    }

    function isDriverAvailable(event) {
        event.preventDefault()
        PATCH(`drivers/${user.username}`, { available: !available },
            () => {
                setAvailable(!available);
                trackDriverLocation(event.target.textContent);
            },
            (error) => {
                if (error.status == 404)
                    setErrorMsg('Driver not found')
                else if (error.status == 500)
                    setErrorMsg('Something went wrong...')
                else
                    setErrorMsg(error.statusText)
                setShowError(true);
            })
    }

    return (<>
        <div className="drivers">
            {title}
            <button className="available" onClick={(e) => isDriverAvailable(e)}>{available ? 'busy' : 'available'}</button>
            <ToastContainer />
            {<Messages className="msg" ref={callMsg} />}
            <LogErrors visible={showError} setVisible={setShowError} errorMsg={errorMsg} />
        </div>
        <footer className="street">
            <div className="taxi"></div>
        </footer>
    </>)
}