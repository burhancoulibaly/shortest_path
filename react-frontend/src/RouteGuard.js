import React from 'react';
import { Route, Redirect } from 'react-router-dom';

//Passing component as Component for rendering as component, and ..rest as all other passed variables
//TODO: Fix bug where route guard runs before the user is populated causing the app to redirect to login then redirect to home on refreshes
const RouteGuard = ({ component: Component, user, logout, updateUser, ...rest}) => {
    return (
        <Route {...rest} render={((props) => (
            user
                ? user === "loading"
                    ? <div style={{height: "100%", display:"flex", justifyContent: "center", alignItems: "center"}}></div>
                    : <Component 
                        {...props}
                        logout={!props.history.location.pathname === "/login" ? logout : null}
                        updateUser={updateUser}
                    />
                : <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
        ))} />
    )
}

export default RouteGuard;