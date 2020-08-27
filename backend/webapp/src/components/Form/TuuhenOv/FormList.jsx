import React, { Component } from "react"
import FormTable from './FormTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'

export class FormList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            tuuh_soyl: [{},{}],
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
        alert(id)
        // service.tsegPersonalRemove(id).then(({success}) => {
        //     if (success) this.handleListUpdated()
        // })
    }


    render() {
        return (
            <div  className="container my-4">
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/back/froms/tuuhen-ov/add/`}>
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
