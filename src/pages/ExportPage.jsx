import React, { useState, useEffect, useRef } from 'react'
import { Segment, Header, Button, Loader, Form } from 'semantic-ui-react'
import { useAppContext } from '../components/App'
import XLSX from 'xlsx'

const ExportPage = () => {
    const [loading, setLoading] = useState(false)
    const [notExportZeroRows, setNotExportZeroRows] = useState(false)
    const { products, getProducts } = useAppContext()

    const handleChangeChecked = (event, { checked }) => {
        setNotExportZeroRows(checked)
    }

    const exportData = () => {
        getProducts()
        setLoading(true)



    }

    useEffect(() => {
        if (products != null && loading) {
            // console.log(products)
            let data = [
                ['Lp', 'Nazwa', 'Ilość', 'Wartość', 'Kod kreskowy', 'Ilość importu']
            ];
            Object.keys(products).forEach(barcode => {
                let product = products[barcode]
                let count = product.count - product.scannedCount
                if (notExportZeroRows) {
                    if (count > 0) {
                        data.push([
                            data.length,
                            product.name,
                            count,
                            product.price,
                            product.barcode,
                            product.count
                        ])
                    }
                } else {
                    data.push([
                        data.length,
                        product.name,
                        count,
                        product.price,
                        product.barcode,
                        product.count
                    ])
                }
            })

            const ws = XLSX.utils.aoa_to_sheet(data)
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Skaner')
            /* generate XLSX file and send to client */

            XLSX.writeFile(wb, `scan-results-${(new Date()).getTime()}.ods`)

            // console.log(data, notExportZeroRows)
            setLoading(false)

        }
    }, [products, loading])



    return (
        <Segment>
            <Header as="h2">Eksport produktów</Header>
            {loading ? <Loader active inline="centered" /> : (
                <Form>
                    <Form.Checkbox label='Nie exportuj 0 pozycji' onChange={handleChangeChecked} />
                    <Button onClick={exportData} color="green">Pobierz</Button>
                </Form>
            )}
        </Segment>
    )
}

export default ExportPage