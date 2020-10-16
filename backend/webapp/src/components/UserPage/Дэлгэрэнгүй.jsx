import React, { Component } from "react"
import {service} from './service'
import {NavLink} from 'react-router-dom'
import ModalLimit from "./ModalLimit"
import ModalAlert from "../ModalAlert"



export class Дэлгэрэнгүй extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
            roles: [],
            all_role:[],
            role_id:'',
            roleId: null,
            check:false,
            is_superuser:false,
            is_active: false,
            is_modal_limit_open:false,
            role_name:'',
            modal_alert_check: "closed",
            title_name: ""
        }

        this.handleModalLimitClose=this.handleModalLimitClose.bind(this)
        this.handleModalLimitOpen=this.handleModalLimitOpen.bind(this)
        this.handleIsActiveTrue=this.handleIsActiveTrue.bind(this)
        this.handleIsActiveFalse=this.handleIsActiveFalse.bind(this)
        this.handleOnClick=this.handleOnClick.bind(this)
        this.getRole=this.getRole.bind(this)
        this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
        this.closeModalTime=this.closeModalTime.bind(this)
    }

    componentDidMount() {
        this.handleSaveSuccess()
    }

    handleSaveSuccess(){
        service
        .detail(this.props.match.params.id)
        .then(({user_detail,roles,all_role}) => {
            this.setState({user_detail, roles, all_role,is_active: user_detail.is_active, is_superuser:user_detail.is_superuser})
            roles.map(role=>this.setState({roleId:role.id, role_name:role.name}))
        })
    }
    handleModalLimitOpen() {
       this.setState({is_modal_limit_open: !this.state.is_modal_limit_open})
    }
    handleModalLimitClose() {
        this.setState({is_modal_delete_open: false})

    }

    handleIsActiveFalse(){

        service.userDetailChange(this.props.match.params.id, false)
        .then(({success}) => {
            if(success){this.setState({is_active: false, is_modal_limit_open: false})}
        })

    }
    getRole(){
        const id =this.props.match.params.id
        const roleId =this.state.role_id
        const value={'roleId':roleId, 'id':id}
        service.roleCreate(value).then(({success, item}) => {
            if (success) {
                this.handleSaveSuccess()
                this.setState({check:false})

            }
        })
    }


    handleOnClick(id){
       this.setState({
           role_id:id,
           check:true,
           roleId: id
       })
    }

    handleIsActiveFalse(){

        service.userDetailChange(this.props.match.params.id, false)
        .then(({success}) => {
            if(success){
                this.setState({is_active: false, is_modal_limit_open: false})
                this.setState({modal_alert_check: 'open'})
                this.setState({title_name: "хязгаарлалаа"})
        }
        })
        this.closeModalTime()
    }

    handleIsActiveTrue(){
        service.userDetailChange(this.props.match.params.id, true)
        .then(({success}) => {
            if(success){
                this.setState({is_active: true})
                this.setState({modal_alert_check: 'open'})
                this.setState({title_name: "идэвхжилээ"})
            }
        })
        this.closeModalTime()

    }

    handleModalAlert(){
        this.setState({modal_alert_check: 'closed'})
        clearTimeout(this.state.timer)
    }

    closeModalTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_check: 'closed'})
        }, 2000)
    }

    render() {
        const {id, first_name, email,is_sso, last_name, gender, username, last_login, date_joined} = this.state.user_detail
        const {is_modal_limit_open, check, is_active, role_name}=this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <button href="#" className="btn btn-outline-primary btn-block waves-effect waves-light m-1" onClick={this.props.history.goBack}>
                                Буцах
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <p><strong>Системийн ID</strong>: {id} </p>
                            <p><strong>Нэр</strong>: {last_name} {first_name} </p>
                            <p><strong>Хүйс</strong>: {gender} </p>
                            <p><strong>Цахим хаяг</strong>: {email} </p>
                            <p><strong>Хэрэглэгчийн нэр</strong>: {is_sso ? <a>{first_name}</a> : <a> {username}</a>} </p>
                            <p><strong>Хэрэглэгчийн эрх</strong>:{role_name} </p>
                            <p><strong>Идэвхитэй эсэх</strong>: {is_active ?  'Идэвхтэй': '-'}
                            &nbsp; {is_active ?
                                    <button  className="btn btn-outline-danger" onClick={this.handleModalLimitOpen} >Хязгаарлах</button>
                                    :
                                    <button  className="btn gp-outline-primary"  onClick={this.handleIsActiveTrue}>Идэвхжүүлэх</button>}
                        </p>
                            <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                            <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                            <div>
                            {is_modal_limit_open &&
                            <ModalLimit
                                modalClose={this.handleModalLimitClose}
                                modalAction={this.handleIsActiveFalse}
                                text={"Та хэрэглэгчийн системд нэвтрэх эрхийг хязгаарлах гэж байна. Хязгаарлагдсан хэрэглэгч систем нэвтрэх эрхгүй болохыг анхаарна уу!"}
                                title="Тохиргоог хязгаарлах"
                            />
                            }
                            </div>
                        </div>
                        <div className="col-md-8 mb-4">
                            <h4>Хэрэглэгчийн эрхийн түвшинүүд </h4>
                            <table>
                                <tbody>
                                        {this.state.all_role.map(role =>
                                        <tr key={role.id}>
                                            <td>
                                                    <input
                                                        type="radio"
                                                        checked={role.id === this.state.roleId}
                                                        name="input"
                                                        onChange={() => this.handleOnClick(role.id)}/>
                                                    &nbsp; {role.name}
                                            </td>
                                        </tr>)
                                        }
                                </tbody>
                            </table>

                            <br/>
                                {check && <button type="button" className="btn gp-outline-primary" onClick={this.getRole}>Хадгалах</button>}
                        </div>
                        <ModalAlert
                            title = {["Амжилттай ", this.state.title_name]}
                            model_type_icon = "success"
                            status={this.state.modal_alert_check}
                            modalAction={() => this.handleModalAlert()}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
