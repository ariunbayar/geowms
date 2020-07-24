import React, { Component } from "react"
import {service} from './service'
import {NavLink} from 'react-router-dom'



export class Дэлгэрэнгүй extends Component {


    constructor(props) {
        super(props)

        this.state = {
            user_detail: [],
        }
    }

    componentDidMount() {
        service
            .detail(this.props.match.params.id)
            .then(({user_detail}) => {
                this.setState({user_detail})
            })
    }

    render() {
        const {id, first_name, email, is_active, is_sso, is_superuser, last_name, gender, username, last_login, date_joined} = this.state.user_detail
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
                    <div className="col-md-12 mb-4">
                        <p><strong>Системийн ID</strong>: {id} </p>
                        <p><strong>Нэр</strong>: {last_name} {first_name} </p>
                        <p><strong>Хүйс</strong>: {gender} </p>
                        <p><strong>Цахим хаяг</strong>: {email} </p>
                        <p><strong>Хэрэглэгчийн нэр</strong>: {username} </p>
                        <p><strong>Админ эсэх</strong>: {is_superuser ? 'Админ' : '-'} </p>
                        <p><strong>Идэвхитэй эсэх</strong>: {is_active ? 'Идэвхитэй' : '-'} </p>
                        <p><strong>Бүртгүүлсэн огноо</strong>: {date_joined} </p>
                        <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_login} </p>
                    </div>
                </div>
            </div>
        )
    }
}
