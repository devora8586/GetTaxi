import React, { useState } from "react";
import { NavLink, Outlet } from 'react-router-dom';
import cookies from 'js-cookie';
import ProfileMenu from "./ProfileMenu";
import { CgProfile } from "react-icons/cg";
import { signOut } from "../functions";
import logo from '../img/logo.png'
import '../styles.css';


export default function Header() {
    const [profileImg, setProfileImg] = useState(null);
    const [visible, setVisible] = useState(false)
    const userType = cookies.get("type");

    return (
        <>
            <nav>
                <div className="nav-links">
                    <img className="logo" src={logo} />
                    <span>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
                            About us
                        </NavLink>
                    </span>
                    <span>
                        <NavLink to="users" className={({ isActive }) => isActive ? "active" : ""}>
                            Get a taxi
                        </NavLink>
                    </span>
                    <span>
                        <NavLink to="drivers" className={({ isActive }) => isActive ? "active" : ""}>
                            Sign in as a driver
                        </NavLink>
                    </span>
                </div>
                {userType == 'drivers' && <>{profileImg != null ? <img src={profileImg} className="profile-picture" onClick={() => setVisible(true)} /> :
                    <CgProfile className="profile-picture" onClick={() => setVisible(true)} />}</>}
            </nav>
            <ProfileMenu profileImg={profileImg} setProfileImg={setProfileImg} setVisible={setVisible} visible={visible} signOut={signOut} />
            <Outlet />
        </>
    );
}