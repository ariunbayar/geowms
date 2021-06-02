import React, { Component, Fragment } from "react"
import { service } from "./service"
import {GPIcon} from "@utils/Tools"
import {LLCMap} from '../LLCMap'
import UsedTools from './select_tools'

export default class RequestDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            info: false,
            state : props.state,
            disabled: false
        }
    }

    componentDidMount() {
        const {info} = this.props
        if(info) {
            this.setState({disabled: true})
        }
    }

    componentDidUpdate(pP, pS) {
        const {info, state} = this.props
        if (pP.state != state) {
            if(state == 2) {
                this.setState({disabled: true})
            }
        }
    }

    render (){
        console.log(this.props)
        const {
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            project_name, vector_datas, id,
            files, file_name, info,
            aimag_name, aimag_geom
        } = this.props
        return (
            <div className="row p-3">
                <div className="col-md-5">
                    <form  class="form-row">
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
                            <label htmlFor=''>Захиалагч байгууллага</label>
                            <input
                                type="text"
                                name='zahialagch'
                                className="form-control"
                                disabled={this.state.disabled}
                                value={zahialagch}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-12 m-0">
                            <label htmlFor=''>төслийн нэр</label>
                            <input
                                type="text"
                                name='project_name'
                                className="form-control"
                                disabled={this.state.disabled}
                                value={project_name}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-6 my-4 col-sm-6">
                            <label htmlFor=''>Обьектийн төрөл</label>
                            <textarea
                                type="text"
                                name="object_type"
                                className="form-control"
                                disabled={this.state.disabled}
                                value={object_type}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-6 col-sm-6 my-4">
                            <label htmlFor=''>Обьектийн тоо хэмжээ</label>
                            <textarea
                                type="text"
                                name="object_count"
                                className="form-control"
                                disabled={this.state.disabled}
                                value={object_count}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor=''> Хөрөнгө оруулалтын байдал </label>
                            <textarea
                                name='hurungu_oruulalt'
                                rows="3"
                                className="form-control"
                                disabled={this.state.disabled}
                                value={hurungu_oruulalt}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <UsedTools
                            values={this.props}
                        />
                        <div className={`form-group ${info ? "invisible" : 'visible'}`}>
                            <label htmlFor='' className="col-md-12">Орон зайн мэдээлэл</label>
                            <label
                                htmlFor="choose-file"
                                className="custom-file-upload col-md-6 text-center"
                                id="choose-file-label"
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
                            <span className="col-md-5 ml-2">
                                {file_name ? file_name : 'файл сонгогдоогүй байна'}
                            </span>
                        </div>
                    </form>
                    {
                        this.props.submitClass
                        &&
                        <this.props.submitClass
                            values={this.props}
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
