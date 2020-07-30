import React, { Component } from "react"
import {service} from './service'
import {NavLink} from 'react-router-dom'
import Modal from "./ModalLimit"



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
            is_modal_limit_open:false   

        }
        this.handleModalLimitClose=this.handleModalLimitClose.bind(this)
        this.handleModalLimitOpen=this.handleModalLimitOpen.bind(this)
        this.handleIsActiveTrue=this.handleIsActiveTrue.bind(this)
        this.handleIsActiveFalse=this.handleIsActiveFalse.bind(this)
        this.handleOnClick=this.handleOnClick.bind(this)
        this.getRole=this.getRole.bind(this)
        this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
    }
    
    componentDidMount() {
        this.handleSaveSuccess()
    }

    handleSaveSuccess(){
        service
        .detail(this.props.match.params.id)
        .then(({user_detail,roles,all_role}) => {
            this.setState({user_detail, roles, all_role,is_active: user_detail.is_active, is_superuser:user_detail.is_superuser})
            roles.map(role=>this.setState({roleId:role.id}))
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
            if (success) 
            {
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
            if(success){this.setState({is_active: false, is_modal_limit_open: false})}
        })

    }
    handleIsActiveTrue(){
        service.userDetailChange(this.props.match.params.id, true)
        .then(({success}) => {
            if(success){this.setState({is_active: true})}
        })

    }
    render() {
        const {id, first_name, email,is_sso, last_name, gender, username, last_login, date_joined} = this.state.user_detail
        const {is_modal_limit_open, check, is_active, is_superuser}=this.state

        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <NavLink className="btn btn-outline-primary" exact to={'/back/user/'}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <p><strong>Системийн ID</strong>: {id} </p>
                        <p><strong>Нэр</strong>: {last_name} {first_name} </p>
                        <p><strong>Хүйс</strong>: {gender} </p>
                        <p><strong>Цахим хаяг</strong>: {email} </p>
                        <p><strong>Хэрэглэгчийн нэр</strong>: {username} </p>
                        <p><strong>Админ эсэх</strong>: {is_superuser ? 'Админ' : '-'}  </p>
                        <p><strong>Идэвхитэй эсэх</strong>: {is_active ?  'Идэвхитэй': '-'}
                           &nbsp; {is_active ? 
                                <button  className="btn btn-outline-danger" onClick={this.handleModalLimitOpen} >Хязгаарлах</button> : 
                                <button  className="btn btn-outline-primary"  onClick={this.handleIsActiveTrue}>Идэвхижүүлэх</button>}     
                       </p>
                        <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                        <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                        <div>
                        {is_modal_limit_open &&
                        <Modal
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
                            {check && <button type="button" className="btn btn-outline-primary" onClick={this.getRole}>Хадгалах</button>}
                    </div> 
                </div>
            </div>
        )
    }
}
