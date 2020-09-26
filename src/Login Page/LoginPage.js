import React, { useState, useEffect, useContext, useRef } from 'react';
import './LoginPage.css';
import AuthHelper from '../Helpers/AuthHelper';
import InputValidationHelper from '../Helpers/InputValidationHelper';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom'
import UserContext from "../UserContext";

//Todo move this function to its own file
//Returns login form based on login tab
const LoginForm = (props) => {
  const [inputLoginState, setInputLoginState] = useState({
    isUsernameValid: true,
    usernameErrorMessage: "",
  })

  const [inputSignUpState, setInputSignUpState] = useState({
    isUsernameValid: true,
    usernameErrorMessage: "",
    isEmailValid: true,
    emailErrorMessage: "",
    isPasswordValid: true,
    passwordErrorMessage: "",
    passwordsMatch: true,
    passwordMatchErrorMessage: "",
  })

  const [inputGuestState, setInputGuestState] = useState({
    isUsernameValid: true,
    usernameErrorMessage: "",
  })

  const validateGuest = (e, username) => {
    const isUsernameValid = InputValidationHelper.validateUsername(username);

    // console.log(isUsernameValid)
    setInputGuestState({
      ...inputGuestState,
      isUsernameValid: isUsernameValid,
      usernameErrorMessage: !isUsernameValid ? "Enter a valid username" : "",
    })

    if(isUsernameValid){
      e.preventDefault();

      props.guest({
        variables: {
          username: username,
        }
      })
    }
  }

  const validateSignUp = (e, username, email, password1, password2) => {
    const isUsernameValid = InputValidationHelper.validateUsername(username);
    const isEmailValid = InputValidationHelper.validateEmail(email);
    const isPasswordValid = InputValidationHelper.validatePassword(password1);
    const passwordsMatch = InputValidationHelper.validatePasswords(password1, password2);

    
    // console.log(isUsernameValid)
    setInputSignUpState({
      ...inputSignUpState,
      isUsernameValid: isUsernameValid,
      usernameErrorMessage: !isUsernameValid ? "Enter a valid username" : "",
      isEmailValid: isEmailValid,
      emailErrorMessage: !isEmailValid ? "Enter a valid email" : "",
      isPasswordValid: isPasswordValid,
      passwordErrorMessage: !isPasswordValid ? "Password must be a minimum of 8 characters" : "",
      passwordsMatch: passwordsMatch,
      passwordMatchErrorMessage: !passwordsMatch ? "Passwords must match" : "",
    })

    if(isUsernameValid && isEmailValid && isPasswordValid && passwordsMatch){
      e.preventDefault();

      props.signup({
        variables: {
          username: username,
          email: email,
          password: password1
        }
      })
    }
  }

  const validateLogin = (e, username, password) => {
    const isUsernameValid = InputValidationHelper.validateUsername(username);

    // console.log(isUsernameValid)
    setInputLoginState({
      ...inputLoginState,
      isUsernameValid: isUsernameValid,
      usernameErrorMessage: !isUsernameValid ? "Enter a valid username" : "",
    })

    if(isUsernameValid){
      e.preventDefault();

      props.login({
        variables: {
          username: username,
          password: password
        }
      })
    }
  }

  if(props.loginTab === "login"){
    return (
      <form className="login">
        {props.loginState === "system-error" && <p className="error-text">Unable to log you in at this time</p>}
        {props.loginState === "invalid-login" && <p className="error-text">Invalid login credentials</p>}
        {!inputLoginState.isUsernameValid && <div className="error-text">{inputLoginState.usernameErrorMessage}</div>}

        <div className="form-group">
          <label htmlFor="loginUsername">Username</label>
          <input type="username" className={(!inputLoginState.isUsernameValid ? "error" : "") + " form-control"} id="loginUsername" aria-describedby="usernameHelp" placeholder="Enter Username"></input>
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <input type="password" className="form-control" id="loginPassword" placeholder="Password"></input>
        </div>
        <br></br>
        <button type="button" className="btn btn-primary" onClick={(e) => validateLogin(e, e.target.form.elements[0].value, e.target.form.elements[1].value)}>Submit</button>
      </form>
    );
  }

  if(props.loginTab === "signup"){
    return (
      <form className="signup">
        {props.loginState === "system-error" && <p className="error-text">Unable to register you in at this time</p>}
        {props.loginState === "existing-account" && <p className="error-text">Account with this username already exist</p>}
        {props.loginState === "existing-email" && <p className="error-text">Account with this email already exist</p>}
        {!inputSignUpState.isUsernameValid && <div className="error-text">{inputSignUpState.usernameErrorMessage}</div>}
        {!inputSignUpState.isEmailValid && <div className="error-text">{inputSignUpState.emailErrorMessage}</div>}
        {!inputSignUpState.isPasswordValid && <div className="error-text">{inputSignUpState.passwordErrorMessage}</div>}
        {!inputSignUpState.passwordMatch && <div className="error-text">{inputSignUpState.passwordMatchErrorMessage}</div>}

        <div className="user-ids">
          <div className="form-group">
            <label htmlFor="signupUsername">Username</label>
            <input type="username" className={(!inputSignUpState.isUsernameValid ? "error" : "") + " form-control"} id="signupUsername" aria-describedby="usernameHelp" placeholder="Enter Username"></input>
          </div>
          <div className="form-group">
            <label htmlFor="signupEmail">Email address</label>
            <input className={(!inputSignUpState.isEmailValid ? "error" : "") + " form-control"} id="signupEmail" aria-describedby="emailHelp" placeholder="Enter Email"></input>
            { document.documentElement.clientWidth > 768 && document.documentElement.clientHeight > 768 &&
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            }
          </div>
        </div>
        
        <div className="password">
          <div className="form-group">
            <label htmlFor="signupPassword1">Password</label>
            <input type="password" className={(!inputSignUpState.isPasswordValid || !inputSignUpState.passwordsMatch ? "error" : "") + " form-control"} id="signupPassword1" placeholder="Password"></input>
          </div>
          <div className="form-group">
            <label htmlFor="signupPassword2">Confirm Password</label>
            <input type="password" className={(!inputSignUpState.isPasswordValid || !inputSignUpState.passwordsMatch ? "error" : "") + " form-control"} id="signupPassword2" placeholder="Confirm Password"></input>
          </div>
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => validateSignUp(e, e.target.form.elements[0].value, e.target.form.elements[1].value, e.target.form.elements[2].value, e.target.form.elements[3].value)}>Submit</button>
      </form>
    );
  }

  if(props.loginTab === "guest"){
    return (
      <form className="guest">
        {props.loginState === "system-error" && <p className="error-text">Unable to log you in at this time</p>}
        {props.loginState === "invalid-login" && <p className="error-text">Invalid Login</p>}
        {props.loginState === "existing-account" && <p className="error-text">Existing account</p>}
        {!inputGuestState.isUsernameValid && <div className="error-text">{inputGuestState.usernameErrorMessage}</div>}

        <div className="form-group">
          <label htmlFor="guestUsername">Username</label>
          <input type="username" className={(!inputGuestState.isUsernameValid ? "error" : "") + " form-control"} id="guestUsername" aria-describedby="usernameHelp" placeholder="Enter Username"></input>
        </div>
        <button type="button" className="btn btn-primary" onClick={(e) => validateGuest(e, e.target.form.elements[0].value)}>Submit</button>
      </form>
    );
  }
};

