import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import {service} from './service'
import {ConfigForm} from './ConfigForm'
import Config from './Config'


export class ConfigList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            config_list: [],
            is_form_open: true,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({config_list}) => {
            this.setState({config_list})
        })
    }

    handleRemoved(id) {
        const config_list = this.state.config_list.filter(config => config.id != id)
        this.setState({config_list})
    }

    render() {

        const {config_list, is_form_open, showModal, modalText, modalTitle} = this.state

        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12">
                        <div className="text-right mb-4">
                            <NavLink className="btn gp-bg-primary" to={"/back/тохиргоо/үүсгэх/"}>
                                Нэмэх
                            </NavLink>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Нэр</th>
                                    <th scope="col">Утга</th>
                                    <th scope="col">Зассан</th>
                                    <th scope="col"></th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {config_list.map((config, idx) =>
                                    <Config key={config.id} values={config}
                                    handleUpdated={() => this.handleRemoved(config.id)}
                                    />
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        )
    }
}
