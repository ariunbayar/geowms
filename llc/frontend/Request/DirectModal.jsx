import React, { Component } from "react"
import Loader from "@utils/Loader"

import {LLCMap} from '../LLCMap'
import UsedTools from './select_tools'

export default class RequestDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            info: false,
            state: props.state,
            disabled: false,
            is_loading: false,
            nationwide: '',
            form_checked: false,
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

    getProf(e){
        const send_mail = e.target.value
        this.setState({ send_mail })
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
            file_name, info,
            aimag_name, aimag_geom,
            state, emp_fields
        } = this.props
        return (
            <div className="row p-3">
                <Loader is_loading= {this.state.is_loading} text={"Хүсэлт илгээж байна түр хүлээнэ үү !!!"}/>
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
                                disabled={this.state.disabled}
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
                                disabled={this.state.disabled}
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
                                disabled={this.state.disabled}
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
                                disabled={this.state.disabled}
                                value={object_count}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor='hurungu_oruulalt'> Хөрөнгө оруулалтын байдал </label>
                            <textarea
                                name='hurungu_oruulalt'
                                rows="3"
                                id="hurungu_oruulalt"
                                className="form-control"
                                disabled={this.state.disabled}
                                value={hurungu_oruulalt}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        {
                            info &&
                            <div className="form-group col-md-12">
                                <label htmlFor='zahialagch' className="col-md-12 p-0" > Мэргэжилтэн сонгох</label>
                                <select className="form-control" id="mergejilten"
                                    onChange={(e) => this.getProf(e)}
                                >
                                    <option value=''>Илгээх мэргэжилтэнээ сонгоно уу </option>
                                   {
                                       (emp_fields && emp_fields.length > 0)
                                       ?
                                            emp_fields.map((value, idx) => (
                                                <optgroup
                                                    id={idx}
                                                    label={value.org_name}
                                                >
                                                    <option value={value.first_name, value.mail}>{value.first_name}</option>
                                                </optgroup>
                                            ))
                                        :
                                            null
                                   }
                                </select>
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
                                    <input
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
                                mergejilten={this.state.send_mail}
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
