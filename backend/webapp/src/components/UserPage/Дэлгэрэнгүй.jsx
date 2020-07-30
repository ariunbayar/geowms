import React, { Component } from "react"
import {service} from './service'
import {NavLink} from 'react-router-dom'
import Modal from "./Modal_l"



export class Дэлгэрэнгүй extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
            roles: [],   
            is_active: false,
            is_modal_limit_open:false   

        }
        this.handleModalLimitClose=this.handleModalLimitClose.bind(this)
        this.handleModalLimitOpen=this.handleModalLimitOpen.bind(this)
        this.handleIsActiveTrue=this.handleIsActiveTrue.bind(this)
        this.handleIsActiveFalse=this.handleIsActiveFalse.bind(this)
        
    }

    componentDidMount() {
        service
        .detail(this.props.match.params.id)
        .then(({user_detail,roles}) => {
            this.setState({user_detail, roles, is_active: user_detail.is_active})
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
    handleIsActiveTrue(){
        service.userDetailChange(this.props.match.params.id, true)
        .then(({success}) => {
            if(success){this.setState({is_active: true})}
        })

    }
    render() {
        const {id, first_name, email,is_sso, is_superuser, last_name, gender, username, last_login, date_joined} = this.state.user_detail
        const is_modal_limit_open=this.state.is_modal_limit_open
        const is_active = this.state.is_active
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
