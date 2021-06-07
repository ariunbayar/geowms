import React, { Component } from "react"
import { LLCMap } from '../../../llc/frontend/LLCMap'
import DetailModal from "./detailModal"
import ModelSelectTools from "../../../llc/frontend/Request/select_modal"
import { service } from './service'

export class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: props.values,
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            vector_datas: [],
            disabled: true,
            aimag_name: '',
            modal_status: 'closed',
            modal_open: false,
            features: this.props,



            select_layer_status: false,
            values: [],
            modalAction: '',
            modal_title: '',
            more_detail: '',
            selected_tools: []
        }
        this.selectedFeature = this.selectedFeature.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)


        this.handleSelectedTool = this.handleSelectedTool.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    componentDidMount() {
        var id = this.props.match.params.id
        service.handleRequestData(id).then(({ vector_datas, form_field, selected_tools, aimag_name, aimag_geom }) => {
            if (form_field) {
                this.setState({
                    vector_datas,
                    zahialagch :form_field['client_org'],
                    project_name : form_field['project_name'],
                    object_type : form_field['object_type'],
                    object_count : form_field['object_quantum'],
                    hurungu_oruulalt : form_field['investment_status'],
                    selected_tools,
                    aimag_name,
                    aimag_geom,
                })
            }
        })
    }

    selectedFeature(e) {
        const feature = e.selected[0]
        if (feature) {
            const { values } = this.props
            const id = feature.getProperties()['id']
            values.map((value) => {
                if (value.id == id) {
                    this.setState({ form_json: value.form_json, selected_value: value })
                }
            })
        }
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open', modal_open: true }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }



    componentDidUpdate(pP, pS) {
        const { selected_tools, state, info } = this.props.values
        // backaas avnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        if(pP.values.selected_tools != selected_tools) {
            if(!state && !info ) {
                this.setState({ selected_tools: selected_tools })
            }
            else {
                this.setState({ selected_tools: selected_tools })
            }
        }
    }

    modalClose() {
        this.setState({ select_layer_status: false })
    }

    handleSelectedTool(value_type, value) {
        var array = [...this.state.selected_tools]
        if(value_type) {
            array = array.concat(value)
            this.setState({ select_layer_status: false })
        }
        else {
            for(let [i, layer] of array.entries()) {
                if(layer.bagaj_dugaar == value.bagaj_dugaar) {
                    array.splice(i, 1);
                }
            }
        }
        this.props.values.handleSelectModel(array)
    }

    handleSelectModel(modal_title, modalAction, values, more_detail) {
        return(
            this.setState({
                select_layer_status: true,
                modalAction,
                modal_title,
                values,
                more_detail
            })
        )
    }


    render() {
        const {
            aimag_name, zahialagch,
            project_name, object_type,
            object_count, hurungu_oruulalt,
            vector_datas, aimag_geom,
            modal_open,
        } = this.state
        var is_disable = true


        const {
            modalAction, values,
            modal_title,
            select_layer_status,
            selected_tools
        } = this.state
        return(
            <div className="card">
                <div className="card-body">
                    <div className="row p-3">
                        <div className="col-md-5">
                            <form  className="form-row">
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
                            <div className="overflow-auto" style={{maxHeight: '30vh'}}>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"> № </th>
                                            <th scope="col">Багажны дугаар</th>
                                            <th scope="col">Багажны марк</th>
                                            <th scope="col">сертификатын дугаар</th>
                                            <th scope="col">Дуусах хугацаа</th>
                                        </tr>
                                    </thead>
                                    {/* <tbody>
                                        {
                                            <tr className="col-md-12" style={{fontSize: '12px'}}>
                                                <td>{1}</td>
                                                <td>
                                                    <a href="#" onClick={this.handleModalOpen}>
                                                        <i aria-hidden="true">{2}</i>
                                                    </a>
                                                </td>
                                            </tr>
                                        }
                                    </tbody> */}
                                    <tbody>
                                        {
                                            selected_tools && selected_tools.length > 0
                                            ?
                                                selected_tools.map((value, idx) =>
                                                    <tr key={idx}>
                                                        <th scope="row">{idx+1}</th>
                                                        <td>{value.bagaj_dugaar}</td>
                                                        <td>{value.bagaj_mark}</td>
                                                        <td>{value.certificate_number}</td>
                                                        <td>{value.expired_date}</td>
                                                    </tr>
                                                )
                                            :
                                                null
                                        }
                                    </tbody>
                                </table>
                            </div>
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
                    {
                        modal_open
                        &&
                            <DetailModal/>
                    }
                </div>
            </div>
        )
    }
}
