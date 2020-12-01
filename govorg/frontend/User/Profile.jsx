import React, { Component } from "react";
import {service} from '../service'

export class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user_detail: [],
            is_superuser:false
          }
            this.handleSaveSuccess=this.handleSaveSuccess.bind(this)
    }

    componentDidMount() {
        this.handleSaveSuccess()
    }

    handleSaveSuccess(){
        service
        .detail()
        .then(({user_detail}) => {
            this.setState({user_detail})
            console.log(user_detail)
        })
    }

    render() {
        const {last_name, first_name, email, gender, username, register} = this.state.user_detail
        return (
            <div className="card">
                <div className="card-body">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <p><strong>Хэрэглэгчийн нэр</strong>: {username} </p>
                                <p><strong>Овог</strong>: {last_name} </p>
                                <p><strong>Нэр</strong>: {first_name} </p>
                                <p><strong>Цахим хаяг</strong>: {email} </p>
                                <p><strong>Хүйс</strong>: {gender} </p>
                                <p><strong>Регистр</strong>: {register} </p>
                                <button onClick={() => this.props.history.push(`/gov/profile/password/`)} className="btn gp-btn-primary">Нууц үг солих</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}
    }