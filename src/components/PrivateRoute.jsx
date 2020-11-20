import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { useAppContext } from './App'

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isSignedIn } = useAppContext()

    return (
        <Route {...rest} render={(props) => (
            isSignedIn === true
                ? <Component {...props} />
                : <Redirect to='/login' />
        )} />
    )
}

export default PrivateRoute