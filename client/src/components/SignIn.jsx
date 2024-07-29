import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from "../components/Main.jsx";
import cookies from "js-cookie";
import LogErrors from "./LogErrors.jsx";
import '../styles.css';


export default function SignIn({ userType }) {

  const { setUser } = useContext(UserContext);
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState()

  useEffect(() => {
    const type = cookies.get('type');
    if ((type == 'drivers' || type == userType) && cookies.get('user')) {
      const currentUser = JSON.parse(cookies.get('user'))
      setUser(currentUser);
      navigate(`/${userType}/${currentUser.username}`);
    }
  }, [userType]);

  const loginHandleSubmit = (data) => {
    fetch(`http://localhost:8080/${userType}/signin`, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        'Origin': 'http://localhost:8080'
      }
    }).then(response => {
      if (!response.ok)
        throw response;
      return response.json();
    }).then(dataFromServer => {
      setUser({ id: dataFromServer, username: data.username });
      cookies.set('type', userType);
      navigate(`/${userType}/${data.username}`);
    }).catch(error => {
      if (error.status == 401)
        setErrorMsg('Incorrect username or password')
      else if (error.status == 500)
        setErrorMsg('Something went wrong...')
      else
        setErrorMsg(error.statusText)
      setShowError(true);
    })
  }


  return (
    <>
      <div className="background-overlay"></div>
      <div className="login form-container">
        <form onSubmit={handleSubmit(loginHandleSubmit)}>
          <h3>LOGIN HERE</h3>
          <input type="text" name="username" pattern='^[a-zA-Z0-9]{5,20}$' {...register("username")} placeholder="Username" required /><br />
          <input type="password" name="password" pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,20}$' {...register("password")} placeholder="Password" required /><br />
          <input type="submit" value="Submit" /><br />
          <a href={`/${userType}/signup`}>new {userType.slice(0, -1)}? register here</a>
        </form>
      </div>
      <LogErrors visible={showError} setVisible={setShowError} errorMsg={errorMsg} />
    </>
  );
}