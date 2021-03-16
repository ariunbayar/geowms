import React, { Component } from 'react'
import {NavLink} from 'react-router-dom'

import {Notif} from '@utils/Notification'
import Loader from "@utils/Loader"

import {service} from './service'
import Modal from "../../Modal"
import BackButton from "@utils/Button/BackButton"


export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)
        this.too = 0;

        this.state = {
            govorg: {
                id: '',
                name: '',
                token: '',
                website: '',
            },
            govorg_wms_list: [],
            public_url: '',
            private_url: '',
            is_state: false,
            is_loading: true,
            modal_status: 'closed',
        }
        this.copyToClipboard = this.copyToClipboard.bind(this)
        this.addNotif = this.addNotif.bind(this)
        this.loadDetail = this.loadDetail.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
        this.handleModalActionOpen = this.handleModalActionOpen.bind(this)
        this.handleModalActionClose = this.handleModalActionClose.bind(this)
        this.setAttribute = this.setAttribute.bind(this)
    }

    setAttribute(e, id, name){

        console.log(e.target.checked, id, name)

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
        this.loadDetail()
    }

    loadDetail(cbSuccess) {
        this.setState({is_loading: true })
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
                this.setState({
                    govorg,
                    govorg_wms_list,
                    public_url,
                    private_url,
                    is_loading: false,
                })
                if (cbSuccess) cbSuccess()
            })
    }

    handleTokenRefresh() {
        const { system_id } = this.props.match.params

        service.tokenRefresh(system_id).then(({ success }) => {
            if (success) {
                this.loadDetail(() => {
                    this.addNotif('success', 'Токенийг амжилттай шинэчиллээ', 'check')
                })
            } else {
                this.addNotif('danger', 'Алдаа гарлаа!', 'times')
            }
        })
    }

    copyToClipboard(url){
        var textField = document.createElement('textarea')
        textField.innerText = url
        document.body.appendChild(textField)
        textField.select()
        document.execCommand('copy')
        textField.remove()
        this.addNotif('success', 'Амжилттай хууллаа', 'times')
    }

    handleModalActionOpen(){
        this.setState({modal_status: 'open'})
    }

    handleModalActionClose(){
        this.setState({modal_status: 'closed'})
    }

    render() {

        const {id, name, token, website} = this.state.govorg
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const {is_state} = this.state

        return (
            <div className="my-4">
                <div className="row">
                    <Loader is_loading={this.state.is_loading}/>
                    <div className="col-md-12">
                        <h5>{name}</h5>

                        <form className="form-inline">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Токен</span>
                                </div>
                                <input type="text" className="form-control" disabled value={token}/>
                                <div className="input-group-append">
                                    <button className="btn btn-outline-primary" type="button" onClick={this.handleModalActionOpen}>
                                        <i className="fa fa-refresh" aria-hidden="true"></i>
                                        {} Шинэчлэх
                                    </button>
                                </div>
                            </div>
                        </form>

                        {website && <p><strong>Вебсайт</strong>: {website} </p>}
                    </div>
                    <div className="col-md-9 pr-0 pl-0">
                        <ul className="nav nav-tabs nav-tabs-dark-gray col-12">
                            <li className="nav-item gp-text-primary">
                                <a onClick={() => this.setState({is_state:false})} className="nav-link active" data-toggle="tab" href="#tabe-4"><i className="icon-home"></i> <span className="hidden-xs">Интернэт сүлжээ</span></a>
                            </li>
                            <li className="nav-item gp-text-primary">
                                <a onClick={() => this.setState({is_state:true})} className="nav-link" data-toggle="tab" href="#tabe-4"><i className="icon-home"></i> <span className="hidden-xs">Төрийн сүлжээ</span></a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-md-9 border-top-0 border border-secondary">
                        <div className="col-md-12 mt-3 mb-3">
                            {is_state ?
                            <div className="input-group mt-2">
                                <input type="text" className="form-control col-9" disabled value={this.state.private_url}/>
                                <span className="input-group-btn">
                                <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.state.private_url)}>
                                    <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                                </button>
                                </span>
                            </div>:
                            <div className="input-group mt-2">
                                <input type="text" className="form-control col-9" disabled value={this.state.public_url}/>
                                <span className="input-group-btn">
                                <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.state.public_url)}>
                                    <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                                </button>
                                </span>
                            </div>
                            }
                        </div>
                        {this.state.govorg_wms_list.map((wms) =>
                            <div className="col-md-12 mt-3 mb-3 ml-3" key={wms.id}>
                                <h5> {wms.name} </h5>
                                <ul>
                                    {wms.layer_list.map((layer, idx) =>
                                        <li key={idx}>
                                            GeoJSON: {layer.title} ({layer.code})
                                            <div className="input-group mt-2">
                                                <input type="text" className="form-control col-7" disabled value={`${is_state ? layer.json_private_url : layer.json_public_url}`}/>
                                                <span className="input-group-btn">
                                                    <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(is_state ? layer.json_private_url : layer.json_public_url)}>
                                                        <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                                                    </button>
                                                </span>
                                            </div>
                                            <ul>
                                                {wms.attributes.featureTypes.map((attribute, idx) => 
                                                attribute.typeName == layer.code &&
                                                    attribute.properties.map((property, index) =>
                                                        <li>
                                                            <div class="icheck-primary">
                                                                <input type="checkbox" id={`active-delete-${layer.code}-${index}`}
                                                                onChange={(e) => this.setAttribute(e, layer.id, property.name)}
                                                                />
                                                                <label for={`active-delete-${layer.code}-${index}`}>&nbsp;{property.name}</label>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <Modal
                    text="Токенийг шинэчилсэнээр уг URL-ээр одоо ашиглаж байгаа газрууд ажиллахгүй болохыг анхаарна уу!"
                    title="Токен шинэчлэх"
                    model_type_icon = "success"
                    status={this.state.modal_status}
                    modalClose={this.handleModalActionClose}
                    modalAction={() => this.handleTokenRefresh()}
                    actionName='Шинэчлэх'
                />
                <Notif show={this.state.show} too={this.too} style={this.state.style} msg={this.state.msg} icon={this.state.icon}/>
            </div>
        )

    }

}
