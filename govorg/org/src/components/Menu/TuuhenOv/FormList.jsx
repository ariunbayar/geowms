import React, { Component } from "react"
import FormTable from './FormTable'
import {NavLink} from "react-router-dom"
import {service} from './service'

export class FormList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            tuuh_soyl: [],
            msg: [],
            alert: false,
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.all().then(({tuuh_soyl}) => {
            this.setState({tuuh_soyl})
        })

    }

    handleRemove(id) {
        service.remove(id).then(({success, msg}) => {
            if (success){
                this.setState({ msg, alert: success })
                setTimeout(() => {
                    this.setState({ alert: false, msg: [] })
                }, 3000);
                this.handleListUpdated()
            }else{
                this.setState({ msg, alert: false })
                setTimeout(() => {
                    this.setState({ alert: false, msg: [] })
                }, 3000);
            }
        })
    }


    render() {
        const {alert, msg} = this.state
        const error_bn = Object.keys(msg).length > 0
        return (
            <div  className="container my-4">
                <div className="row">
                    <div className={`text-left position-absolute` +
                        (error_bn ? ' d-show': ' d-none') + (alert && error_bn? ' alert alert-success': ' alert alert-danger')} role="alert">
                        <div className={alert && error_bn?"text-success":"text-danger"}>{msg}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/gov/tuuhen-ov/add/`}>
                                Нэмэх
                            </NavLink>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col">Бүртгэлийн дугаар</th>
                                    <th scope="col">Аймаг, Нийслэл</th>
                                    <th scope="col">Сум, Дүүрэг</th>
                                    <th scope="col">Тоо ширхэг</th>
                                    <th scope="col">Бүртгэгч</th>
                                    <th scope="col">Он,сар,өдөр</th>
                                    <th scope="col">Нэмэх</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tuuh_soyl.map((values, idx) =>
                                    <FormTable
                                        key={idx}
                                        idx = {idx}
                                        values={values}
                                        handleRemove={() => this.handleRemove(values.id)}
                                        handleMove={this.handleMove}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
