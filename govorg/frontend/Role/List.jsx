import React, { Component } from "react"
import ModalAlert from '../components/helpers/ModalAlert'
import { NavLink } from "react-router-dom"
import Rows from './Rows'
import {service} from './Role/service'

export class List extends Component {
    constructor(props) {
        super(props)
            this.state = {
            roles: [
                { role_id: 1, role_name: 'Role1' },
                { role_id: 2, role_name: 'Role2' }
            ],
            org_roles: [],
            alert: false,
            perms: props.perms,
            modal_alert_status: "closed",
            timer: null,
            is_loading: false,
        }
        this.handleRemove = this.handleRemove.bind(this)
        this.getOrgRole = this.getOrgRole.bind(this)
    }

    modalClose() {
        clearTimeout(this.state.timer)
        this.setState({ modal_alert_status: "closed" })
        this.paginate(1, "")
    }

    componentDidMount(){
        this.getOrgRole()
    }

    getOrgRole() {
        this.setState({ is_loading: false })
        service
            .getPerms()
            .then(({success, themes, package_features, property}) => {
                if(success) {
                    this.org_roles = new Object()
                    this.org_roles['properties'] = property
                    this.org_roles['package_features'] = package_features
                    this.org_roles['themes'] = themes
                    this.setState({ org_roles: this.org_roles, is_loading: true })
                }
            })
    }

    handleRemove(id) {
        service
            .deleteRole(id)
            .then(({ success }) => {
                if (success) {
                    console.log("ustgasan", id)
                }
            })
    }

    render() {
        const { roles, org_roles, is_loading } = this.state
        return (
            <div className="card">
                <div className="card-body">
                            {
                                !is_loading
                                ?
                                    <div className="d-flex justify-content-center">
                                        <div className="spinner-border gp-text-primary" role="status"></div>
                                    </div>
                                :
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="text-right">
                                                <NavLink
                                                    className="btn gp-btn-primary waves-effect waves-light m-1"
                                                    to={{ pathname: `/gov/perm/role/add/`,
                                                        datas: org_roles
                                                    }}>
                                                    Нэмэх
                                                </NavLink>
                                            </div>
                                            <div className="table-responsive">
                                                <table className="table ">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">№</th>
                                                            <th scope="col">title</th>
                                                            <th scope="col">Засах</th>
                                                            <th scope="col">Устгах</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            roles.map((p, idx) =>
                                                                <Rows key={idx}
                                                                    index={idx + 1}
                                                                    values={p}
                                                                    handleRemove={() => this.handleRemove(p.role_id)}
                                                                    org_roles={org_roles}
                                                                />
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <ModalAlert
                                                modalAction={() => this.modalClose()}
                                                status={this.state.modal_alert_status}
                                                title="Амжилттай устгалаа"
                                                model_type_icon="success"
                                            />
                                        </div>
                                    </div>
                            }
                </div>
            </div>
        );
    }
}
