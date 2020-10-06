import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import {service} from './service'
import {ConfigForm} from './ConfigForm'
import Config from './Config'
import DiskSize from './DiskSize'


export class ConfigList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            config_list: [],
            disk: {},
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
        service.getDisk().then(({disk}) => {
            this.setState({disk})
        })
    }

    handleRemoved(id) {
        const config_list = this.state.config_list.filter(config => config.id != id)
        this.setState({config_list})
    }

    handleRemove(id){
        service.remove(id).then(({success}) => {
            success && this.handleListUpdated()
        })
    }

    render() {

        const {config_list, disk} = this.state

        return (
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="text-right mb-4">
                                    <NavLink className="btn gp-btn-primary" to={"/back/тохиргоо/үүсгэх/"}>
                                        Нэмэх
                                    </NavLink>
                            </div>
                            <div className="table-responsive">
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
                                            handleRemove={()=>this.handleRemove(config.id)}
                                            />
                                        )}
                                    </tbody>
                                </table>
                                <div className="col-md-12">
                                    <h4 className="my-4">Дискийн хэмжээ</h4>
                                    <DiskSize disk={disk}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
