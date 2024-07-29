import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { UserContext } from "../components/Main.jsx";
import { GET, POST, PUT } from "../fetchFunctions";
import LogErrors from "./LogErrors.jsx";
import cookies from 'js-cookie';
import '../styles.css';

export default function SignUp({ userType }) {
  const { user, setUser } = useContext(UserContext);
  const { register, handleSubmit } = useForm();
  const [formToShow, setFormToShow] = useState('initialForm');
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false)
  const [errorMsg, setErrorMsg] = useState()

  const initialForm = (
    <>
      <input type="text" name="username" pattern='^[a-zA-Z0-9]{5,20}$'  {...register("username")} required placeholder="Username" /><br />
      <input type="password" name="password" pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,20}$' {...register("password")} required placeholder="Password" /><br />
      <input type="password" name="verifyPassword" pattern='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{8,20}$' {...register("verifyPassword")} required placeholder="Verify Password" /><br />
      <button type="submit">submit</button><br />
    </>
  );

  const fullDetailsForm = (
    <>
      <input type="text" name="name" pattern='^[a-zA-Z0-9]{3,20}$' {...register("name")} required placeholder="Name" /><br />
      <input type="text" name="phoneNumber" {...register("phoneNumber")} pattern="[0-9\-\+\s]{7,14}" required placeholder="Phone number" /><br />
      {userType === 'drivers' && companies.length > 0 && (
        <>
          <input type="text" name="idNumber" pattern="^[0-9]{9}$" {...register("idNumber")} required placeholder="ID number" /><br />
          <select name="company" id="company" {...register("companyId")}>
            {companies.map((company, index) => (
              <option key={index} value={company.id}>{company.name}</option>
            ))}
          </select>
        </>
      )}
      <button type="submit">submit</button><br />
    </>
  );

  useEffect(() => {
    const type = cookies.get('type');
    if ((type === userType || type === 'drivers') && cookies.get('user')) {
      const currentUser = JSON.parse(cookies.get('user'))
      setUser(currentUser);
      navigate(`../${userType}/${currentUser.username}`);
    }
    GET('companies', setCompanies, (error) => {
      if (error.status != 404)
        setErrorMsg(error.statusText)

      else if (error.status == 500)
        setErrorMsg('Something went wrong...')
      else
        setErrorMsg(error.statusText)
      setShowError(true);

    });
  }, []);

  const registerHandleSubmit = (data) => {
    if (data.password !== data.verifyPassword) {
      setErrorMsg('password verification failed')
      setShowError(true);
    }
    POST(`${userType}/signup`, { username: data.username, password: data.password }, (dataFromServer) => {
      setFormToShow('fullDetailsForm');
      setUser({ id: dataFromServer, username: data.username });
    }, (error) => {
      if (error.status == undefined)
        setErrorMsg(error)
      if (error.status == 409)
        setErrorMsg('The username is not available')
      else if (error.status == 500)
        setErrorMsg('Something went wrong...')
      else
        setErrorMsg(error.statusText)
      setShowError(true);
    });
  };

  async function addNewUser(data) {
    const { username, password, verifyPassword, ...body } = data;
    PUT(`${userType}/${user.id}`, body, () => {
      cookies.set('type', userType)
      navigate(`../${user.username}`);
    }, (error) => {
      if (error.status == 404)
        setErrorMsg("Driver not found")
      else if (error.status == 500)
        setErrorMsg('Something went wrong...')
      else
        setErrorMsg(error.statusText)
      setShowError(true);
    });
  };

  return (
    <>
      <div className="background-overlay"></div>
      <div className="register form-container">
        <form onSubmit={formToShow === 'initialForm' ? handleSubmit(registerHandleSubmit) : handleSubmit(addNewUser)}>
          <h3>REGISTER HERE</h3>
          {formToShow === 'initialForm' && initialForm}
          {formToShow === 'fullDetailsForm' && fullDetailsForm}
          <a href={`/${userType}/signin`}>already have an account ? login here</a>
        </form>
      </div>
      <LogErrors visible={showError} setVisible={setShowError} errorMsg={errorMsg} />
    </>
  );
}