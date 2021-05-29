import React, { Component, Fragment } from "react"
import { service } from "./service"
import {GPIcon} from "@utils/Tools"
import {LLCMap} from '../LLCMap'
import UsedTools from './select_tools'

// class SubmitClass extends Component {

//     constructor(props) {
//         super(props)
//         this.state = {
//             url:"/llc/llc-request/"
//         }
//         this.handleSubmit = this.handleSubmit.bind(this)
//     }

//     handleSubmit(){
//         const {
//             files, project_name,
//             object_type, object_count,
//             hurungu_oruulalt, zahialagch,
//         } = this.props.values
//         const form_datas = new FormData()
//         form_datas.append('files', files, files.name)
//         form_datas.append('project_name', project_name)
//         form_datas.append('object_type', object_type)
//         form_datas.append('object_count', object_count)
//         form_datas.append('hurungu_oruulalt', hurungu_oruulalt)
//         form_datas.append('zahialagch', zahialagch)
//         console.log(form_datas);
//         service.SaveRequest(form_datas).then(({success, info}) => {
//             this.props.values.handlePassValues(success, info)
//         })
//     }
//     render (){
//         const {values} = this.props
//         const {url} = this.state
//         return (
//                 <div>
//                     { values.info == 'Хүсэлт илгээх'
//                         ?
//                             <div className="col-md-8 mt-2  col-sm-8 col-xl-8">
//                                         <p className="btn btn-secondary">
//                                             <i
//                                                 className="fa fa-angle-double-left"
//                                                 onClick ={()=> values.closeRequestMap()}

//                                             >
//                                                 Буцах
//                                             </i>
//                                         </p>
//                                         &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
//                                         <p
//                                             className="btn btn-primary"
//                                             onClick ={()=> this.handleSubmit()}
//                                         >
//                                             <i className="fa"> Хүсэлт илгээх</i>
//                                         </p>
//                             </div>
//                         :
//                             <div className="col-md-8 mt-2  col-sm-8 col-xl-8">
//                                 <p className="btn btn-secondary">
//                                     <i
//                                         className="fa fa-angle-double-left"
//                                         onClick ={()=> values.history.push(url)}

//                                     >
//                                             Буцах
//                                     </i>
//                                 </p>
//                             </div>
//                     }
//                 </div>
//         )
//     }
// }

export default class RequestDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render (){
        const {
            object_type, object_count,
            hurungu_oruulalt, zahialagch,
            project_name, vector_datas, id,
        } = this.props
        return (
            <div className="row p-3">
                <div className="col-md-5">
                    <form  class="form-row">
                        <div className="form-group col-md-12">
                            <label htmlFor=''>Захиалагч байгууллага</label>
                            <input
                                type="text"
                                name='zahialagch'
                                className="form-control"
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
                                value={hurungu_oruulalt}
                                onChange={(e) => {this.props.handleOnChange(e)}}
                            />
                        </div>
                        <UsedTools
                            values={this.props}
                        />
                        <div className="form-group">
                            <label htmlFor=''>Байр зүйн мэдээлэл</label>
                            <input
                                type="file"
                                name='files'
                                className="form-control-file"
                                onChange={(e) => this.props.handleOnChange(e)}
                            />
                            <small className="text-center text-muted col-md-12 mt-1">
                                Хавсаргах файл нь геометр өгөгдөл агуулсан ".rar" форматтай файл байна
                            </small>
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
                    />
                </div>

                }
            </div>
        )
    }
}
