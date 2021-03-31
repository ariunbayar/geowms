import React, { Component } from "react"
import AddressMap from './Map'
import {service} from '../Employee/service'
import Loader from "@utils/Loader"
import {Form} from './Form'
import {ErguulDetail} from "./ErguulDetail"

export default class Erguuleg extends Component {

    constructor(props) {
        super(props)
        this.state = {
            points: [],
            feature: {},
            is_loading: true,
            is_empty: false,
            infos: [],
            is_open: false,
        }
        this.getAddresses = this.getAddresses.bind(this)
        this.saveErguulTailbar = this.saveErguulTailbar.bind(this)
        this.handleOpen = this.handleOpen.bind(this)
    }

    componentDidMount() {
        this.getAddresses()
    }

    getAddresses() {
        service
            .getErguul()
            .then(({ success, points }) => {
                if (success) {
                    let is_empty = false
                    if (points.length > 0 || points['features'].length < 2) {
                        is_empty = true
                    }
                    this.setState({ points, is_empty, is_loading: false })
                }
            })
    }

    saveErguulTailbar(values, id) {
        this.setState({ is_loading: true })
        service
            .saveTailbar(values, id)
            .then(({ success, info }) => {
                alert(info)
                this.setState({ is_loading: false })
            })
            .catch(error => {
                alert("Алдаа гарсан байна")
                this.setState({ is_loading: false })
            })
    }

    handleOpen() {
        this.setState({ is_open: !this.state.is_open })
    }

    render() {
        const { points, is_loading, is_empty, infos, is_open } = this.state
        const { employee } = this.props

        const is_admin = employee.is_admin
        return (
            <div className="card">
                <div className="card-body">
                    <Loader is_loading={is_loading}/>
                        <button className="btn gp-outline-primary" onClick={this.handleOpen}>
                            {
                                is_open
                                ?
                                    'Эргүүлд гарсан мэдээлэл'
                                :
                                    'Эргүүлд гарсан ажилчдын мэдээлэл'

                            }
                        </button>
                    <br/><br/>
                    {
                        is_open
                        ?
                            <ErguulDetail
                                {...this.props}
                            />
                        :
                            <div>
                                <div className="row">
                                    <div className="col-4">
                                        <Form
                                            is_empty={is_empty}
                                            infos={infos}
                                            saveErguulTailbar={
                                                (...values) => this.saveErguulTailbar(...values)
                                            }
                                        />
                                    </div>
                                    <div className="col-8">
                                        <AddressMap
                                            features={points}
                                            is_admin={false}
                                        />
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

