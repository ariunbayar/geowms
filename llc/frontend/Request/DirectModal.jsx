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
        }
        this.handleLoaderActive = this.handleLoaderActive.bind(this)
    }

    componentDidMount() {
        const { info } = this.props
        if(info) {
            this.setState({ disabled: true })
        }
    }

    componentDidUpdate(pP, pS) {
        const { state } = this.props
        if (pP.state != state) {
            if(state == "ИЛГЭЭСЭН") {
                this.setState({ disabled: true })
            }
        }
    }

    handleLoaderActive(status) {
        this.setState({ is_loading: status })
    }

    render() {
        const {
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            project_name, vector_datas, id,
            file_name, info,
            aimag_name, aimag_geom,
            state,
        } = this.props
        return (
            <div className="row p-3">
                <Loader is_loading= {this.state.is_loading} text={"Хүсэлт илгээж байна түр хүлээнэ үү !!!"}/>
                <div className="col-md-5">
                    <form className="form-row">
                        {
                            aimag_name
                            &&
                                <div className="form-group col-md-12">
                                    <label htmlFor=''>Өгөгдлийн хамрагдаж буй аймгийн нэр</label>
                                    <input
                                        type="text"
                                        name='aimag_name'
                                        className="form-control"
                                        disabled={true}
                                        value={aimag_name}
                                    />
                                </div>
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
                        <UsedTools
                            values={this.props}
                        />
                        {
                            info || state == "ИЛГЭЭСЭН"
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
                                values={this.props}
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
