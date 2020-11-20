import React, { useState, useEffect } from 'react'
import { Segment, Loader, Header, Form, Message } from 'semantic-ui-react'
import { useAppContext } from '../components/App'

const ScanHistoryMessage = ({success, header, content}) => {
    return <Message success={success} error={!success} header={header} content={content} />
}

const ScannerPage = () => {
    const [value, setValue] = useState('')
    const { products, insertScanHistory, scanHistory, getProducts, getScanHistory, updateProduct } = useAppContext()

    useEffect(() => {
        getProducts()
        getScanHistory()
    }, [])


    const handleChangeInput = event => {
        setValue(event.target.value)
    }

    const handleKeyUp = event => {
        if (event.keyCode === 13) {
            let id = (new Date()).getTime() + '-scan'
            if (products[value] != null) {
                let product = products[value]
                if (product.count > 0 && product.count > product.scannedCount) {
                    updateProduct(value, product.scannedCount + 1)
                    insertScanHistory(id, {
                        id: id,
                        success: true,
                        header: `Product został zeskanowany (${product.barcode})`,
                        content: `Nazwa: ${product.name}, ilość: ${product.count}, zeskanowana ilość: ${product.scannedCount}`
                    })
                } else {
                    insertScanHistory(id, {
                        id: id,
                        success: false,
                        header: `Product nie został zeskanowany (${product.barcode})`,
                        content: `Nazwa: ${product.name}, ilość: ${product.count}, zeskanowana ilość: ${product.scannedCount}`
                    })
                }
            } else {
                insertScanHistory(id, {
                    id: id,
                    success: false,
                    header: `Product z kodem kreskowym (${value}) został nie znaleziony.`,
                    content: ``
                })
            }
            setValue('')
        }
    }

    if (products == null || scanHistory == null) {
        return (
            <Segment>
                <Loader active inline="centered" />
            </Segment>
        )
    }

    return (
        <Segment>
            <Header as="h2">Skanuj produkty</Header>
            <Form>
                <Form.Input type="text" label="Wprowadź kod kreskowy" onChange={handleChangeInput} onKeyUp={handleKeyUp} value={value} />
            </Form>
            {Object.keys(scanHistory).sort((a, b) => {
                if (parseInt(a) < parseInt(b)) return 1
                if (parseInt(a) > parseInt(b)) return -1
                return 0
            }).map(id => <ScanHistoryMessage key={id} {...scanHistory[id]} />)}
        </Segment>
    )
}

export default ScannerPage