function LoginPage(props) {
  //Login tab state variable
  const {user, setUser} = useContext(UserContext);
  const [loginTab, setLoginTab] = useState("login");
  const [loginState, setLoginState] = useState("");
  const [login, { error: loginError, data: loginData }] = useLazyQuery(AuthHelper.login);
  const [guest, { error: guestError, data: guestData }] = useMutation(AuthHelper.guest);
  const [signup, { error: signupError, data: signupData }] = useMutation(AuthHelper.signup);

  const propsRef = useRef(props)
 
  useEffect(() => {
    propsRef.current = props;
  }, [props])

  //Only rerenders on changes
  useEffect(() => { 
    // <--------------------------------GUEST--------------------------------> 
    if(guestError){
      console.log(guestError);

      propsRef.current.updateUser(guestError, setUser);

      propsRef.current.logout(setUser);
  
      setLoginState("system-error");

      return;
    };
  
    if(guestData){
      if(!guestData.guest.response_type.includes("Error")){
        // console.log(guestData.guest);

        propsRef.current.updateUser(guestData.guest, setUser);
        
        setLoginState("success");

        return;
      };
  
      // console.log(guestData);

      propsRef.current.updateUser(guestData, setUser);

      propsRef.current.logout(setUser);

      if(guestData.guest.response === "Account already exist"){
        setLoginState("existing-account");
      }else{
        setLoginState("invalid-login");
      }
      
      return;
    };
  }, [guestError, guestData, setUser])

  useEffect(() => { 
    // <--------------------------------SIGNUP-------------------------------->

    if(signupError){
      console.log(signupError);

      propsRef.current.updateUser(signupError, setUser);

      propsRef.current.logout(setUser);
  
      setLoginState("system-error");

      return;
    };
  
    if(signupData){
      if(!signupData.register.response_type.includes("Error")){
        // console.log(signupData.register);

        propsRef.current.updateUser(signupData.register, setUser);
        
        setLoginState("success");

        return;
      };
  
      // console.log(signupData);

      propsRef.current.updateUser(signupData, setUser);

      propsRef.current.logout(setUser);

      if(signupData.register.response === "Account already exist"){
        setLoginState("existing-account");
      }else{
        setLoginState("invalid-login");
      }
      
      return;
    };
  }, [signupError, signupData, setUser])
  
  useEffect(() => { 
    // <--------------------------------LOGIN-------------------------------->
  
    if(loginError){
      console.log(loginError);
      
      propsRef.current.updateUser(loginError, setUser);

      propsRef.current.logout(setUser);
      
      setLoginState("system-error");

      return;
    };
  
    if(loginData){
      if(!loginData.login.response_type.includes("Error")){
        // console.log(loginData.login);
        
        propsRef.current.updateUser(loginData.login, setUser);

        setLoginState("success");

        return;
      };

  
      // console.log(loginData.login);

      propsRef.current.updateUser(loginData.login, setUser);

      propsRef.current.logout(setUser);

      setLoginState("invalid-login");

      return;
    };
  }, [loginError, loginData, setUser])


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