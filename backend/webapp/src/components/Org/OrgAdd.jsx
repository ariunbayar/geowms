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
            roles: [],
            aimags:[],
            sumuud: [],
            baguud: [],
            disabled: false,
            aimag_id: -1,
            sum_id: -1,
            baga_id: -1,
            geo_id: '',
        }
        this.handleUserSearch = this.handleUserSearch.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleGetAll=this.handleGetAll.bind(this)
        this.modalClose=this.modalClose.bind(this)
        this.modalInspireRoles=this.modalInspireRoles.bind(this)
        this.getAimag=this.getAimag.bind(this)
        this.handleInputAimag=this.handleInputAimag.bind(this)
        this.getSum=this.getSum.bind(this)
        this.handleInputSum=this.handleInputSum.bind(this)
        this.getBag=this.getBag.bind(this)
        this.handleInputBag=this.handleInputBag.bind(this)
        this.geo_id_display=this.geo_id_display.bind(this)
    }

    componentDidMount() {
        const org_level=this.props.match.params.level
        const id=this.props.match.params.id
        this.setState({upadte_level: org_level})
        this.handleGetAll(org_level,id)
        this.modalInspireRoles()
        this.getAimag()
        this.geo_id_display()
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
        const geo_id = this.state.geo_id
        const values={"org_name":org_name,"id": org_id, 'upadte_level':upadte_level, "role_id":  this.state.org_role, "geo_id": geo_id}
        service.org_add(org_level, values).then(({ success }) => {
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
        }, 2222)
    }

    getAimag() {
        this.setState({sumuud:[], baguud:[], sum_id: -1, bag_id: -1, disabled: true})
        service.getAimags().then(({info, success}) => {
            if(success){
                this.setState({aimags: info})
            }setTimeout(() => {
                this.setState({disabled: false})
            }, 100);
        })
    }

    handleInputAimag(aimag) {
        const aimags = this.state.aimags
        aimags.map((data) => {
            if (data['aimag_names'] === aimag){
                this.setState({geo_id: data['geo_id']})
            }
        })
        this.setState({aimag_id: aimag, disabled: true})
        this.getSum(aimag)
    }

    getSum(aimag) {
        if(aimag === '-1'){
            this.setState({sumuud:[], baguud:[], sum_id: -1, bag_id: -1, disabled: false})
        }
        else{
            this.setState({baguud:[], bag_id: -1})
            service.getSumuud(aimag).then(({info, success}) => {
                if(success){
                    this.setState({sumuud: info})
                }setTimeout(() => {
                    this.setState({disabled: false})
                }, 200);
            })
        }
    }

    handleInputSum(sum) {
        const sumuud = this.state.sumuud
        sumuud.map((data) => {
            if (data['sum_names'] === sum){
                this.setState({geo_id: data['geo_id']})
            }
        })
        this.setState({sum_id: sum, disabled: true})
        this.getBag(sum)
    }

    getBag(sum) {
        if(sum === '-1'){
            this.setState({baguud:[], bag_id: -1, disabled: false})
        }
        else{
            service.getBaguud(sum).then(({info, success}) => {
                if(success){
                    this.setState({baguud: info})
                }setTimeout(() => {
                    this.setState({disabled: false})
                }, 100);
            })
        }
    }

    handleInputBag(bag) {
        const baguud = this.state.baguud
        baguud.map((data) => {
            if (data['bag_names'] === bag){
                this.setState({geo_id: data['geo_id']})
            }
        })
        this.setState({bag_id: bag})
    }

    geo_id_display() {
        const values={"org_id": this.props.match.params.id}
        service.geo_id_display(values).then(({info, success}) => {
            if(success){
                if(info){
                    info.map((data, idx) => {
                        if (idx === 0){
                            this.setState({aimag_id: data})
                            this.getAimag()
                        }
                        if (idx === 1){
                            this.setState({sum_id: data})
                            this.getSum(this.state.aimag_id)
                        }
                        if (idx === 2){
                            this.setState({bag_id: data})
                            this.getBag(this.state.bag_id)
                        }
                    })
                }
            }setTimeout(() => {
                this.setState({disabled: false})
            }, 100);
        })
    }

    render() {
        const {org_name, upadte_level, roles} = this.state
        const org_id=this.props.match.params.id
        const org_level=this.props.match.params.level
        return (
            <div className="main-content">
                <div className="page-container my-4">
                    <div className="row justify-content-between">
                        <div className="col-md-3 ml-3">
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
                        <div className="col-md-6 mr-4">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <th style={{width:"38%"}}>Аймаг,Нийслэл</th>
                                        <td style={{widtd:"60%"}}>
                                            <select disabled={this.state.disabled} name="aimag_id" id="aimag_id" className='form-control' value={this.state.aimag_id} onChange={(e) => this.handleInputAimag(e.target.value )}>
                                                <option value='-1'>--- Аймаг/Нийслэл сонгоно уу ---</option>
                                                {this.state.aimags.map((data, idx) =>
                                                    <option key={idx} value={data['aimag_names']} >{data['aimag_names']}</option>
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Сум, Дүүрэг</th>
                                        <td>
                                            <select disabled={this.state.disabled} name="sum_id" id="sum_id" className='form-control' value={this.state.sum_id} onChange={(e) => this.handleInputSum(e.target.value)}>
                                                <option value="-1">--- Сум/Дүүрэг сонгоно уу ---</option>
                                                {this.state.sumuud.map((data, idx) =>
                                                    <option key={idx} value={data['sum_names']}>{data['sum_names']}</option>
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Баг, Хороо</th>
                                        <td>
                                            <select disabled={this.state.disabled} name="bag_id" id="bag_id" className='form-control' value={this.state.bag_id} onChange={(e) => this.handleInputBag(e.target.value)}>
                                                <option value="-1">--- Баг/Хороо сонгоно уу ---</option>
                                                {this.state.baguud.map((data, idx) =>
                                                    <option key={idx} value={data['bag_names']}>{data['bag_names']}</option>
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2 ml-3">
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
