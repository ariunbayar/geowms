import React, { Component } from "react"
import Maps from './map/Map'
import {service} from './service'
import FormTable from './FormTable'
import ModalAlert from '../Components/helpers/ModalAlert'

export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_data:[],
            search_query:'2',
            search_table:'AU_AimagUnit',
            zip_code:'',
            shiidver: '',
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
            disabled: false,
            root_check: false,
            root1: '',
            root2: '',
            root3: '',
            root4: -1,
            modal_alert_status: 'closed',
            timer: null,
            modal_text: '',
            modal_icon: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.getAimag = this.getAimag.bind(this)
        this.handleInputAimag = this.handleInputAimag.bind(this)
        this.handleInputSum = this.handleInputSum.bind(this)
        this.handleInputZip = this.handleInputZip.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleEdit = this.handleEdit.bind(this)
        this.handlefeatureDataRead = this.handlefeatureDataRead.bind(this)
        this.handleInpuZereg = this.handleInpuZereg.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }
    handleInpuZereg(value){
        this.setState({search_table: value, search_query: '0'})
    }
    handlefeatureDataRead(data, coordinat){
        this.setState({root1: '', root2: '', root3: '', root4: -1, latx: coordinat[1] , laty: coordinat[0], root_check: true})
        if(this.state.search_table == 'AU_AimagUnit'){
            {data.map(([name, values], idx) =>
                {values.map(([field, value], val_idx) =>
                    field == 'code' ? this.handleInputAimag(value, false, true) : null
                )}
            )}
        }
        if(this.state.search_table == 'AU_SumUnit')
        {
            {data.map(([name, values], idx) =>
                {values.map(([field, value], val_idx) =>
                    field == 'au1_code' ? this.handleInputAimag(value, false, true) :
                    field == 'code' ? this.setState({root2:value}) : null
                )}
            )}
        }
        if(this.state.search_table == 'zipcode'){
            {data.map(([name, values], idx) =>
                {values.map(([field, value], val_idx) =>
                    field == 'au1_code' ? this.handleInputAimag(value, false, true) :
                    field == 'au2_code' ? this.setState({root2:value}) :
                    field == 'code' ? this.setState({root4:value}) : null
                )}
            )}
        }
    }

    handleEdit(root, name, x, y, root1, root2){
        this.setState({root1: '', root2: '', root3: '', root4: -1, latx: '', laty: '', root_check: true})
        this.setState({latx:x, laty:y, zip_code:root, zip_code_before:root})
        if(this.state.search_table == 'AU_AimagUnit'){
            this.handleInputAimag(root, true, true)
        }
        // if(this.state.search_table == 'AU_SumUnit')
        // {
        //     this.handleInputAimag(root1, true, true)
        //     this.setState({root2:root})
        // }
        // if(this.state.search_table == 'zipcode'){
        //     this.handleInputAimag(root1, true, true)
        //     this.setState({root2:root2, root4: root})
        // }
    }

    handleSearch(value, name){
        this.setState({search_query: value})
        service.zipSearch(value, name).then(({info, success}) => {
            if(success){
                this.setState({form_data: info})
            }
            else{
                this.setState({error_msg: info})
            }setTimeout(() => {
                this.setState({error_msg: ''})
            }, 2222);
        })
    }

    componentDidUpdate(pP, pS){
        if(pS.disabled !== this.state.disabled)
        {
            setTimeout(() => {
                this.setState({disabled: false})
            }, 2000);
        }
        if(pS.search_table !== this.state.search_table)
        {
            this.handleSearch('0', this.state.search_table)

        }
    }

    handleInputAimag(code, check, check_search){
        this.setState({aimag_id: code, sum:[], zip:[], sum_id: -1, zip_id:-1, disabled: true})
        if(check) this.setState({root_check: false})
        if(check && !check_search) this.setState({search_table: 'AU_AimagUnit', root1: '', root2: '', root3: '', root4: -1})

        const aimag = this.state.aimag
        var idx = -1
        for(var i = 0; i < aimag.length; i++){
            if(aimag[i][0] == code){
                idx = i
            }

        }
        if(check){this.setState({aimag_id: code})}
        const aiamg_data = aimag[idx]
        var zip_code = aiamg_data[0]
        var latx = aiamg_data[2]
        var laty = aiamg_data[3]
        if(!check_search) this.setState({latx, laty})
        this.setState({zip_code, zip_code_before:zip_code})
        service.getSum(zip_code).then(({info, success}) => {
            if(success){
                this.setState({sum: info})
                if(this.state.root2 != ''){
                    this.handleInpSutum(this.state.root2, check, check_search)
                }
            }
            else{
                this.setState({error_msg: info})
            }setTimeout(() => {
                this.setState({error_msg: ''})
            }, 2222);
        })
    }

    handleInputSum(code, check, check_search){
        this.setState({sum_id: code, zip:[], zip_id:-1})
        if(check) this.setState({root_check: false})
        if(check && !check_search) this.setState({search_table: 'AU_SumUnit', root1: '', root2: '', root3: '', root4: -1})
        this.setState({disabled: true})
        if(code){
            const sum = this.state.sum
            var idx = -1
            for(var i = 0; i < sum.length; i++){
                if(sum[i][0] == code){
                    idx = i
                }
            }
            if(sum.length >= idx && sum.length >= -1){
                const sum_data = sum[idx]
                var zip_code = sum_data[0]
                var latx = sum_data[2]
                var laty = sum_data[3]
                if(!check_search) this.setState({latx, laty})
                this.setState({zip_code, zip_code_before:zip_code})
                service.getZip(zip_code).then(({info, success}) => {
                    if(success){
                        this.setState({zip: info})
                        if(this.state.root4 != -1) this.handleInputZip(this.state.root4, check, check_search)
                    }
                    else{
                        this.setState({error_msg: info})
                    }setTimeout(() => {
                        this.setState({error_msg: ''})
                    }, 2222);
                })
            }
        }
    }

    handleInputZip(code, check, check_search){
        if(check) this.setState({root_check: false})
        if(check && !check_search) this.setState({search_table: 'zipcode', root1: '', root2: '', root3: '', root4: -1})
        this.setState({disabled: true})
        const zip = this.state.zip
        var idx = -1
        for(var i = 0; i < zip.length; i++){
            if(zip[i][0] == parseInt(code)){
                idx = i
            }
        }
        if(zip.length >= idx && zip.length >= -1){
            this.setState({zip_id: parseInt(code)})
            const zip_data = zip[idx]
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
                   this.setState({handle_save:false, latx:'', laty:'', latx:'', sum:[], baga:[], aimag_id: -1, sum_id: -1, baga_id: -1,zip_id: -1, zip_code:''})
                   this.getAimag()
                   this.handleSearch(this.state.search_query,this.state.search_table)
                }, 1000);
                this.setState({modal_text: "Амжилттай хадгаллаа"})
                this.setState({modal_icon: 'success'})
                this.setState({modal_alert_status: 'open'})
                this.modalCloseTime()
            }else{
                setTimeout(() => {
                    this.setState({handle_save:false})
                }, 1000);
                this.setState({modal_text: "Алдаа гарлаа"})
                this.setState({modal_icon: 'danger'})
                this.setState({modal_alert_status: 'open'})
                this.modalCloseTime()
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
        this.handleSearch(this.state.search_query,this.state.search_table)
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

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
    }

    render() {
        const {latx, laty} = this.state
        return (
            <div className="card container">
                <div className="row card-body">
                    <div className="mt-4 col-md">
                        <table className="table table-bordered">
                            <tbody>
                            <tr>
                                <th style={{width:"30%"}}>Аймаг, Нийслэл</th>
                                <td style={{widtd:"60%"}}>
                                    <select disabled={this.state.disabled} name="aimag_id" id="aimag_id" className='form-control' value={this.state.aimag_id} onChange={(e) => this.handleInputAimag(e.target.value, true, false)}>
                                        <option value='-1'>--- Аймаг/Нийслэл сонгоно уу ---</option>
                                        {this.state.aimag.map((data, idx) =>
                                            <option key={idx} value={data[0]}>{data[1]}</option>
                                        )}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Сум/дүүрэг</th>
                                <td>
                                    <select disabled={this.state.disabled} name="sum_id" id="sum_id" className='form-control' value={this.state.sum_id} onChange={(e) => this.handleInputSum(e.target.value, true, false)}>
                                        <option value="-1">--- Сум/дүүрэг сонгоно уу ---</option>
                                        {this.state.sum.map((data, idx) =>
                                            <option key={idx} value={data[0]}>{data[1]}</option>
                                        )}
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Баг/хороо</th>
                                <td>
                                    <select disabled={this.state.disabled} name="zip_id" id="zip_id" className='form-control' value={this.state.zip_id} onChange={(e) => this.handleInputZip(e.target.value, true, false)}>
                                        <option value="-1">--- Зипкод сонгоно уу ---</option>
                                        {this.state.zip.map((data, idx) =>
                                            <option key={idx} value={data[0]}>{data[1]} {data[0]}</option>
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
                                        zip_id = {this.state.zip_id}
                                        latx = {latx}
                                        laty = {laty}
                                        root_check = {this.state.root_check}
                                        search_table = { this.state.search_table}
                                        handlefeatureDataRead={this.handlefeatureDataRead}
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
                    <div className="my-4 mt-4 col-md">
                    <input
                        type="text"
                        className="form-control col-md-7  mb-1 float-left"
                        id="search_query"
                        placeholder="Хайх"
                        onChange={(e) => this.handleSearch(e.target.value, this.state.search_table)}
                        value={this.state.search_query}
                    />
                    <select name="search_table" id="search_table" className='form-control col-md-5  mb-1 float-left' value={this.state.search_table} onChange={(e) => this.handleInpuZereg(e.target.value)}>
                        <option value='AU_AimagUnit'>Аймаг нийслэлийн хил</option>
                        <option value='AU_SumUnit'>Сум дүүргийн хил</option>
                        <option value='zipcode'>Баг хорооны хил</option>
                    </select>
                        <div className="table-responsive">
                            <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">№</th>
                                            <th scope="col">Нэр</th>
                                            <th scope="col">Код</th>
                                            <th scope="col">Засах</th>
                                        </tr>
                                    </thead>
                                    <tfoot>
                                        {this.state.form_data.map((values, idx) =>
                                            <FormTable
                                                handleEdit={this.handleEdit}
                                                key={idx}
                                                values={values}
                                                idx = {idx}
                                            />
                                        )}
                                    </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title={this.state.modal_text}
                    model_type_icon = {this.state.modal_icon}
                />
            </div>
        )
    }
}