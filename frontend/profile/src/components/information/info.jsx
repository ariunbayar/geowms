import React, { Component } from 'react'
import { service } from './service'

export class Info extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user_list: [],
        }
    }

    componentDidMount() {
        service
            .userInfo()
            .then(({ user_list }) => {
                this.setState({ user_list })
            })
    }

    render() {
        const { last_name, first_name, email,  username } = this.state.user_list
        return (
            <div className="card">
                <div className="card-header d-flex align-items-center">
                    <h5>Хэрэглэгчийн мэдээлэл</h5>
                </div>
                <div className="card-body">
                    <div className="row" >
                        <div className="col-sm-6">
                            <label className="col-form-label font-weight-bold">Хэрэглэгчийн нэр: </label>
                            <span className="input-group-text">{username}</span>
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label font-weight-bold">Цахим хаяг: </label>
                            <span className="input-group-text">{email}</span>
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label font-weight-bold">Овог: </label>
                            <span className="input-group-text">{last_name}</span>
                        </div>
                        <div className="col-sm-6 mt-4">
                            <button className="btn btn-primary" onClick={() => this.props.history.push(`/profile/update-mail/`)}>Цахим хаяг шинэчлэх</button>
                        </div>
                        <div className="col-sm-6">
                            <label className="col-form-label font-weight-bold">Нэр: </label>
                            <span className="input-group-text">{first_name}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
