import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

import {service} from './service'


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)

        this.state = {
            govorg: {},
            govorg_wms_list: [],
            public_url: '',
            copy_url_is: false
        }
        this.copyToClipboard = this.copyToClipboard.bind(this)
    }

    componentDidMount() {

        service
            .detail(this.props.match.params.system_id)
            .then(({govorg, public_url}) => {
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
                this.setState({govorg, govorg_wms_list, public_url})
            })
    }

    copyToClipboard(){
        this.setState({copy_url_is: true})
        const { public_url } = this.state
        var textField = document.createElement('textarea')
        textField.innerText = public_url
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        setTimeout(() => {
            this.setState({copy_url_is: false})
        }, 1000);
    }

    render() {

        const {name, token, website} = this.state.govorg
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        return (
            <div className="my-4">
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
                        {website && <p><strong>Вебсайт</strong>: {website} </p>}
                        <div className="input-group">
                            <input type="text" className="form-control col-6" disabled value={this.state.public_url}/>
                            <span className="input-group-btn">
                            {this.state.copy_url_is ?
                            <button className="btn btn-outline-success ml-1" type="button" onClick={this.copyToClipboard}>
                                <i class="fa fa-check" aria-hidden="true"></i> Амжилттай хууллаа
                            </button>:
                            <button className="btn btn-outline-primary ml-1" type="button" onClick={this.copyToClipboard}>
                                <i class="fa fa-clone" aria-hidden="true"></i> Хуулах
                            </button>
                            }
                            </span>
                        </div>
                    </div>

                    {this.state.govorg_wms_list.map((wms) =>
                        <div className="col-md-12 mb-4 ml-5" key={wms.id}>
                            <h4> {wms.name} </h4>
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
