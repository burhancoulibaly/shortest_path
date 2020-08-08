import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//Passing component as Component for rendering as component, and ..rest as all other passed variables
const RouteGuard = ({ component: Component, user, logout, updateUser,  ...rest}) => (
    <Route {...rest} render={((props) => {
        switch (props.history.location.pathname){
            //If user is logged in trying to access the login page they get redirected to home page
            case "/login":
                return (
                    !user
                        ? <Component 
                            {...props}
                            logout={logout}
                            updateUser={updateUser} 
                          />
                        : <Redirect to='/home' />
                )
            
            //If user is not logged in they get redirected to login page
            default:
                return (
                    user
                        ? <Component 
                            {...props}
                          />
                        : <Redirect to='/login' />
                )
        }
    })} />
)

export default RouteGuard;