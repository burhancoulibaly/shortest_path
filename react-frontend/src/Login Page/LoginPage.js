import React, { useState, useEffect, useContext } from 'react';
import './LoginPage.css';
import AuthHelper from '../Auth Helpers/AuthHelper';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom'
import UserContext from "../UserContext";

//Todo move this function to its own file
//Returns login form based on login tab
const LoginForm = (props) => {
  if(props.loginTab === "login"){
    return (
      <form className="login">
        {props.loginState === "system-error" && <p className="error">Unable to log you in at this time</p>}
        {props.loginState === "invalid-login" && <p className="error">Invalid login credentials</p>}
        <div className="form-group">
          <label htmlFor="loginUsername">Username</label>
          <input type="username" className="form-control" id="loginUsername" aria-describedby="usernameHelp" placeholder="Enter Username"></input>
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <input type="password" className="form-control" id="loginPassword" placeholder="Password"></input>
        </div>
        <br></br>
        <button type="button" className="btn btn-primary" onClick={
            (e) => props.login(
            {
              variables: {
                username: e.target.form.elements[0].value,
                password: e.target.form.elements[1].value
              }
            },
            e.preventDefault(),
            // console.log(`"${e.target.form.elements[0].value}"`, `"${e.target.form.elements[1].value}"`),
            )
          }>Submit</button>
      </form>
    );
  }

  if(props.loginTab === "signup"){
    return (
      <form className="signup">
        {props.loginState === "system-error" && <p className="error">Unable to register you in at this time</p>}
        {props.loginState === "existing-account" && <p className="error">Username required</p>}
        {props.loginState === "existing-email" && <p className="error">Username required</p>}
        <div className="form-group">
          <label htmlFor="signupUsername">Username</label>
          <input type="username" className="form-control" id="signupUsername" aria-describedby="usernameHelp" placeholder="Enter Username"></input>
        </div>
        <div className="form-group">
          <label htmlFor="signupEmail">Email address</label>
          <input type="email" className="form-control" id="signupEmail" aria-describedby="emailHelp" placeholder="Enter Email"></input>
          <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>
        <div className="password">
          <div className="form-group">
            <label htmlFor="signupPassword1">Password</label>
            <input type="password" className="form-control" id="signupPassword1" placeholder="Password"></input>
          </div>
          <div className="form-group">
            <label htmlFor="signupPassword2">Confirm Password</label>
            <input type="password" className="form-control" id="signupPassword2" placeholder="Confirm Password"></input>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={
            (e) => props.signup(
            //have this call a function beforehand here to validate passwords and form elements
            {
              variables: {
                username: e.target.form.elements[0].value,
                email: e.target.form.elements[1].value,
                password: e.target.form.elements[2].value
              }
            },
            e.preventDefault(),
            // console.log(`"${e.target.form.elements[0].value}"`, `"${e.target.form.elements[1].value}"`),
            )
          }>Submit</button>
      </form>
    );
  }

  if(props.loginTab === "guest"){
    return (
      <form className="guest">
        {props.loginState === "system-error" && <p className="error">Unable to log you in at this time</p>}
        {props.loginState === "invalid-login" && <p className="error">Username required</p>}
        {props.loginState === "existing-account" && <p className="error">Username required</p>}
        {props.loginState === "existing-email" && <p className="error">Username required</p>}
        <div className="form-group">
          <label htmlFor="guestUsername">Username</label>
          <input type="username" className="form-control" id="guestUsername" aria-describedby="usernameHelp" placeholder="Enter Username"></input>
        </div>
        <button type="button" className="btn btn-primary" onClick={
            (e) => props.guest(
            {
              variables: {
                username: e.target.form.elements[0].value,
              }
            },
            e.preventDefault(),
            // console.log(`"${e.target.form.elements[0].value}"`,
            )
          }>Submit</button>
      </form>
    );
  }
};

