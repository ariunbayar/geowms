import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import {service} from './service'
import {Notif} from '../../../../../../src/components/Notification/index'


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)
        this.too = 0;

        this.state = {
            govorg: {},
            govorg_wms_list: [],
            public_url: '',
            private_url: '',
            is_state: false,
            proxy: '/back/api/систем'
        }
        this.copyToClipboard = this.copyToClipboard.bind(this)
        this.addNotif = this.addNotif.bind(this)
    }

    addNotif(style, msg, icon){
        this.too ++
        this.setState({ show: true, style: style, msg: msg, icon: icon })
        const time = setInterval(() => {
            this.too --
            this.setState({ show: true })
            clearInterval(time)
        }, 2000);
    }

    componentDidMount() {
        service
            .detail(this.props.match.params.system_id)
            .then(({govorg, public_url, private_url}) => {
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
                this.setState({govorg, govorg_wms_list, public_url, private_url})
            })
    }

    copyToClipboard(url){
        var textField = document.createElement('textarea')
        textField.innerText = url
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        this.addNotif('success', 'Амжилттай хуулаа', 'times')
    }

    render() {

        const {id, name, token, website} = this.state.govorg
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const {is_state, proxy} = this.state
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
                        <h5>{name}</h5>
                        <p><strong>Token</strong>: {token} </p>
                        {website && <p><strong>Вебсайт</strong>: {website} </p>}
                        <a className={is_state ? "btn btn-primary text-white btn-sm" : "btn btn-dark text-white btn-sm"} onClick={() => this.setState({is_state:true})}>Төрийн сүлжээ</a>
                        <a className={is_state ? "ml-2 btn btn-dark text-white btn-sm" : "ml-2 btn btn-primary text-white btn-sm"} onClick={() => this.setState({is_state:false})}>Интернэт сүлжээ</a>
                        {is_state ?
                        <div className="input-group mt-2">
                            <input type="text" className="form-control col-6" disabled value={this.state.private_url}/>
                            <span className="input-group-btn">
                            <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.state.private_url)}>
                                <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                            </button>
                            </span>
                        </div>:
                        <div className="input-group mt-2">
                            <input type="text" className="form-control col-6" disabled value={this.state.public_url}/>
                            <span className="input-group-btn">
                            <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.state.public_url)}>
                                <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                            </button>
                            </span>
                        </div>
                        }
                    </div>
                    {this.state.govorg_wms_list.map((wms) =>
                        <div className="col-md-12 mb-2 ml-3" key={wms.id}>
                            <h5> {wms.name} </h5>
                            <ul>
                                {wms.layer_list.map((layer, idx) =>
                                    <li key={idx}>
                                        {layer.title} ({layer.code})
                                        <div className="input-group mt-2">
                                            <input type="text" className="form-control col-4" disabled value={`json линк: ${is_state ? layer.json_private_url : layer.json_public_url}`}/>
                                            <span className="input-group-btn">
                                                <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(is_state ? layer.json_private_url : layer.json_public_url)}>
                                                    <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                                                </button>
                                            </span>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
            </div>
        )

    }

}
