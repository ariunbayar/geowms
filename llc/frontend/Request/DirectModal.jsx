import React, { Component } from "react"
import Loader from "@utils/Loader"
import SelectField from '@utils/Tools/Form/select_field'

import {LLCMap} from '../LLCMap'
import UsedTools from './select_tools'

export default class RequestDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            info: false,
            desc_info: false,
            state: props.state,
            disabled: false,
            is_loading: false,
            nationwide: '',
            form_checked: false,
            investment_status: [
                {id:1, name: "Төсөл, хөтөлбөрийн"},
                {id:2, name: "Орон нутгийн"},
                {id:3, name: "Улсын төсвийн"},
                {id:4, name: "Хувийн"},
            ]
        }
        this.handleLoaderActive = this.handleLoaderActive.bind(this)
        this.getValueCheckbox = this.getValueCheckbox.bind(this)
    }

    componentDidMount() {
        const { info } = this.props
        if(info) {
            this.setState({ disabled: true })
        }
    }

    componentDidUpdate(pP, pS) {
        const { state, geo_id } = this.props
        if (pP.state != state) {
            if(state == "ИЛГЭЭСЭН") {
                this.setState({ disabled: true })
            }
        }
        if(pP.geo_id !== geo_id){
            if( geo_id == '496'){
                this.setState({ form_checked: true })
            }
            else {
                this.setState({ form_checked: false })
            }
        }
    }

    handleLoaderActive(status) {
        this.setState({ is_loading: status })
    }

    getValueCheckbox(e){
        const { geo_id } = this.props
        const checked = e.target.checked
        if (checked == true){
            this.setState({
                nationwide: '496',
                form_checked: true
            })
        }
        else{

            this.setState({
                nationwide: geo_id,
                form_checked: false
            })
        }
    }

    render() {
        const {
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            project_name, vector_datas, id,
            file_name, info, state, desc_info,
            aimag_name, aimag_geom, desc, emp_fields, mergejilten,
        } = this.props
        var { investment_status, disabled } = this.state
        var default_mergejilten = ''
        if (mergejilten) default_mergejilten = mergejilten
        else if (emp_fields && 0 <= emp_fields.length) { default_mergejilten = emp_fields[0]?.user_id || 'Байхгүй'}
        if (info && hurungu_oruulalt) {
            investment_status = [ investment_status[hurungu_oruulalt-1] ]
        }
        return (
            <div className="row p-3">
                <Loader is_loading= {this.state.is_loading} text={"Хүсэлт илгээж байна. Түр хүлээнэ үү !!!"}/>
                <div className="col-md-5">
                    <form className="form-row">
                        {
                            (aimag_name && !info)
                            &&
                                <>
                                    <div className="col-md-12 d-flex justify-content-between">
                                        <label htmlFor="" className="col-md-6 float-left px-0">Өгөгдлийн хамрах хүрээ</label>
                                        <div className="col-md-6 d-flex justify-content-end align-items-center mb-1">
                                            <input
                                                className={'form-check-label mr-1'}
                                                type="checkbox"
                                                id="check"
                                                checked={this.state.form_checked}
                                                onChange={(e) => this.getValueCheckbox(e)}
                                            />
                                            <label htmlFor="check" className="my-auto">Улсын хэмжээнд</label>
                                        </div>
                                    </div>
                                    <input
                                            className={'form-control col-md-12 mb-3  ml-1'}
                                            type="text"
                                            disabled={true}
                                            value={aimag_name}
                                        />
                                </>
                        }
                        <div className="form-group col-md-12">
                            <label htmlFor='zahialagch'>Захиалагч байгууллага</label>
                            <input
                                type="text"
                                name='zahialagch'
                                id="zahialagch"
                                className="form-control"
                                disabled={disabled}
                                value={zahialagch}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-12 m-0">
                            <label htmlFor='project_name'>Төслийн нэр</label>
                            <input
                                type="text"
                                id="project_name"
                                name='project_name'
                                className="form-control"
                                disabled={disabled}
                                value={project_name}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-6 my-4 col-sm-6">
                            <label htmlFor='object_type'>Обьектийн төрөл</label>
                            <textarea
                                type="text"
                                name="object_type"
                                id="object_type"
                                className="form-control"
                                disabled={disabled}
                                value={object_type}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-6 col-sm-6 my-4">
                            <label htmlFor="object_count">Обьектийн тоо хэмжээ</label>
                            <textarea
                                type="text"
                                name="object_count"
                                id="object_count"
                                className="form-control"
                                disabled={disabled}
                                value={object_count}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-12 ">
                                <SelectField
                                    state_name= "hurungu_oruulalt"
                                    label="Хөрөнгө оруулалтын байдал"
                                    option_name="name"
                                    option_key="id"
                                    className="col-md-12 px-0 mx-0"
                                    data_list={investment_status}
                                    default_value={hurungu_oruulalt}
                                    default_text={"----   хөрөнгө оруулалтын байдлыг сонгоно уу  ----"}
                                    handleSelectField={this.props.handleOnChange}
                                    disabled={disabled}
                                />
                            </div>
                                {
                            (info || disabled) &&
                                <div className="form-group col-md-12">
                                    <label htmlFor='zahialagch' className="col-md-12 p-0" > Мэргэжилтэн сонгох</label>
                                    <select
                                        className="form-control"
                                        name="mergejilten"
                                        id="mergejilten"
                                        onChange={(e) => {this.props.handleOnChange(e)}}
                                        value={default_mergejilten}
                                        disabled={!info && disabled }
                                    >
                                        <option value=''>
                                            {disabled ? mergejilten : " Илгээх мэргэжилтэнээ сонгоно уу"}
                                        </option>
                                    {
                                        (emp_fields && emp_fields.length > 0)
                                        ?
                                                emp_fields.map((value, idx) => (
                                                    <optgroup
                                                        id={idx}
                                                        label={value.org_name}
                                                    >
                                                        <option value={value.user_id}>{value.first_name}</option>
                                                    </optgroup>
                                                ))
                                            :
                                                null
                                    }
                                    </select>
                            </div>
                            }
                            {
                            desc_info
                            &&
                                <div className="form-group col-md-12">
                                    <label htmlFor='description-id'>Тайлбар</label>
                                    <textarea
                                        type="text"
                                        name="description"
                                        id="description-id"
                                        className="form-control"
                                        value={desc}
                                        disabled={this.state.disabled}
                                    />
                                </div>
                            }
                        <UsedTools
                            values={this.props}
                        />
                        {
                            !info
                            ?
                                <div className={`form-group`}>
                                    <label htmlFor='choose' className="col-md-12">Орон зайн мэдээлэл</label>
                                    <label
                                        htmlFor="choose-file"
                                        id="choose"
                                        className={`custom-file-upload col-md-6 text-center ${!file_name  ? "border-danger" : ''}`}
                                        id="choose-file-label"
                                        data-toggle="toolpit"
                                        data-placement="top"
                                        title={!file_name ? 'файл сонгогдоогүй байна ' : file_name}
                                    >
                                        файл оруулах
                                    </label>
                                    <input type="file" accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                                        name="uploadDocument"
                                        type="file"
                                        id="choose-file"
                                        name='files'
                                        onChange={(e) => this.props.handleOnChange(e)}
                                        style={{display: 'none'}}
                                    />
                                    {
                                        file_name && <small className="col-md-5 ml-2">{file_name}</small>
                                    }
                                </div>
                            :
                                null
                        }
                    </form>
                    {
                        this.props.submitClass
                        &&
                            <this.props.submitClass
                                valid_request = {document.getElementsByClassName('is-valid')}
                                nationwide = {this.state.nationwide}
                                values={this.props}
                                mergejilten={default_mergejilten}
                                loader={this.handleLoaderActive}
                            />
                    }
                </div>
                {
                    id
                    &&
                        <div className="col-md-7">
                            <LLCMap
                                vector_datas={vector_datas}
                                height="80vh"
                                aimag_geom={aimag_geom}
                            />
                        </div>
                }
            </div>
        )
    }
}
