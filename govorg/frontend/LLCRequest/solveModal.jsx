import React, { Component } from "react"
import RequestModal from './requestModal'
import {LLCMap} from '../../../llc/frontend/LLCMap'

class DetailModalBody extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    render() {
        const {
            aimag_name, zahialagch,
            project_name, object_type,
            object_count, hurungu_oruulalt,
            vector_datas, aimag_geom
        } = this.props
        var is_disable = true
        return(
            <>
            <div className="row p-3">
                {/* <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} /> */}
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
                                        disabled={is_disable}
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
                                value={zahialagch}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-12 m-0">
                            <label htmlFor=''>Төслийн нэр</label>
                            <input
                                type="text"
                                name='project_name'
                                className="form-control"
                                value={project_name}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-6 my-4 col-sm-6">
                            <label htmlFor=''>Объектийн төрөл</label>
                            <textarea
                                type="text"
                                name="object_type"
                                className="form-control"
                                value={object_type}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-6 col-sm-6 my-4">
                            <label htmlFor=''>Объектийн тоо хэмжээ</label>
                            <textarea
                                type="text"
                                name="object_count"
                                className="form-control"
                                value={object_count}
                                disabled={is_disable}
                            />
                        </div>
                        <div className="form-group col-md-12">
                            <label htmlFor=''> Хөрөнгө оруулалтын байдал </label>
                            <textarea
                                name='hurungu_oruulalt'
                                rows="3"
                                className="form-control"
                                value={hurungu_oruulalt}
                                disabled={is_disable}
                            />
                        </div>
                    </form>
                </div>
                <div className="col-md-7">
                    <LLCMap
                        vector_datas={vector_datas}
                        height="50vh"
                        aimag_geom={aimag_geom}
                        selectedFeature={this.selectedFeature}
                    />
                </div>
            </div>
            <div className="row my-2 mr-1 float-right">
                <button
                    type="button mr-2 ml-2"
                    onClick={() => this.modalChange(
                        'reject',
                        'fa fa-exclamation-circle',
                        'warning',
                        "Тохиргоог татгалзах",
                        `Та татгалзахдаа итгэлтэй байна уу?`,
                        true,
                        "татгалзах",
                        null
                    )}
                    className="btn gp-btn-primary waves-effect waves-light"
                >
                    <i className="fa fa-check-square-o">Татгалзах</i>
                </button>
                <button
                    type="button mr-2 ml-2"
                    onClick={() => this.modalChange(
                        'reject',
                        'fa fa-exclamation-circle',
                        'warning',
                        "Тохиргоог буцаах",
                        `Та буцаахдаа итгэлтэй байна уу?`,
                        true,
                        "буцаах",
                        null
                    )}
                    className="btn gp-btn-primary waves-effect waves-light ml-2"
                >
                    <i className="fa fa-check-square-o">Буцаах</i>
                </button>
                <button
                    type="button mr-2 ml-2"
                    onClick={() => this.modalChange(
                        'approve',
                        'fa fa-exclamation-circle',
                        'warning',
                        "Хүсэлт үүсгэх",
                        `Та хүсэлт үүсгэх итгэлтэй байна уу?`,
                        true,
                        "Хүсэлт үүсгэх",
                        null
                    )}
                    className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                >
                    <i className="fa fa-check">Хүсэлт үүсгэх</i>
                </button>
            </div>
            </>
        )
    }
}

export default class SolveModal extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_modal_request_open: false,
            values: props.values,
            state: props.values.state,
        }
        this.openModalMap = this.openModalMap.bind(this)
        this.closeModalMap = this.closeModalMap.bind(this)
    }

    openModalMap() {
        this.setState({ is_modal_request_open: true })
    }

    closeModalMap() {
        this.setState({ is_modal_request_open: false })
    }


    render() {
        const { is_modal_request_open, state } = this.state
        return (
            <div>
                {
                    state == "ШИНЭ"
                    &&
                        <a
                            className="btn btn-primary btn-sm text-white text-capitalize"
                            onClick={this.openModalMap}
                        >
                            Шийдвэрлэх
                        </a>
                }
                {
                    is_modal_request_open
                    &&
                        <RequestModal
                            modalClose={this.closeModalMap}
                            model_body={DetailModalBody}
                            {...this.props.values}
                            title={'Хүсэлт шийдвэрлэх'}
                        />
                }
            </div>
        )
    }
}
