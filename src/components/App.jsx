import React, { useState, createContext, useContext, useEffect } from 'react'
import AppRouting from './AppRouting'
import 'semantic-ui-css/semantic.min.css'
import { BrowserRouter as Router, useHistory } from 'react-router-dom'
import AppNavigation from './AppNavigation'
import { Grid, Loader } from 'semantic-ui-react'

import firebase from 'firebase'
require('firebase/auth')
import { FirebaseAuthProvider, FirebaseAuthConsumer } from '@react-firebase/auth'
import { FirebaseDatabaseProvider } from '@react-firebase/database'
import { config } from '../config'
import LoginPage from '../pages/LoginPage'


const AppContext = createContext(null)
export const useAppContext = () => {
    return useContext(AppContext)
}

const AppContextProvider = ({ children }) => {
    const history = useHistory()

    const [products, setProducts] = useState(null)
    const [scanHistory, setScanHistory] = useState(null)

    const checkLogin = (username, password) => {
        firebase.auth().signInWithEmailAndPassword(username, password)
    }

    const logOut = () => {
        firebase.auth().signOut()
    }

    const insertProduct = (id, payload) => {
        return firebase.database().ref('products/' + id).set(payload)
        // const response = await firebase.database().ref('products/' + id).set(payload)

        // return new Promise(response => {
        //     firebase.database().ref('products/' + id).set(payload)
        // })

    }

    const insertScanHistory = async (id, payload) => {
        const response = await firebase.database().ref('scanHistory/' + id).set(payload)
        setScanHistory({ [id]: payload, ...scanHistory })
    }

    const updateProduct = async (id, scannedCount) => {
        let _products = Object.assign({}, products)
        _products[id].scannedCount = scannedCount
        setProducts(_products)

        const response = await firebase.database().ref('products/' + id).update({
            scannedCount: scannedCount
        })
    }

    const deleteProducts = () => {
        return firebase.database().ref('products').remove()
    }

    const deleteScanHistory = () => {
        return firebase.database().ref('scanHistory').remove()
    }

    const getProducts = async () => {
        let _products = await (await firebase.database().ref('products').get()).toJSON()
        if (_products != null) {
            setProducts(_products)
        } else {
            setProducts({})
        }
    }

    const getScanHistory = async () => {
        let _scanHistory = await (await firebase.database().ref('scanHistory').limitToLast(30).get()).toJSON()
        if (_scanHistory != null) {
            setScanHistory(_scanHistory)
        } else {
            setScanHistory({})
        }
    }

    return (
        <FirebaseAuthProvider firebase={firebase} {...config}>
            <FirebaseAuthConsumer>

                {({ isSignedIn, user, providerId }) => {
                    if (providerId == null) {
                        return (
                            <Loader active inline="centered" />
                        )
                    }

                    return (
                        <AppContext.Provider value={{ checkLogin, insertProduct, insertScanHistory, updateProduct, deleteProducts, deleteScanHistory, products, scanHistory, getProducts, getScanHistory, logOut }}>
                            {isSignedIn ? (
                                <FirebaseDatabaseProvider firebase={firebase} {...config}>
                                    <Grid centered container={true}>
                                        <Grid.Column>
                                            <AppNavigation />
                                            {children}
                                        </Grid.Column>
                                    </Grid>
                                </FirebaseDatabaseProvider>
                            ) : <LoginPage />}
                        </AppContext.Provider>
                    )
                }}

            </FirebaseAuthConsumer>
        </FirebaseAuthProvider>
    )
}

const App = () => {
    return (
        <Router>
            <AppContextProvider>
                <AppRouting />
            </AppContextProvider>
        </Router>
    )
}

export default App