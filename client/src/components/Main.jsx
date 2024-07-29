import React, { createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./Header";
import GetTaxi from "./GetTaxi";
import SignIn from "./SignIn"
import SignUp from "./SignUp"
import Drivers from './Drivers'
import Dashboard from "./Dashboard"
import useCookie from "./useCookie";

export const UserContext = createContext();

export default function Main() {
    const [user, setUser] = useCookie('user', '');

    return (<>
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Header />} >
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" >
                            <Route index element={<SignIn userType='users' />} />
                            <Route path="signin" element={<SignIn userType='users' />} />
                            <Route path="signup" element={<SignUp userType='users' />} />
                            <Route path=":username" element={<GetTaxi />} />
                        </Route>
                        <Route path="drivers">
                            <Route index element={<SignIn userType='drivers' />} />
                            <Route path="signin" element={<SignIn userType='drivers' />} />
                            <Route path="signup" element={<SignUp userType='drivers' />} />
                            <Route path=":username" element={<Drivers />} />
                        </Route>
                    </Route>

                </Routes>
            </Router>
        </UserContext.Provider>
    </>)
}