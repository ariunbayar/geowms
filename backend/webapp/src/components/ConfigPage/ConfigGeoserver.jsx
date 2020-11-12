import React, { Component, Fragment } from "react"

import {service} from './service'
import {ConfigForm} from './ConfigForm'
import Config from './Config'
import ModalAlert from "../ModalAlert"


export default class ConfigGeoserver extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_loading: false,
            is_editing: false,
            config_list: [],
            modal_alert_check: "closed",
            timer: null,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.getAll().then(({config_list}) => {
            this.setState({config_list})
        })
    }

    handleEdit(e) {
        e.preventDefault()
        this.setState({
            is_editing: true,
        })
    }

    handleSave(e) {
        e.preventDefault()
        this.setState({
            is_loading: true,
        })
        setTimeout(() => {
            this.setState({
                is_loading: false,
                is_editing: false,
            })
        }, 700)

    }

    render() {

        const {
            is_loading,
            is_editing,
        } = this.state

        return (
            <div className="card">

                <div className="card-header">
                    GeoServer API тохиргоо
                    <div className="card-action">
                        <a href="#" onClick={ this.handleEdit }>
                            <i className="fa fa-edit"></i>
                        </a>
                    </div>
                </div>

                <div className="card-body">
                    <fieldset disabled={ !is_editing }>
                        <div className="form-group">
                            <label htmlFor="inputEmail4">IP Address / Domain name</label>
                            <input type="text" className="form-control" id="inputEmail4"/>
                        </div>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Username</label>
                                <input type="text" className="form-control" id="inputPassword4"/>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="inputPassword4">Password</label>
                                <input type="password" className="form-control" id="inputPassword4"/>
                            </div>
                        </div>
                        { is_editing &&
                            <button
                                className="btn gp-btn-primary"
                                disabled={ is_loading }
                                onClick={ this.handleSave }
                            >
                                {is_loading &&
                                    <Fragment>
                                        <i className="fa fa-circle-o-notch fa-spin"></i> {}
                                        Түр хүлээнэ үү...
                                    </Fragment>
                                }
                                {!is_loading && 'Хадгалах' }
                            </button>
                        }
                    </fieldset>
                </div>

            </div>
        )
    }
}
