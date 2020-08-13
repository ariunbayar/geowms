import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"


export class TuuhenOv extends Component {

    constructor(props) {
        super(props)
        this.state = {
            register_id: props.values.register_id,
            date: props.values.date,
            aimag: props.values.aimag,
            sum_duureg: props.values.sum_duureg
        }
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(field, e) {
        if(e.target.value.length < 255)
        {
            this.setState({ [field]: e.target.value })
        }
    }

    render() {
        const {register_id, date, aimag, sum_duureg} = this.state
        return (
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th style={{width: "20%"}} scope="row">Дурсгалт газрын бүртгэлийн дугаар</th>
                        <td colSpan="2" scope="rowgroup"  >
                            <div className="form-group col-md-12">
                                <input
                                    type="number"
                                    className="form-control"
                                    id="register_id"
                                    placeholder="Дурсгалт газрын бүртгэлийн дугаар"
                                    onChange={(e) => this.handleChange('register_id', e)}
                                    value={register_id}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th style={{width: "20%"}} scope="row">Он,сар,өдөр</th>
                        <td contenteditable="true">
                            <input
                                type="text"
                                className="form-control"
                                id="date"
                                placeholder="Дурсгалт газрын бүртгэлийн дугаар"
                                onChange={(e) => this.handleChange('date', e)}
                                value={date}
                            />
                        </td>
                        <td style={{width: "20%"}}>Бүртгэл хийсэн он сар, өдрийг бичнэ.</td>
                    </tr>
                    <tr>
                        <th scope="row">Аймаг, Нийслэл</th>
                        <td scope="row">
                            <input
                                type="text"
                                className="form-control"
                                id="aimag"
                                placeholder="Аймаг, Нийслэл"
                                onChange={(e) => this.handleChange('aimag', e)}
                                value={aimag}
                            />
                        </td>
                        <td rowSpan="2" scope="rowgroup">Тухайн дурсгал оршиж буй аймаг, сумын нэрийг бичнэ.</td>
                    </tr>
                    <tr>
                        <th scope="row">Сум, Дүүрэг</th>
                        <td> 
                            <input
                                type="text"
                                className="form-control"
                                id="sum_duureg"
                                placeholder="Сум, Дүүрэг"
                                onChange={(e) => this.handleChange('sum_duureg', e)}
                                value={sum_duureg}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        )

    }

}
