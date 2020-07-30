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

        service
            .detail(this.props.match.params.id)
            .then(({govorg}) => {
                const govorg_wms_list =
                    govorg.wms_list
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
                        <NavLink className="btn btn-outline-primary" exact to={'/back/систем/'}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-12 mb-4">
                        <h1>{name}</h1>
                        <p><strong>Token</strong>: {token} </p>
                    </div>

                    {this.state.govorg_wms_list.map((wms) =>
                        <div className="col-md-12 mb-4" key={wms.id}>
                            <h1> {wms.name} </h1>
                            <input type="text" className="form-control" disabled value={wms.public_url}/>
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
