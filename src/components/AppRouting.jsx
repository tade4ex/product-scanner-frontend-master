import React from 'react'
import { Route } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import PrivateRoute from './PrivateRoute'
import HomePage from '../pages/HomePage'
import ImportPage from '../pages/ImportPage'
import ScannerPage from '../pages/ScannerPage'
import ExportPage from '../pages/ExportPage'

const AppRouting = () => {
    return (
        <div>
            <Route path="/home" component={HomePage} exact />
            <Route path="/import" component={ImportPage} exact />
            <Route path="/scanner" component={ScannerPage} exact />
            <Route path="/export" component={ExportPage} exact />
            <Route path="/" component={HomePage} exact />
        </div>
    )
}

export default AppRouting