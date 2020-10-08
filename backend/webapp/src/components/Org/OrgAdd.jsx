import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import {service} from "./service"
import ModalAlert from "../ModalAlert";


export class OrgAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_name: '',
            edit: false,
            upadte_level: 1,
            handleSaveIsLoad: false,
            modal_alert_check: false,
        }
        this.handleUserSearch = this.handleUserSearch.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleGetAll=this.handleGetAll.bind(this)
        this.modalClose=this.modalClose.bind(this)
    }

    componentDidMount(){
        const org_level=this.props.match.params.level
        const id=this.props.match.params.id
        this.handleGetAll(org_level,id)
    }

    handleUserSearch(field, e){
        this.setState({[field]: e.target.value})
    }

    handleSave(){
        this.setState({handleSaveIsLoad:true})
        const org_level = this.props.match.params.level
        const org_id=this.props.match.params.id
        const org_name = this.state.org_name
        const upadte_level = this.state.upadte_level
        const values={"org_name":org_name,"id": org_id, 'upadte_level':upadte_level}
        service.org_add(org_level,values).then(({ success }) => {
            success && this.setState({modal_alert_check: true})
        })
    }

    handleGetAll(org_level,id){
        if(id){
            service.orgAll(org_level,id).then(({ orgs }) => {
                if (orgs) {
                    orgs.map(org=>this.setState({
                        org_name:org.name
                    }))
                }
                this.setState({
                    edit:true
                })
            })
        }
    }

    modalClose(closeTime){
        const org_level = this.props.match.params.level
        closeTime && setTimeout(() => {
            this.setState({handleSaveIsLoad:false})
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
            this.setState({modal_alert_check: false})
        }, 0)
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        setTimeout(() => {
            this.setState({handleSaveIsLoad:false})
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
            this.setState({modal_alert_check: false})
        }, 2000)
    }

    render() {
        const {org_name,upadte_level} = this.state
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
                                    <select className="form-control" id="upadte_level" value={this.state.gender} onChange={(e) => this.handleUserSearch('upadte_level', e)}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                    </select>
                                </div>
                            }

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
                                        {this.state.modal_alert_check &&
                                            <ModalAlert
                                                modalClose={this.modalClose}
                                                modalCloseTime={this.modalCloseTime()}
                                                title="Амжилттай хадгаллаа"
                                                model_type_icon = "success"
                                            />
                                        }
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
