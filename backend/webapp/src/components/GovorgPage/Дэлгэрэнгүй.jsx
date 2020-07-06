import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

import {service} from './service'


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)

        this.state = {
            govorg: {},
            govorg_wms_list: [],
        }
    }

    componentDidMount() {

        Promise.all([
            service.getWMSList(),
            service.detail(this.props.match.params.id),
        ]).then(([{wms_list}, {govorg}]) => {
            const govorg_wms_list =
                wms_list
                .map((wms) => {
                    return {
                        ...wms,
                        layer_list: wms.layer_list.filter((layer) => {
                            return govorg.layers.indexOf(layer.id) > -1
                        })
                    }
                })
                .filter((wms) => wms.layer_list.length)
            this.setState({govorg, govorg_wms_list})
        })
    }

    render() {

        const {name, token} = this.state.govorg

        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <NavLink className="btn btn-outline-primary" exact to={'/back/байгууллага/'}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-12 mb-4">
                        <strong>Нэр</strong>
                        <p> {name} </p>
                    </div>

                    <div className="col-md-12 mb-4">
                        <strong>Токен</strong>
                        <p> {token} </p>
                    </div>

                    {this.state.govorg_wms_list.map((wms) =>
                        <div className="col-md-12 mb-4" key={wms.id}>
                            <p><strong>{wms.name}</strong> {wms.public_url}</p>
                            <ul>
                                {wms.layer_list.map((layer, idx) =>
                                    <li key={idx}>
                                        {layer.title} ({layer.code})
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        )

    }

}
