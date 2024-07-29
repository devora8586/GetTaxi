import React, { useState, useContext, useEffect, useRef } from "react";
import { useForm } from 'react-hook-form';
import { DELETE, POST } from "../fetchFunctions";
import { UserContext } from "../components/Main";
import { useParams } from "react-router-dom";
import { signOut } from "../functions";
import LogErrors from "./LogErrors.jsx";
import { Messages } from 'primereact/messages';
import AoutocompleteSelect from "./AoutocompleteSelect.jsx";
import io from 'socket.io-client'
import '../styles.css';


export default function GetTaxi() {

    const { handleSubmit, setValue } = useForm();
    const { user } = useContext(UserContext);
    const [nearestTaxiDrivers, setNearestTaxiDrivers] = useState([]);
    const [orderId, setOrderId] = useState();
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const username = useParams().username;
    const driverMsg = useRef(null)
    const socket = io('http://localhost:3000');

    useEffect(() => {
        if (username != user.username) {
            setErrorMsg('Page not found')
            signOut()
        }
    }, [])

    useEffect(() => {
        if (nearestTaxiDrivers.length > 0) {
            socket.emit('join_room', { room: orderId });
            socket.on('accept_order', (driver) => {
                for (let driver of nearestTaxiDrivers) {
                    socket.emit('reject_order', { room: driver.userId, orderId: orderId });
                }
                driverMsg.current.clear()
                driverMsg.current.show([{
                    detail: <div id="msg-container">
                        <p className="msg-line">{`${driver.name} is on the way to you.`}</p>
                        <button className="msg-button" onClick={cancelOrder}>cancel order</button>
                    </div>, sticky: true, closable: true, custom: true
                }])
            });
            return () => {
                socket.off('accept_order');
                socket.emit('leave_room', { room: orderId });
            };
        }
    }, [nearestTaxiDrivers]);


    function cancelOrder() {
        socket.emit('cancel_order', { room: orderId });
        driverMsg.current.clear()
        DELETE(`orders/${orderId}`, () => { },
            (error) => {
                if (error.status == 404)
                    setErrorMsg('Order not found.')
                else if (error.status == 500)
                    setErrorMsg('Something went wrong...')
                else setErrorMsg(error.statusText)
                setShowError(true);
            });
    }


    function getTaxiHandleSubmit(data) {
        POST('orders', { ...data, userId: user.id },
            (dataFromServer) => {
                for (let driver of dataFromServer.nearestTaxiDrivers) {
                    socket.emit('call', { room: driver.userId, info: dataFromServer.order })
                }
                setNearestTaxiDrivers(dataFromServer.nearestTaxiDrivers);
                setOrderId(dataFromServer.order.id)
                driverMsg.current.show([{
                    detail: <div >
                        <p id="msg-order" className="msg-line">We locate the nearest taxi for you, please wait.</p><br />
                    </div>, sticky: true, closable: true, custom: true
                }])
            },
            (error) => {
                if (error.status == 417 || error.status == 404)
                    setErrorMsg('Sorry, we are currently unable to serve you, please try again later.')
                else if (error.status == 500)
                    setErrorMsg('Something went wrong...')
                else setErrorMsg(error.statusText)
                setShowError(true);
            });
    }

    return (
        <>
            <div className="getTaxi">
                <h1 className="page-big-title">Go anywhere with<br />Get taxi</h1>
                <h3 className="page-title">Request a ride, hop in, and go.</h3>
                <div className="form-container get-taxi-form">
                    <form onSubmit={handleSubmit(getTaxiHandleSubmit)}>
                        <AoutocompleteSelect setValue={setValue} type={'Location'} />
                        <br />
                        <AoutocompleteSelect setValue={setValue} type={'Destination'} />
                        <br />
                        <input type="submit" value="Submit" /><br />
                    </form>
                </div>
                <LogErrors visible={showError} setVisible={setShowError} errorMsg={errorMsg} />
                <Messages className="msg" ref={driverMsg} />
                <footer className="street">
                    <div className="taxi"></div>
                </footer>
            </div>
        </>
    );
}