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
            .detail(this.props.match.params.system_id)
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
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <NavLink className="btn gp-outline-primary" exact to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-12 mb-4">
                        <h4>{name}</h4>
                        <p><strong>Token</strong>: {token} </p>
                    </div>

                    {this.state.govorg_wms_list.map((wms) =>
                        <div className="col-md-12 mb-4" key={wms.id}>
                            <h4> {wms.name} </h4>
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
