import React, { Component } from "react"
import AddressMap from './Map'
import {service} from '../Employee/service'
import Loader from "@utils/Loader"
import {Form} from './Form'

export default class Erguuleg extends Component {

    constructor(props) {
        super(props)
        this.state = {
            points: [],
            feature: {},
            is_loading: true,
            is_empty: false,
        }
        this.getAddresses = this.getAddresses.bind(this)
        this.saveErguulTailbar = this.saveErguulTailbar.bind(this)
    }

    componentDidMount() {
        this.getAddresses()
    }

    getAddresses() {
        service
            .getAddresses()
            .then(({ success, points }) => {
                if (success) {
                    let is_empty = false
                    if (points['features'].length < 2) {
                        is_empty = true
                    }
                    this.setState({ points, is_loading: false, is_empty })
                }
            })
    }

    saveErguulTailbar(values) {
        this.setState({ is_loading: true })
        service
            .saveTailbar(values)
            .then(({ success, info }) => {
                alert(info)
                this.setState({ is_loading: false })
            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                this.setState({ is_loading: false })
            })
    }

    render() {
        const { points, is_loading, is_empty } = this.state
        const { employee } = this.props

        const is_admin = employee.is_admin

        return (
            <div className="card">
                <div className="card-body">
                    <Loader is_loading={is_loading}/>
                    <div className="row">
                        <div className="col-4">
                            <Form
                                is_empty={is_empty}
                                saveErguulTailbar={(val) => this.saveErguulTailbar(val)}
                            />
                        </div>
                        <div className="col-8">
                            <AddressMap
                                features={points}
                                is_admin={is_admin}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

