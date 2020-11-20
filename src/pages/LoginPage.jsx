import React, { useState } from 'react'
import { Grid, Header, Icon, Button, Checkbox, Form } from 'semantic-ui-react'
import { useAppContext } from '../components/App'

const LoginPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const {checkLogin} = useAppContext()

    const handleSubmit = (event) => {
        checkLogin(username, password)
    }

    return (
        <Grid columns={5} centered style={{
            width: "100vw",
            height: "100vh"
        }}>
            <Grid.Row verticalAlign="middle">
                <Grid.Column >
                    <Form onSubmit={handleSubmit}>
                        <Header as="h2" icon textAlign="center">
                            <Icon name="user" circular />
                            <Header.Content>Logowanie</Header.Content>
                        </Header>
                        <Form.Field>
                            <label>Uzytkownik</label>
                            <input placeholder="Uzytkownik" value={username} onChange={event => setUsername(event.target.value)} />
                        </Form.Field>
                        <Form.Field>
                            <label>Hasło</label>
                            <input placeholder="Hasło" type="password" value={password} onChange={event => setPassword(event.target.value)} />
                        </Form.Field>
                        <Button type="submit" color="green">Zaloguj</Button>
                    </Form>
                </Grid.Column>
            </Grid.Row>
        </Grid>




    )
}

export default LoginPage