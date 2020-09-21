import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import Maps from './map/Map'
import {service} from './service'

export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            aimag_name:'',
            sum_name:'',
            bag_horoo:'',
            zip_code:'',
            handle_save: false,
            aimag:[],
            sum:[],
            baga:[],
            aimag_id: 0,
            sum_id: 0,
            baga_id: 0,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputAimag = this.handleInputAimag.bind(this)
        this.handleInputSum = this.handleInputSum.bind(this)
        this.handleInputBaga = this.handleInputBaga.bind(this)

    }

    handleInputAimag(e){
        if(e.target.value){
            this.setState({aimag_id: e.target.value})
            this.setState({sum_id: 0, baga_id: 0})
            const aimag_id = e.target.value
            const aiamg_data = this.state.aimag[aimag_id]
            var zip_code = aiamg_data[0]
            this.setState({zip_code})
            service.getSum(zip_code).then(({info, success}) => {
                if(success){
                    this.setState({sum: info})
                }
                else{
                    this.setState({error_msg: info})
                }setTimeout(() => {
                    this.setState({error_msg: ''})
                }, 2222);
            })
        }
    }
    handleInputSum(e){
        if(e.target.value){
            this.setState({sum_id: e.target.value})
            this.setState({baga_id: 0})
            const sum_id = e.target.value
            const sum_data = this.state.sum[sum_id]
            var zip_code = sum_data[0]
            this.setState({zip_code})
            service.getBaga(zip_code).then(({info, success}) => {
                if(success){
                    this.setState({baga: info})
                }
                else{
                    this.setState({error_msg: info})
                }setTimeout(() => {
                    this.setState({error_msg: ''})
                }, 2222);
            })
        }
    }
    handleInputBaga(e){
        if(e.target.value){
            this.setState({baga_id: e.target.value})
            const baga_id = e.target.value
            const baga_data = this.state.baga[baga_id]
            var zip_code = baga_data[0]
            this.setState({zip_code})
        }
    }
    handleSubmit(){
        console.log(this.state)
    }
    componentDidMount(){
        service.getAimags().then(({info, success}) => {
            if(success){
                this.setState({aimag: info, code:info[0][0]})
            }
            else{
                this.setState({error_msg: info})
            }setTimeout(() => {
                this.setState({error_msg: ''})
            }, 2222);
        })
    }

    render() {
        console.log(this.state.sum_id)
        return (
            <div className="my-4 mt-4">
                <h3 className="text-center">Зипкод</h3>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width:"30%"}}>Аймаг, Нийслэл</th>
                            <td style={{widtd:"60%"}}>
                                <select name="aimag_name" id="aimag_name" className='form-control' value={this.state.aimag_id} onChange={this.handleInputAimag}>
                                    <option value='0'>--- Аймаг/Нийслэл сонгоно уу ---</option>
                                    {this.state.aimag.map((data, idx) =>
                                        <option key={idx} value={idx + 1}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Сум/дүүрэг</th>
                            <td>
                                <select name="sum_name" id="sum_name" className='form-control' value={this.state.sum_id} onChange={this.handleInputSum}>
                                    <option value="0">--- Сум/дүүрэг сонгоно уу ---</option>
                                    {this.state.sum.map((data, idx) =>
                                        <option key={idx} value={idx + 1}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Баг/хороо</th>
                            <td>
                                <select name="bag_horoo" id="bag_horoo" className='form-control' value={this.state.baga_id} onChange={this.handleInputBaga}>
                                    <option value="0">--- Баг/Хороо сонгоно уу ---</option>
                                    {this.state.baga.map((data, idx) =>
                                        <option key={idx} value={idx + 1}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Зипкод оруулах/засварлах</th>
                            <td>
                                <input
                                name="zip_code"
                                type="text"
                                id="zip_code"
                                className='form-control'
                                type="text"
                                value={this.state.zip_code}
                                onChange={(e)=> this.setState({zip_code:e.target.value})}></input>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" >
                                <Maps
                                    aimag_id = {this.state.aimag_id}
                                    sum_id = {this.state.sum_id}
                                    bag_id = {this.state.baga_id}
                                >
                                </Maps>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {this.state.handle_save ?
                    <button className="btn gp-btn-primary">
                        <div className="spinner-border text-light" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                        <a className="text-light"> Шалгаж байна.</a>
                    </button>:
                    <button className="btn gp-btn-primary" onClick={this.handleSubmit} >
                        Хадгалах
                    </button>
                }
            </div>
        )

    }

}