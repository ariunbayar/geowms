import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from "../components/helpers/ModalAlert";
import { service } from "./Role/service";
import InsPerms from './Role/GovPerms'

export class RoleEdit extends Component {

    constructor(props) {
        super(props)
        this.roles=[]
        this.state = {
            role_name: '',
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            is_continue: false,
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    handleSave() {
        const { role_name } = this.state
        const id = this.props.match.params.id
        this.setState({ handleSaveIsLoad: true })
        const values = {
            "role_id": id,
            "role_name": role_name,
            "roles": this.roles
        }
        service
            .updateRole(id, values)
            .then(({success}) => {
                if (success) {
                    this.modalCloseTime()
                }
            })
    }

    modalClose() {
        const org_level = this.props.match.params.level
        this.setState({ handleSaveIsLoad: false })
        this.props.history.push(`/gov/perm/role/`)
        this.setState({ modal_alert_status: "closed" })
        clearTimeout(this.state.timer)
    }

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.setState({ modal_alert_status: "closed" })
            this.props.history.push(`/gov/perm/role/`)
        }, 2000)
    }

    getValue(checked, property_name, index, idx, perm_name, property_id, feature_id) {
        const role = {
            'feature_id': feature_id,
            'property_id': property_id,
            'perm_kind': perm_name,
        }
        this.roles.push(role)
    }

    componentDidMount() {
        if(!this.props.location.datas){
            this.props.history.push(`/gov/perm/role/`)
            this.setState({ is_continue: false })
        } else {
            this.setState({ is_continue: true })
        }
    }

    render() {
        const { role_name, is_continue } = this.state
        console.log(this.props.location.datas);
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-left">
                                <NavLink to={`/gov/perm/role`}>
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

                    <div className="form-group">
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
                    <div>
                        {
                            is_continue &&
                            <InsPerms
                                type="editable"
                                getValue={this.getValue}
                                dontDid={true}
                                org_roles={this.props.location.datas}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }

}
