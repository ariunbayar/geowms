import React, { Component } from 'react'

import Loader from "@utils/Loader"
import utils from "@helpUtils/functions"
import {service} from './service'

export class Дэлгэрэнгүй extends Component {

    constructor(props) {
        super(props)

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
        this.loadDetail = this.loadDetail.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
        this.handleModalActionOpen = this.handleModalActionOpen.bind(this)
    }

    componentDidMount() {
        this.loadDetail()
    }

    loadDetail(cbSuccess) {
        this.setState({is_loading: true })
        service
            .detail(this.props.match.params.system_id)
            .then(({govorg, public_url, private_url}) => {
                this.setState({
                    govorg: govorg.detail,
                    govorg_wms_list: govorg.wms_list,
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
                    global.NOTIF('success', 'Токенийг амжилттай шинэчиллээ', 'check')
                })
            } else {
                global.NOTIF('danger', 'Алдаа гарлаа!', 'times')
            }
        })
    }

    copyToClipboard(url) {
        utils.copyToClipboard(url)
    }

    handleModalActionOpen(){
        const modal = {
            modal_status: "open",
            modal_icon: "fa fa-exclamation-triangle",
            modal_bg: '',
            icon_color: 'warning',
            title: 'Токен шинэчлэх',
            text: 'Токенийг шинэчилсэнээр уг URL-ээр одоо ашиглаж байгаа газрууд ажиллахгүй болохыг анхаарна уу!',
            has_button: true,
            actionNameBack: 'Буцах',
            actionNameDelete: 'Шинэчлэх',
            modalAction: () => this.handleTokenRefresh(),
            modalClose: null,
        }
        global.MODAL(modal)
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

                    <div className="col-md-12">
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
                            <div className="col-md-12 mb-3 pt-3">
                                {
                                    is_state
                                    ?
                                        <div className="input-group pt-2">
                                            <input type="text" className="form-control col-9" disabled value={this.state.private_url}/>
                                            <span className="input-group-btn">
                                                <button className="btn btn-outline-primary ml-1" type="button" onClick={() => this.copyToClipboard(this.state.private_url)}>
                                                    <i className="fa fa-clone" aria-hidden="true"></i> Хуулах
                                                </button>
                                            </span>
                                        </div>
                                    :
                                        <div className="input-group pt-2">
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
                                        {wms.layers.map((layer, idx) =>
                                            <li key={idx} id="accordion1">
                                                GeoJSON: {layer.title} ({layer.code})
                                                <div className="input-group mt-2">
                                                    <input type="text" className="form-control col-7" disabled value={`${is_state ? layer.json_private_url : layer.json_public_url}`}/>
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
                    </div>

                </div>
            </div>
        )

    }

}
