import React, { useState, useEffect, useMemo } from 'react'
import { Menu } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useAppContext } from './App'

const AppNavigationItem = ({ name, link = null, title, onClick = null }) => {
    const history = useHistory()
    const [nowPath, setNowPath] = useState(window.location.pathname)

    useEffect(() => history.listen(() => {
        setNowPath(window.location.pathname)
    }), [history])

    const handleItemClick = () => {
        history.push(`${link}`)
    }

    return useMemo(() => {
        return (
            <Menu.Item
                name={name}
                active={nowPath === link}
                onClick={onClick === null ? handleItemClick : onClick}
            >{title}</Menu.Item>
        )
    }, [nowPath, name, link, title, onClick])
}

const AppNavigation = () => {
    const { logOut } = useAppContext()

    const handleItemClick = () => {
        logOut()
    }

    return (
        <Menu pointing secondary>
            <AppNavigationItem name="home" link="/home" title="Strona główna" />
            <AppNavigationItem name="scanner" link="/scanner" title="Skanowanie" />
            <AppNavigationItem name="import" link="/import" title="Import produktów" />
            <AppNavigationItem name="export" link="/export" title="Eksport produktów" />
            <Menu.Menu position='right'>
                <AppNavigationItem name="logout" title="Wyloguj" onClick={handleItemClick} />
            </Menu.Menu>
        </Menu>
    )
}

export default AppNavigation