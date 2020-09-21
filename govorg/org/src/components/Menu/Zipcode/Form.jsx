import { set } from "ol/transform"
import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import Maps from './map/Map'
import {service} from './service'

export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            zip_code:'',
            zip_code_before:'',
            latx: '',
            laty: '',
            handle_save: false,
            aimag:[],
            sum:[],
            baga:[],
            zip:[],
            aimag_id: -1,
            sum_id: -1,
            baga_id: -1,
            zip_id: -1,
            wms_list: [],
            success_msg: false,
            danger_msg: false,
            disabled: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getAimag = this.getAimag.bind(this)
        this.handleInputAimag = this.handleInputAimag.bind(this)
        this.handleInputSum = this.handleInputSum.bind(this)
        this.handleInputBaga = this.handleInputBaga.bind(this)
        this.handleInputZip = this.handleInputZip.bind(this)
    }

    componentDidUpdate(pP, pS){
        if(pS.disabled !== this.state.disabled)
        {
            setTimeout(() => {
                this.setState({disabled: false})
            }, 2000);
        }
    }
    handleInputAimag(e){
        if(e.target.value){
            this.setState({disabled: true})
            this.setState({aimag_id: e.target.value, sum:[], baga:[], zip:[], sum_id: -1, baga_id: -1, zip_id:-1})
            const aimag_id = e.target.value
            const aiamg_data = this.state.aimag[aimag_id]
            var zip_code = aiamg_data[0]
            var latx = aiamg_data[2]
            var laty = aiamg_data[3]
            this.setState({latx, laty, zip_code, zip_code_before:zip_code})
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
        this.setState({disabled: true})
        if(e.target.value){
            this.setState({sum_id: e.target.value, baga:[], zip:[], baga_id: -1, zip_id:-1})
            const sum_id = e.target.value
            const sum_data = this.state.sum[sum_id]
            var zip_code = sum_data[0]
            var latx = sum_data[2]
            var laty = sum_data[3]
            this.setState({latx, laty})
            this.setState({zip_code, zip_code_before:zip_code})
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
        this.setState({disabled: true})
        if(e.target.value){
            this.setState({baga_id: e.target.value, zip_id:-1, zip:[]})
            const baga_id = e.target.value
            const baga_data = this.state.baga[baga_id]
            var zip_code = baga_data[0]
            var latx = baga_data[2]
            var laty = baga_data[3]
            this.setState({latx, laty, zip_code, zip_code_before:zip_code})
            service.getZip(zip_code).then(({info, success}) => {
                if(success){
                    this.setState({zip: info})
                }
                else{
                    this.setState({error_msg: info})
                }setTimeout(() => {
                    this.setState({error_msg: ''})
                }, 2222);
            })
        }
    }

    handleInputZip(e){
        this.setState({disabled: true})
        if(e.target.value){
            this.setState({zip_id: e.target.value})
            const zip_id = e.target.value
            const zip_data = this.state.zip[zip_id]
            var zip_code = zip_data[0]
            var latx = zip_data[2]
            var laty = zip_data[3]
            this.setState({latx, laty, zip_code, zip_code_before:zip_code})
        }
    }

    handleSubmit(){
        this.setState({handle_save: true})
        const {aimag_id, sum_id, baga_id, zip_id, zip_code, zip_code_before} = this.state
        service.zipUpdate(aimag_id, sum_id, baga_id, zip_id,  zip_code, zip_code_before).then(({success}) => {
            if(success){
                setTimeout(() => {
                   this.setState({success_msg:true ,handle_save:false, latx:'', laty:'', latx:'', sum:[], baga:[], aimag_id: -1, sum_id: -1, baga_id: -1,zip_id: -1, zip_code:''})
                }, 1000);
                setTimeout(() => {
                    this.setState({success_msg:false})
                }, 2500);
            }else{
                setTimeout(() => {
                    this.setState({handle_save:false, danger_msg:true})
                }, 1000);
                setTimeout(() => {
                    this.setState({danger_msg:false})
                }, 2500);
            }
        })
    }
    componentDidMount(){
        service.getWmsLayer().then(({wms_list, success}) => {
            if(success){
                    this.setState({wms_list})
            }
        })
        this.getAimag()
    }
    getAimag(){
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
        const {latx, laty} = this.state
        return (
            <div className="my-4 mt-4">
                <h3 className="text-center">Зипкод</h3>
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th style={{width:"30%"}}>Аймаг, Нийслэл</th>
                            <td style={{widtd:"60%"}}>
                                <select disabled={this.state.disabled} name="aimag_id" id="aimag_id" className='form-control' value={this.state.aimag_id} onChange={this.handleInputAimag}>
                                    <option value='-1'>--- Аймаг/Нийслэл сонгоно уу ---</option>
                                    {this.state.aimag.map((data, idx) =>
                                        <option key={idx} value={idx}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Сум/дүүрэг</th>
                            <td>
                                <select disabled={this.state.disabled} name="sum_id" id="sum_id" className='form-control' value={this.state.sum_id} onChange={this.handleInputSum}>
                                    <option value="-1">--- Сум/дүүрэг сонгоно уу ---</option>
                                    {this.state.sum.map((data, idx) =>
                                        <option key={idx} value={idx}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Баг/хороо</th>
                            <td>
                                <select disabled={this.state.disabled} name="baga_id" id="baga_id" className='form-control' value={this.state.baga_id} onChange={this.handleInputBaga}>
                                    <option value="-1">--- Баг/Хороо сонгоно уу ---</option>
                                    {this.state.baga.map((data, idx) =>
                                        <option key={idx} value={idx}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Зипкод</th>
                            <td>
                                <select disabled={this.state.disabled} name="zip_id" id="zip_id" className='form-control' value={this.state.zip_id} onChange={this.handleInputZip}>
                                    <option value="-1">--- Зипкод сонгоно уу ---</option>
                                    {this.state.zip.map((data, idx) =>
                                        <option key={idx} value={idx}>{data[1]}</option>
                                    )}
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <th>Зипкод оруулах/засварлах</th>
                            <td>
                                <input
                                name="zip_code"
                                type="number"
                                id="zip_code"
                                className='form-control'
                                value={this.state.zip_code}
                                onChange={(e)=> this.setState({zip_code:e.target.value})}></input>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2" >
                                <Maps
                                    wms_list={this.state.wms_list}
                                    aimag_id = {this.state.aimag_id}
                                    sum_id = {this.state.sum_id}
                                    bag_id = {this.state.baga_id}
                                    zip_id = {this.state.zip_id}
                                    latx = {latx}
                                    laty = {laty}
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
                {this.state.success_msg ?
                <div className="alert alert-success col-md-4 my-4" role="alert">
                    Амжилттай хадгалагдлаа
                </div>
                :
                null
                }
                {this.state.danger_msg ?
                <div className="alert alert-danger col-md-4 my-4" role="alert">
                    Алдаа гарлаа.
                </div>
                :
                null
                }
            </div>
        )

    }

}