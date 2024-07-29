import React, { useState, useContext, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { UserContext } from "../components/Main.jsx";
import { Sidebar } from 'primereact/sidebar';
import { GET, PUT } from '../fetchFunctions.js';
import { CgProfile } from "react-icons/cg";
import LogErrors from "./LogErrors.jsx";
import { RiEditLine, RiLockPasswordLine } from "react-icons/ri";
import { PiSignOutLight } from "react-icons/pi";

import '../styles.css'


const ProfileMenu = ({ setVisible, visible, signOut }) => {

    const { register, handleSubmit } = useForm();
    const { user, setUser } = useContext(UserContext);
    const [userDetails, setUserDetails] = useState(<></>);
    const [passwordForm, setPasswordForm] = useState();
    const [showError, setShowError] = useState(false)
    const [errorMsg, setErrorMsg] = useState()
    const [companies, setCompanies] = useState([]);


    useEffect(() => {
        GET('companies', setCompanies,
            (error) => {
                if (error.status != 404)
                    setErrorMsg(error.statusText)
                else if (error.status == 500)
                    setErrorMsg('Something went wrong...')
                else setErrorMsg(error.statusText)
                setShowError(true);
            });
    }, [])

    useEffect(() => {
        if (visible) {
            if (user.name == undefined) {
                GET(`drivers/${user.username}`,
                    (dataFromServer) => {
                        setUser({
                            ...user, name: dataFromServer.name,
                            phoneNumber: dataFromServer.phoneNumber, company: dataFromServer.company
                        })
                        updateUserDetails(dataFromServer)
                    }, (error) => {
                        if (error.status == 500)
                            setErrorMsg('Something went wrong...')
                        else setErrorMsg(error.statusText)
                        setShowError(true);
                    });
            } else
                updateUserDetails(user)
        }
    }, [visible])

    function updateUserDetails(details) {
        setUserDetails(<>
            <CgProfile className="big-profile-picture" />
            <h2>{details.username}</h2>
            <p>Name: {details.name}</p>
            <p>Phone Number: {details.phoneNumber}</p>
            <p>Company: {details.company.name}</p>
            <li onClick={editProfile}><RiEditLine /> Edit Profile</li>
        </>)
    }

    function editProfileHandleSubmit(data) {
        PUT(`drivers/${user.id}`, data, () => {
            setUser({
                id: user.id, username: data.username, name: data.name,
                phoneNumber: data.phoneNumber, company: companies[data.companyId]
            })
            setVisible(false)
        }, (error) => {
            if (error.status == 404)
                setErrorMsg("Driver not found")
            else if (error.status == 500)
                setErrorMsg('Something went wrong...')
            else
                setErrorMsg(error.statusText)
            setShowError(true);
        });
    }

    function editProfile() {
        console.log(companies)
        setUserDetails(<>
            <CgProfile className="big-profile-picture" />
            <form className='form-profile-container' onSubmit={handleSubmit(editProfileHandleSubmit)}>
                <label className='label'>Username:<input className='input' {...register("username")} defaultValue={user.username} /></label><br />
                <label className='label'>Name: <input className='input'  {...register("name")} defaultValue={user.name} /></label><br />
                <label className='label'>Phone Number: <input className='input'  {...register("phoneNumber")} defaultValue={user.phoneNumber} /></label><br />
                <label className='label'>Company: <select className='select' name="company" id="company" {...register("companyId")}>
                    {companies.map((company, index) => (
                        <option key={index} value={company.id}>{company.name}</option>
                    ))}
                </select></label>
                <input className='input' type="submit" value="Update" /><br />
            </form>
        </>)
    }
    
    function updatePasswordHandleSubmit(data) {
        if (data.newPassword !== data.verifyPassword) {
            setErrorMsg('password verification failed')
            setShowError(true);
        }
        PUT(`drivers/${user.id}`, { oldPassword: data.oldPassword, newPassword: data.newPassword }, () => {
            setVisible(false)
        }, (error) => {
            if (error.status == 404)
                setErrorMsg("Driver not found")
            else if (error.status == 500)
                setErrorMsg('Something went wrong...')
            else
                setErrorMsg(error.statusText)
            setShowError(true);
        })
    }

    function changePassword() {
        setPasswordForm(
            <form className='form-profile-container' onSubmit={handleSubmit(updatePasswordHandleSubmit)}>
                <label className='label'>Old password:<input className='input' {...register("oldPassword")} type='password' required /></label><br />
                <label className='label'>New password: <input className='input'  {...register("newPassword")} type='password' required /></label><br />
                <label className='label'>Verify new password: <input className='input'  {...register("verifyPassword")} type='password' required /></label><br />
                <input className='input' type="submit" value="Update password" /><br />
            </form>)
    }

    return (
        <>
            <div className="card">
                <Sidebar visible={visible} position="right" onHide={() => setVisible(false)}>
                    <ul>
                        {userDetails}
                        {!passwordForm && <li onClick={changePassword}><RiLockPasswordLine /> Change password</li>}
                        {passwordForm}
                        <li className='signOut'
                            onClick={() => {
                                signOut();
                                setVisible(false)
                            }}><PiSignOutLight /> Sign Out</li>
                    </ul>
                </Sidebar>
            </div >
            <LogErrors visible={showError} setVisible={setShowError} errorMsg={errorMsg} />
        </>
    );
};

export default ProfileMenu;