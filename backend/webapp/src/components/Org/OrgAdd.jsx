import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import {service} from "./service"
import ModalAlert from "../ModalAlert";
import { set } from "ol/transform";


export class OrgAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_name: '',
            edit: false,
            upadte_level: 1,
            org_role: -1,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            roles: []
        }
        this.handleUserSearch = this.handleUserSearch.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleGetAll=this.handleGetAll.bind(this)
        this.modalClose=this.modalClose.bind(this)
        this.modalInspireRoles=this.modalInspireRoles.bind(this)
    }

    componentDidMount(){
        const org_level=this.props.match.params.level
        const id=this.props.match.params.id
        this.setState({upadte_level: org_level})
        this.handleGetAll(org_level,id)
        this.modalInspireRoles()
    }

    handleUserSearch(field, e){
        this.setState({[field]: e.target.value})
    }

    modalInspireRoles(){
        service.getInspireRoles().then(({success, roles}) => {
            if(success) this.setState({roles})
        })
    }

    handleSave(){
        this.setState({handleSaveIsLoad:true})
        const org_level = this.props.match.params.level
        const org_id=this.props.match.params.id
        const org_name = this.state.org_name
        const upadte_level = this.state.upadte_level
        const values={"org_name":org_name,"id": org_id, 'upadte_level':upadte_level, "role_id":  this.state.org_role}
        service.org_add(org_level,values).then(({ success }) => {
            success && this.setState({modal_alert_status: "open"})
        })
        this.modalCloseTime()
    }

    handleGetAll(org_level,id){
        if(id){
            service.orgAll(org_level,id).then(({ orgs }) => {
                if (orgs) {
                    orgs.map(org=>this.setState({
                        org_name:org.name,
                        org_role:org.org_role
                    }))
                }
                this.setState({
                    edit:true
                })
            })
        }
    }

    modalClose(){
        const org_level = this.props.match.params.level
        this.setState({handleSaveIsLoad:false})
        this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
        this.setState({modal_alert_status: "closed"})
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({handleSaveIsLoad:false})
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    render() {
        const {org_name, upadte_level, roles} = this.state
        const org_id=this.props.match.params.id
        const org_level=this.props.match.params.level
        return (
            <div className="main-content">
                <div className="page-container my-4">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="text-left">
                                <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                    <p className="btn gp-outline-primary">
                                        <i className="fa fa-angle-double-left"></i> Буцах
                                    </p>
                                </NavLink>
                            </div>
                            <br/>
                            <h5 className="mb-3">Байгууллагын нэр</h5>
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="org_name"
                                    onChange={(e) => this.handleUserSearch('org_name', e)}
                                    value={org_name}
                                />
                            </div>
                            {org_id &&
                            <div className="form-group">
                                    <h5 className="mb-3">Түвшин</h5>
                                    <select className="form-control" id="upadte_level" value={this.state.upadte_level} onChange={(e) => this.handleUserSearch('upadte_level', e)}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                            }
                            <div className="form-group">
                                <h5 className="mb-3">Байгуулгын эрх</h5>
                                <select className="form-control" id="org_role" value={this.state.org_role} onChange={(e) => this.setState({org_role: e.target.value})}>
                                    <option value={-1}>....</option>
                                    {roles.map((role, idx) =>
                                        <option key={idx} value={role.id}>{role.name}</option>
                                    )}
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
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
                                            model_type_icon = "success"
                                        />
                                    </>
                                :
                                <button className="btn btn-block gp-btn-primary" onClick={this.handleSave} >
                                    Хадгалах
                                </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
