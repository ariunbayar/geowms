import React, { Component } from "react"
import {service} from './service'
import {NavLink} from 'react-router-dom'
import Modal from "../Modal"



export class Дэлгэрэнгүй extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
            roles: [],   
            active:false,
            is_modal_limit_open:false     
        }
        this.handleModalLimitClose=this.handleModalLimitClose.bind(this)
        this.handleModalLimitOpen=this.handleModalLimitOpen.bind(this)
        this.handleLimit=this.handleLimit.bind(this)
        this.handleActivate=this.handleActivate.bind(this)
        this.handleUpdate=this.handleUpdate.bind(this)

    }

    componentDidMount() {
        this.handleUpdate()
    }
    handleModalLimitOpen(event) {
        event.preventDefault()
        this.setState({is_modal_limit_open: true})
    }
    handleModalLimitClose() {
        this.setState({is_modal_delete_open: false})
    }
    handleLimit(){
        service.userdetailChange(this.props.match.params.id).then(({success, item}) => {
            if(success) this.handleUpdate()
        })
    }
    handleUpdate(){
        service
        .detail(this.props.match.params.id)
        .then(({user_detail,roles}) => {
            this.setState({user_detail, roles})
        })
    }
    handleActivate(){
        alert("idevhjvvleh")
    }
    render() {
        const {id, first_name, email, is_active, is_sso, is_superuser, last_name, gender, username, last_login, date_joined} = this.state.user_detail
        const is_modal_limit_open=this.state.is_modal_limit_open
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
                        <p><strong>Идэвхитэй эсэх</strong>: {is_active ?  'Идэвхитэй' : '-'}
                           &nbsp; {is_active ? 
                                <button  className="btn btn-outline-danger" onClick={this.handleModalLimitOpen} >Хязгаарлах</button> : 
                                <button  className="btn btn-outline-primary" onClick={this.handleActivate} >Идэвхжүүлэх</button>}     
                       </p>
                        <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                        <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                        <div>
                        {is_modal_limit_open &&
                        <Modal
                            modalClose={this.handleModalDeleteClose}
                            modalAction={this.handleLimit}
                            text={"Та хэрэглэгчийн системд нэвтрэх эрхийг хязгаарлах гэж байна. Хязгаарлагдсан хэрэглэгч систем нэвтрэх эрхгүй болохыг анхаарна уу!"}
                            title="Тохиргоог хязгаарлах"
                        />
                           }    
                        </div>
                    </div>
                    <div className="col-md-8 mb-4">
                        <h4>Эрхийн түвшин</h4>
                        <ul>
                        {this.state.roles.map( role =>
                            <li key={role.id}>{role.name}</li>
                        )}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}
