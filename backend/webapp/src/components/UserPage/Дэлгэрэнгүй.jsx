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
        const {id, first_name, email, is_active, is_sso, is_superuser, last_name} = this.state.user_detail
        console.log(this.state.user_detail)
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
                        <p><strong>Системийн ID</strong>: {first_name} </p>
                        <p><strong>Нэр</strong>: {last_name} </p>
                        <p><strong>Хүйс</strong>: {last_name} </p>
                        <p><strong>Цахим хаяг</strong>: {last_name} </p>
                        <p><strong>Хэрэглэгчийн нэр</strong>: {last_name} </p>
                        <p><strong>Админ эсэх</strong>: {last_name} </p>
                        <p><strong>Идэвхитэй эсэх</strong>: {last_name} </p>
                        <p><strong>Бүртгүүлсэн огноо</strong>: {last_name} </p>
                        <p><strong>Сүүлд нэвтэрсэн огноо</strong>: {last_name} </p>
                        <p><strong>Эрхийн түвшин</strong>: {last_name} </p>
                    </div>
                </div>
            </div>
        )
    }
}
