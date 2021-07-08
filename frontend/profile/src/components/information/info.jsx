import React, { Component } from 'react'
import { service } from './service'
import './info.css'

export class Info extends Component {
    constructor(props){
        super(props)

    this.state = {
        user_list: [],
        }
    }

  componentDidMount()   {
        service
            .userInfo()
            .then(({user_list}) => {
                this.setState({user_list})
            })
  }

  render() {
    const{last_name, first_name, email,  username, is_sso } = this.state.user_list
    return (
        <div className="card">
            <div className="col-sm-12">
                <div className="card-block">
                    <div className="card_header">
                        <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Хэрэглэгчийн мэдээлэл</h6>
                    </div>
                    <div className="row" >
                        <div className="col-sm-6">
                            <label className="font-weight-bold">Хэрэглэгчийн нэр: </label>
                            <span className="m-b-10 f-w-600">{username}</span>
                        </div>
                        <div className="col-sm-6">
                            <label className="font-weight-bold">Цахим хаяг: </label>
                            <span className="">{email}</span>
                        </div>
                        <div className="col-sm-6">
                            <label className="font-weight-bold">Овог: </label>
                            <span className="">{last_name}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <label className="font-weight-bold">Нэр: </label>
                            <span className="">{first_name}</span>
                        </div>
                        <div className="col-sm-6">
                            <button className="btn btn-primary" onClick={() => this.props.history.push(`/profile/api/information/updateEmail`)}>Цахим хаяг солих</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}
