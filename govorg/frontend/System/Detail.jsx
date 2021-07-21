import React, { Component, Fragment } from 'react'

import BackButton from "@utils/Button/BackButton"
import * as utils from "@helpUtils/functions"

import Attributes from './Attributes'

import { service } from './service'

export class Detail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            system: {},
            wms_list: [],
            public_url: '',
            copy_url_is: false,
            private_url: '',
            is_state: false,
        }
    }

    componentDidMount() {
        service
            .detail(this.props.match.params.system_id)
            .then(({system, public_url, private_url}) => {
                this.setState({system, wms_list: system.wms_list, public_url, private_url})
            })
    }

    copyToClipboard(url){
        utils.copyToClipboard(url)
    }

    render() {

        const {id, name, token, website} = this.state.system
        const {is_state} = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <BackButton {...this.props} name={'Буцах'}></BackButton>
                    <div className="row">
                        <div className="col-md-12">
                            <h5>{name}</h5>
                            <p><strong>Token</strong>: {token} </p>
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
                        </div>

                        <div className="col-md-12">
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
                                {this.state.wms_list.map((wms) =>
                                    <div className="col-md-12 mt-3 mb-3 ml-3" key={wms.id}>
                                        {
                                            wms.layer_list.length > 0
                                            &&
                                                <>
                                                    <h5> {wms.name} </h5>
                                                    <ul>
                                                        {wms.layer_list.map((layer, idx) =>
                                                            <Fragment key={idx}>
                                                                <li id="accordion1">
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
                                                                {
                                                                    layer
                                                                    &&
                                                                        <Attributes
                                                                            wms={wms}
                                                                            idx={idx}
                                                                            layer={layer}
                                                                        />
                                                                }
                                                            </Fragment>
                                                        )}
                                                    </ul>
                                                </>
                                        }
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}
