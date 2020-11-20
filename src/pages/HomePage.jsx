import React, { useState, useEffect } from 'react'
import { Grid, Message, Segment, Table, Loader } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../components/App'

const ProdcutsTableCell = ({ children }) => {
    return (
        <Table.Cell>{children}</Table.Cell>
    )
}

const ProdcutsTableRow = ({ barcode, name, count, scannedCount }) => {
    return (
        <Table.Row positive={count > 0 && count === scannedCount}>
            <ProdcutsTableCell>{barcode}</ProdcutsTableCell>
            <ProdcutsTableCell>{name}</ProdcutsTableCell>
            <ProdcutsTableCell>{count}</ProdcutsTableCell>
            <ProdcutsTableCell>{scannedCount}</ProdcutsTableCell>
        </Table.Row>
    )
}

const ProdcutsTable = ({ products }) => {
    return (
        <Table striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Kod kreskowy</Table.HeaderCell>
                    <Table.HeaderCell>Nazwa</Table.HeaderCell>
                    <Table.HeaderCell>Ilość</Table.HeaderCell>
                    <Table.HeaderCell>Skanowana ilość</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {Object.keys(products).map(barcode => <ProdcutsTableRow key={barcode} {...products[barcode]} />)}
            </Table.Body>
        </Table>
    )
}

const HomePage = () => {
    const { products, getProducts } = useAppContext()

    useEffect(() => {
        getProducts()
    }, [])

    if (products == null) {
        return (
            <Segment>
                <Loader active inline="centered" />
            </Segment>
        )
    }

    return (
        <Grid>
            {Object.keys(products).lenght === 0 ? (
                <Grid.Column>
                    <Message negative>
                        <Message.Header>Brak produktów</Message.Header>
                        <p><Link to="/import">Zaimportuj produkty</Link></p>
                    </Message>
                </Grid.Column>
            ) : (
                    <Grid.Column>
                        <ProdcutsTable products={products} />
                    </Grid.Column>
                )}
        </Grid>
    )
}

export default HomePage