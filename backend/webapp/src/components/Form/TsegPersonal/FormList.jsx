import React, { Component } from "react"
import FormTable from './FormTable'
import {NavLink} from "react-router-dom"
import {service} from '../service'

export class FormList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            tseg_personal: [{},{}],
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        service.tsegPersonalAll().then(({tseg_personal}) => {
            this.setState({tseg_personal})
        })

    }

    handleRemove(id) {
        service.tsegPersonalRemove(id).then(({success}) => {
            if (success) this.handleListUpdated()
        })
    }


    render() {
        return (
            <div  className="container my-4">
                <div className="row">

                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/back/froms/tseg-personal/add/`}>
                                Нэмэх
                            </NavLink>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col">Цэгийн нэр</th>
                                    <th scope="col">Төвийн дугаар</th>
                                    <th scope="col">Трапецийн дугаар</th>
                                    <th scope="col">Сүлжээний төрөл</th>
                                    <th scope="col">Аймаг</th>
                                    <th scope="col">Сум</th>
                                    <th scope="col">Latitude Longitude-X</th>
                                    <th scope="col">Latitude Longitude-Y</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tseg_personal.map((values, idx) =>
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
