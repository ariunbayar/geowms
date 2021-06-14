import React, { Component } from "react"

import { LLCMap } from '../LLCMap'
import { service } from '../Request/service'

export class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            vector_datas: [],
            disabled: true,
            aimag_name: '',
            selected_tools: [],
        }
    }

    componentDidMount() {
        var id = this.props.match.params.id
        service
            .handleRequestData(id)
            .then(({ vector_datas, form_field, aimag_name }) => {
                if (form_field) {
                    this.setState({
                        vector_datas,
                        aimag_name,
                        zahialagch: form_field['client_org'],
                        project_name: form_field['project_name'],
                        object_type: form_field['object_type'],
                        object_count: form_field['object_quantum'],
                        hurungu_oruulalt: form_field['investment_status'],
                        selected_tools: form_field['selected_tools'],
                    })
                }
        })
    }

    render() {
        const {
            aimag_name, zahialagch,
            project_name, object_type,
            object_count, hurungu_oruulalt,
            vector_datas, selected_tools,
        } = this.state
        var is_disable = true
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
                                    <tbody>
                                        {
                                            selected_tools && selected_tools.length > 0
                                            ?
                                                selected_tools.map((value, idx) =>
                                                    <tr key={idx}>
                                                        <th scope="row">{idx+1}</th>
                                                        <td>
                                                            <a href="#" onClick={(e) => this.handleModalOpen(value)}>
                                                                <i aria-hidden="true">{value.bagaj_dugaar}</i>
                                                            </a>
                                                        </td>
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
