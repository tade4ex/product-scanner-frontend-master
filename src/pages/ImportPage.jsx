import React, { useState, useRef } from 'react'
import { useAppContext } from '../components/App'
import { Header, Form, Segment, Button, Loader, Message } from 'semantic-ui-react'
import XLSX from 'xlsx'

const ImportPage = () => {
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false)
    const { insertProduct, deleteProducts, deleteScanHistory } = useAppContext()
    const file = useRef()

    const handleChangeFile = () => {
        const selectedFile = file.current.files[0]
        const reader = new FileReader()
        const rABS = !!reader.readAsBinaryString

        reader.onload = event => {
            const bstr = event.target.result
            const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" })

            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            const data = XLSX.utils.sheet_to_json(ws, {
                header: 1
            })

            const dataSorted = {}
            data.slice(1).forEach(row => {
                let jRow = {
                    name: row[1],
                    price: row[3],
                    count: parseInt(row[2]),
                    scannedCount: 0,
                    barcode: `${row[4]}`
                }
                if (dataSorted[jRow.barcode] == null) {
                    dataSorted[jRow.barcode] = jRow
                } else {
                    dataSorted[jRow.barcode].count += jRow.count
                }
            })

            let promisses = [deleteProducts(), deleteScanHistory()]


            Object.keys(dataSorted).forEach(id => {
                if (id != null) {
                    if (/^[A-Za-z0-9]*$/.test(id)) {
                        // console.log(id, dataSorted[id])
                        promisses.push(insertProduct(id, dataSorted[id]))
                    }
                }
            })

            setLoading(true)

            Promise.all(promisses).then((values) => {
                // console.log(values);
                setLoading(false)
                setMessage({
                    success: true,
                    header: 'Produkty zostały zaimportowane!'
                })
            });

        }

        if (rABS) reader.readAsBinaryString(selectedFile);
        else reader.readAsArrayBuffer(selectedFile);
    }

    return (
        <Segment>
            {message !== null && <Message {...message} />}
            {loading ? <Loader active inline="centered" /> : (
                <Form>
                    <Header as="h2">Wybierz plik</Header>
                    <input ref={file} type="file" onChange={handleChangeFile} />
                </Form>
            )}
        </Segment>
    )
}

export default ImportPage