function LoginPage(props) {
  //Login tab state variable
  const [user, setUser] = useContext(UserContext);
  const [loginTab, setLoginTab] = useState("login");
  const [loginState, setLoginState] = useState("");
  const [login, { error: loginError, data: loginData }] = useLazyQuery(AuthHelper.login, { fetchPolicy: "network-only" });
  const [guest, { error: guestError, data: guestData }] = useMutation(AuthHelper.guest);
  const [signup, { error: signupError, data: signupData }] = useMutation(AuthHelper.signup);

  //Only rerenders on changes
  useEffect(() => { 
    // <--------------------------------GUEST--------------------------------> 
    if(guestError){
      console.log(guestError);

      props.updateUser(guestError, setUser);

      props.logout(setUser);
  
      setLoginState("system-error");

      return;
    };
  
    if(guestData){
      if(!guestData.guest.response_type.includes("Error")){
        // console.log(guestData.guest);

        props.updateUser(guestData.guest, setUser);
        
        setLoginState("success");

        return;
      };
  
      console.log(guestData);

      props.updateUser(guestData, setUser);

      props.logout(setUser);
      
      return;
    };


    // <--------------------------------SIGNUP-------------------------------->

    if(signupError){
      console.log(signupError);

      props.updateUser(signupError, setUser);

      props.logout(setUser);
  
      setLoginState("system-error");

      return;
    };
  
    if(signupData){
      if(!signupData.register.response_type.includes("Error")){
        // console.log(signupData.register);

        props.updateUser(signupData.register, setUser);
        
        setLoginState("success");

        return;
      };
  
      console.log(signupData);

      props.updateUser(signupData, setUser);

      props.logout(setUser);
      
      return;
    };


    // <--------------------------------LOGIN-------------------------------->
  
    if(loginError){
      console.log(loginError);
      
      props.updateUser(loginError, setUser);

      props.logout(setUser);
      
      setLoginState("system-error");

      return;
    };
  
    if(loginData){
      if(!loginData.login.response_type.includes("Error")){
        // console.log(loginData.login);
        
        props.updateUser(loginData.login, setUser);

        setLoginState("success");

        return;
      };

  
      console.log(loginData.login);

      props.updateUser(loginData.login, setUser);

      props.logout(setUser);

      setLoginState("invalid-login");

      return;
    };
  }, [loginError, loginData, signupError, signupData, guestError, guestData, setUser, props])


  // <--------------------------------RENDERFORM-------------------------------->

  const renderForm = () => {
    return (
      <LoginForm 
        loginTab={loginTab}
        loginState={loginState}
        login={login}
        signup={signup}
        guest={guest}
      />
    )
  }

  //Change login window tab
  const changeLoginTab = (e, loginOption) => {
    // see if this becomes a problem later
    document.forms[0].reset();

    setLoginState("");

    let allLoginButtons = document.getElementsByClassName("login-options")[0].childNodes;
    
    allLoginButtons.forEach((button) => {
      button.classList.remove("active");
    });

    e.target.closest("button").classList.add("active");

    return loginOption;
  }

  // <--------------------------------HTML-------------------------------->
  if(loginState === "success"){
    return <Redirect to='/home' />
  }

  if(user){
    if(props.location.state){
      if(props.location.state.from.pathname === "/login"){
        return <Redirect to="/home" />
      }

      return <Redirect to={props.location.state.from.pathname} />
    }
  }

  return (
    <div id="login-page">
      <div className="login-container">
        <div className="login-form">
          {/* Login form */}
          {renderForm()}
          
          <div className="login-options">
            <button className="login-btn btn active" onClick={($event) => setLoginTab(changeLoginTab($event, `login`))}>
              <h1>Login</h1>
            </button>
            <button className="signup-btn btn" onClick={($event) => setLoginTab(changeLoginTab($event, `signup`))}>
              <h1>Sign Up</h1>
            </button>
            <button className="guest-btn btn" onClick={($event) => setLoginTab(changeLoginTab($event, `guest`))}>
              <h1>Guest</h1>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;