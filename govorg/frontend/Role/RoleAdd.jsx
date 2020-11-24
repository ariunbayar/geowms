import React, { Component } from "react"
import { NavLink } from "react-router-dom"
import ModalAlert from '../components/helpers/ModalAlert';
import InsPerms from './Role/GovPerms'
import { service } from './Role/service'

export class RoleAdd extends Component {

    constructor(props) {
        super(props)

        this.perms=[]
        this.state = {
            role_name: '',
            role_description: '',
            edit: false,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            is_continue: false,
            gov_perm_id: this.props.org_roles.gov_perm_id
        }
        this.handleSave = this.handleSave.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    handleSave() {
        const { role_name, role_description, gov_perm_id } = this.state
        this.setState({ handleSaveIsLoad: true })
        service
            .createRole(gov_perm_id, role_name, role_description, this.perms)
            .then(({success}) => {
                if(success) {
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
        setTimeout(() => {
            this.setState({ handleSaveIsLoad: false })
            this.setState({ modal_alert_status: "closed" })
            this.props.history.push(`/gov/perm/role/`)
        }, 2000)
    }

    handleUserSearch(field, e) {
        this.setState({ [field]: e.target.value })
    }

    getValue(checked, perm_kind, property_id, feature_id, perm_inspire_id) {
        if(!checked && this.perms.length > 0) {
            this.perms.map((perm, idx) => {
                if(perm.feature_id == feature_id &&
                    perm.property_id == property_id &&
                    perm.perm_kind == perm_kind)
                {
                    this.perms.splice(idx, 1)
                }
            })
        }
        if(checked) {
            const role = {
                'feature_id': feature_id,
                'property_id': property_id,
                'perm_kind': perm_kind,
                'gov_perm_ins_id': perm_inspire_id,
            }
            this.perms.push(role)
        }
    }

    render() {
        const { role_name, is_continue, role_description, gov_perm_id } = this.state
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
                                        onChange={(e) => this.setState({ role_name: e.target.value })}
                                        value={role_name}
                                    />
                                </div>

                                <div className="form-group col-md-6">
                                    <label htmlFor="role_description" >Role тайлбар:</label>
                                    <textarea
                                        type="text"
                                        className="form-control"
                                        id="role_description"
                                        onChange={(e) => this.setState({ role_description: e.target.value })}
                                        value={role_description}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />

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
                        <InsPerms
                            action_type="addable"
                            getValue={this.getValue}
                            dontDid={true}
                            org_roles={org_roles}
                        />
                    </div>
                </div>
            </div>
        )
    }

}
