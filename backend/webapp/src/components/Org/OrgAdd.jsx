import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import {service} from "./service"
import ModalAlert from "../ModalAlert";


export class OrgAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_name: '',
            upadte_level: 1,
            org_role: -1,
            handleSaveIsLoad: false,
            modal_alert_status: "closed",
            timer: null,
            roles: [],
            secondOrder: [],
            secondOrder_value: -1,
            thirthOrder: [],
            thirthOrder_value: -1,
            fourthOrder: [],
            fourthOrder_value: -1,
            geo_id: null,
        }

        this.handleUserSearch = this.handleUserSearch.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleGetAll = this.handleGetAll.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.formOptions = this.formOptions.bind(this)
        this.handle2ndOrder = this.handle2ndOrder.bind(this)
        this.handle3rdOrder = this.handle3rdOrder.bind(this)
        this.handle4thOrder = this.handle4thOrder.bind(this)
    }

    componentDidMount() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.setState({upadte_level: org_level})
        this.handleGetAll(org_level,org_id)
        this.formOptions(org_level, org_id)
    }

    handleGetAll(org_level, org_id){
        if (org_id) {
            service.orgAll(org_level, org_id).then(({ orgs }) => {
                if (orgs) {
                    orgs.map(org => this.setState({
                        org_name: org.name,
                        org_role: org.org_role,
                    }))
                }
            })
        }
    }

    handleUserSearch(org_name, e){
        this.setState({[org_name]: e.target.value})
    }

    formOptions(org_level, org_id) {
        const values = {org_level, org_id}
        service.formOptions(values).then(({success, secondOrder, geo_id, roles}) => {
            if (success) {
                this.setState({secondOrder, geo_id, roles})
                if (geo_id) {
                    var find_text = ''
                    for (var i = 0; i < geo_id.length; i++){
                        find_text += geo_id[i]
                        if (i === 4) {
                            secondOrder.map((value) => {
                                if (value['geo_id'] === find_text) {
                                    this.handle2ndOrder(value['name'])
                                }
                            })
                        }
                        if (i === 6) {
                            this.state.thirthOrder.map((value) => {
                                if (value['geo_id'] === find_text) {
                                    this.handle3rdOrder(value['name'])
                                }
                            })
                        }
                        if (i === 8) {
                            this.state.fourthOrder.map((value) => {
                                if (value['geo_id'] === find_text) {
                                    this.handle4thOrder(value['name'])
                                }
                            })
                        }
                    }
                }
            }
        })
    }

    handle2ndOrder(value) {
        const { secondOrder } = this.state
        if (value !== '-1') {
            secondOrder.map((province) => {
                if (province['name'] === value){
                    this.setState({
                        thirthOrder: province['children'],
                        geo_id: province['geo_id'],
                    })
                }
            })
        } else {
            this.setState({
                thirthOrder: [],
                thirthOrder_value: '-1',
            })
        }
        this.setState({
            secondOrder_value: value,
            thirthOrder_value: '-1',
            fourthOrder: [],
            fourthOrder_value: '-1',
        })
    }

    handle3rdOrder(value) {
        const { thirthOrder } = this.state
        if (value === '-1') {
            this.setState({ fourthOrder: [], fourthOrder_value: '-1'})
            this.handle2ndOrder(this.state.secondOrder_value)
        } else {
            thirthOrder.map((soum) => {
                if (soum['name'] === value){
                    this.setState({
                        fourthOrder: soum['children'],
                        geo_id: soum['geo_id']
                    })
                }
            })
        }
        this.setState({ thirthOrder_value: value, fourthOrder_value: '-1'})
    }

    handle4thOrder(value) {
        if (value !== '-1') {
            this.state.fourthOrder.map((team) => {
                if (team['name'] === value){
                    this.setState({geo_id: team['geo_id']})
                }
            })
        } else {
            this.handle3rdOrder(this.state.thirthOrder_value)
        }
        this.setState({fourthOrder_value: value})
    }

    handleSave(){
        this.setState({handleSaveIsLoad:true})
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const {org_name, upadte_level, geo_id, org_role} = this.state
        const values = {
            org_name: org_name,
            id: org_id,
            upadte_level: upadte_level,
            role_id: org_role,
            geo_id: geo_id,
        }
        service.org_add(org_level, values).then(({ success }) => {
            success && this.setState({modal_alert_status: "open"})
            this.modalCloseTime()
        })
    }

    modalClose(){
        const org_level = this.props.match.params.level
        this.setState({handleSaveIsLoad:false})
        this.setState({modal_alert_status: "closed"})
        this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
        clearTimeout(this.state.timer)
    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        this.state.timer = setTimeout(() => {
            this.setState({handleSaveIsLoad:false})
            this.setState({modal_alert_status: "closed"})
            this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
        }, 2000)
    }

    render() {

        const {org_name, upadte_level, roles} = this.state

        const org_id = this.props.match.params.id
        const org_level = this.props.match.params.level

        return (
            <div className="main-content">
                <div className="page-container my-4">
                    <div className="text-left">
                        <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                            <p className="btn gp-outline-primary">
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </p>
                        </NavLink>
                    </div>
                    <div className="row">
                        <div className="col-md-4 card-body">
                            <div className="form-group">
                                <h5 className="mb-3">Байгууллагын нэр</h5>
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
                                <h5 className="mb-3">Байгууллагын эрх</h5>
                                <select className="form-control" id="org_role" value={this.state.org_role} onChange={(e) => this.setState({org_role: e.target.value})}>
                                    <option value={-1}>....</option>
                                    {roles.map((role, idx) =>
                                        <option key={idx} value={role.id}>{role.name}</option>
                                    )}
                                </select>
                            </div>

                            <h5 className="mb-3">Байгууллагын хамрах хүрээ</h5>

                            <table className="table">
                                <tbody>
                                    <tr>
                                        <th style={{width:"38%"}}>Аймаг/ Хот</th>
                                        <td style={{widtd:"60%"}}>
                                            <select className='form-control' value={this.state.secondOrder_value} onChange={(e) => this.handle2ndOrder(e.target.value)}>
                                                <option value='-1'>--- Аймаг/Хот сонгоно уу ---</option>
                                                {this.state.secondOrder.map((data, idx) =>
                                                    <option key={idx} value={data['name']} >{data['name']}</option>
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Сум/ Дүүрэг</th>
                                        <td>
                                            <select className='form-control' value={this.state.thirthOrder_value} onChange={(e) => this.handle3rdOrder(e.target.value)}>
                                                <option value="-1">--- Сум/Дүүрэг сонгоно уу ---</option>
                                                {this.state.thirthOrder.map((data, idx) =>
                                                    <option key={idx} value={data['name']}>{data['name']}</option>
                                                )}
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Баг/ Хороо</th>
                                        <td>
                                            <select className='form-control' value={this.state.fourthOrder_value} onChange={(e) => this.handle4thOrder(e.target.value)}>
                                                <option value="-1">--- Баг/Хороо сонгоно уу ---</option>
                                                {this.state.fourthOrder.map((data, idx) =>
                                                    <option key={idx} value={data['name']}>{data['name']}</option>
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
