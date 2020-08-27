import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {service} from '../service'

export class Form extends Component {

    constructor(props) {
        super(props)
        this.state = {
            id: 0,
            tuuhin_ov_register_id: 0,
            tuuhin_ov_date: '',
            tuuhin_ov_aimag: '',
            tuuhin_ov_sum_duureg: '',
            too_shirheg: 0,
            burtgegch: '',
            handle_save_succes: false,

        }
        this.handleSave = this.handleSave.bind(this)
        this.handleInput = this.handleInput.bind(this)
    }
    componentDidMount(){
        const id = this.props.match.params.id
        service.about(id).then(({tuuh_soyl}) => {
            if(tuuh_soyl){
                tuuh_soyl.map((tuuh) => 
                this.setState({tuuhin_ov_register_id: tuuh['dugaar'],tuuhin_ov_date: tuuh['date'],
                 tuuhin_ov_aimag: tuuh['aimagname'],tuuhin_ov_sum_duureg: tuuh['sumname'], too_shirheg: tuuh['too_shirheg'], burtgegch: tuuh['burtgegch'],id :id })
                )
            }
        })

    }
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }

    
    handleSave(){
        const id = this.props.match.params.id
        this.setState({handle_save_succes:false})
        const form_datas = this.state

        if(id){
            service.update(form_datas).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        this.setState({handle_save_succes:false})
                        this.props.history.goBack()
                    }, 1000)
                }
                else{
                    alert("no")
                }
            })
        }
        else{
            service.create(form_datas).then(({success}) => {
                if (success) {
                    alert("yes")
                    setTimeout(() => {
                        this.setState({handle_save_succes:false})
                    }, 1000)
                }
                else{
                    alert("no")
                }
            })
        }
    }
    
    render() {
        return (
            <div >
                <div className="col-md-12 mb-4 my-4">
                    <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                        <i className="fa fa-angle-double-left"></i> Буцах
                    </a>
                </div>
                <div className="row container  my-4">
                    <h4>2015 ОНЫ ТҮҮХ, СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛИЙН МАЯГТ №1</h4>
                </div>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width: "20%"}} scope="row">Дурсгалт газрын бүртгэлийн дугаар</th>
                            <td colSpan="2" scope="rowgroup"  >
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tuuhin_ov_register_id"
                                    onChange={(e) => this.handleInput('tuuhin_ov_register_id', e)}
                                    value={this.state.tuuhin_ov_register_id}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th style={{width: "20%"}} scope="row">Он,сар,өдөр</th>
                            <td>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="tuuhin_ov_date"
                                    onChange={(e) => this.handleInput('tuuhin_ov_date', e)}
                                    value={this.state.tuuhin_ov_date}
                                />
                            </td>
                            <th style={{width: "20%"}}>Бүртгэл хийсэн он сар, өдрийг бичнэ.</th>
                        </tr>
                        <tr>
                            <th scope="row">Аймаг, Нийслэл</th>
                            <td scope="row">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tuuhin_ov_aimag"
                                    onChange={(e) => this.handleInput('tuuhin_ov_aimag', e)}
                                    value={this.state.tuuhin_ov_aimag}
                                />
                            </td>
                            <th rowSpan="2" scope="rowgroup">Тухайн дурсгал оршиж буй аймаг, сумын нэрийг бичнэ.</th>
                        </tr>
                        <tr>
                            <th scope="row">Сум, Дүүрэг</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tuuhin_ov_sum_duureg"
                                    onChange={(e) => this.handleInput('tuuhin_ov_sum_duureg', e)}
                                    value={this.state.tuuhin_ov_sum_duureg}
                                />
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">Тоо ширхэг</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="too_shirheg"
                                    onChange={(e) => this.handleInput('too_shirheg', e)}
                                    value={this.state.too_shirheg}
                                />
                            </td>
                            <th>Тоо ширхэг.</th>
                        </tr>
                        <tr>
                            <th scope="row">Бүртгэгч</th>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="burtgegch"
                                    onChange={(e) => this.handleInput('burtgegch', e)}
                                    value={this.state.burtgegch}
                                />
                            </td>
                            <th>Бүргэлийг оруулсан хүн.</th>
                        </tr>
                    </tbody>
                </table>
                { this.state.handle_save_succes ?
                    <button className="btn gp-bg-primary">
                        <a className="spinner-border text-light" role="status">
                            <span className="sr-only">Loading...</span> 
                        </a>
                        <span> Шалгаж байна. </span>
                    </button>:
                    <button className="btn gp-bg-primary" onClick={this.handleSave} >
                        Хадгалах
                    </button>
                }
            </div>  
        )

    }

}
