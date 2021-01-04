import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'
import {service} from './service'
import {Notif} from '../../../src/components/Notification/index'


export class Detail extends Component {

    constructor(props) {
        super(props)
        this.too = 0;

        this.state = {
            system: {},
            system_wms_list: [],
            public_url: '',
            copy_url_is: false,
            private_url: '',
            is_state: false,
            proxy: '/gov/api/system'
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
            .then(({system, public_url, private_url}) => {
                const system_wms_list =
                    system.wms_list
                        .map((wms) => {
                            return {
                                ...wms,
                                layer_list: wms.layer_list.filter((layer) => {
                                    return system.layers.indexOf(layer.id) > -1
                                })
                            }
                        })
                        .filter((wms) => wms.layer_list.length)
                this.setState({system, system_wms_list, public_url, private_url})
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

        const {id, name, token, website} = this.state.system
        const {is_state, proxy} = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-12 mb-4">
                            <NavLink className="btn gp-outline-primary" exact to={`/gov/system/`}>
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
                            {this.state.system_wms_list.map((wms) =>
                                <div className="col-md-12 mb-2 ml-3" key={wms.id}>
                                    <h5> {wms.name} </h5>
                                    <ul>
                                        {wms.layer_list.map((layer, idx) =>
                                            <li key={idx}>
                                                {layer.title} ({layer.code})
                                                <p className="row ml-1">
                                                    <a className="ml-2" href={`${proxy}/${id}/${layer.code}/json/${is_state ? 'private' : 'public'}/file-download/`}>json</a>
                                                    <a className="ml-2" href={`${proxy}/${id}/${layer.code}/gml/${is_state ? 'private' : 'public'}/file-download/`}>gml</a>
                                                </p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
            </div>
        )

    }

}
