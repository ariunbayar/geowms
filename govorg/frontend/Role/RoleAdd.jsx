import React, { Component } from "react"
import { NavLink } from "react-router-dom"
// import ModalAlert from "../ModalAlert";
import InsPerms from './Role/GovPerms'

export class RoleAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            role_name: '',
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    handleSave() {
        this.setState({ handleSaveIsLoad: true })
        const role_name = this.props.match.role_name
        const values = {
            "role_name": role_name
        }
    }

    modalClose() {
        const org_level = this.props.match.params.level
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(`/gov/role/role/`)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(`/gov/role/role/`)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    render() {
        const { role_name } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-left">
                                <NavLink to={`/gov/role/role`}>
                                    <p className="btn gp-outline-primary">
                                        <i className="fa fa-angle-double-left"></i> Буцах
                                    </p>
                                </NavLink>
                            </div>
                            <br />
                            <div className="form-group">
                                <label htmlFor="id_name" >Role нэр:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="role_name"
                                    onChange={(e) => this.handleUserSearch('role_name', e)}
                                    value={role_name}
                                />
                            </div>

                        </div>
                    </div>
                    <div>
                        {this.state.handleSaveIsLoad ?
                            <>
                                <button className="btn btn-block gp-btn-primary">
                                    <a className="spinner-border text-light" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </a>
                                    <span> Шалгаж байна. </span>
                                </button>
                                <ModalAlert
                                    modalAction={() => this.modalClose()}
                                    status={this.state.modal_alert_status}
                                    title="Амжилттай хадгаллаа"
                                    model_type_icon="success"
                                />
                            </>
                            :
                            <button className="btn btn-block gp-btn-primary" onClick={this.handleSave} >
                                Хадгалах
                            </button>
                        }
                    </div>
                    <br />
                    <div className="col-md-12">
                        <InsPerms
                            type="editable"
                        />
                    </div>

                </div>
            </div>
        )
    }

}
