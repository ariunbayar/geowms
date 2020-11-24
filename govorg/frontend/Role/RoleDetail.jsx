import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import { service } from "./Role/service"
// import ModalAlert from "../ModalAlert";
import InsPerms from './Role/GovPerms'


export class RoleDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            role_name: '',
            role_description: '',
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            is_continue: true,
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.getRoleDetail = this.getRoleDetail.bind(this)
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
        this.props.history.push(`/gov/perm/role/`)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.props.history.push(`/gov/perm/role/`)
            this.setState({ modal_alert_status: "closed" })
        }, 2000)
    }

    componentDidMount() {
        this.getRoleDetail()
    }

    getRoleDetail() {
        this.setState({ is_continue: false })
        service
            .detailRole(this.props.match.params.id)
            .then(rsp => {
                if (rsp.success) {
                    this.setState({ is_continue: true })
                }
            })
    }

    render() {
        const { role_name, is_continue, role_description } = this.state
        const { org_roles } = this.props
        return (
            <div className="card">
                <div className="card-body">
                    <div className="text-left">
                            <NavLink to={`/gov/perm/role`}>
                                <p className="btn gp-outline-primary">
                                    <i className="fa fa-angle-double-left"></i> Буцах
                                </p>
                            </NavLink>
                        </div>
                    <div className="row">

                        <div className="form-group col-md-12">
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="role_id" >Role нэр:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="role_id"
                                        disabled="disabled"
                                        onChange={(e) => this.setState({ role_name: e.target.value })}
                                        value={role_name}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="role_description" >Role тайлбар:</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        disabled="disabled"
                                        id="role_description"
                                        onChange={(e) => this.setState({ role_description: e.target.value })}
                                        value={role_description}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div>
                        {
                            is_continue &&
                            <InsPerms
                                dontDid={true}
                                org_roles={org_roles}
                            />
                        }
                    </div>

                </div>
            </div>
        )
    }
}
