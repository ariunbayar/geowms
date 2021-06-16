import React, { Component } from "react"

import { LLCMap } from '../LLCMap'
import { service } from '../Request/service'
import RequestDetail from '../Request/DirectModal'

export class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            project_name: '',
            object_type: '',
            object_count: '',
            hurungu_oruulalt: '',
            vector_datas: [],
            aimag_name: '',
            selected_tools: [],
            disabled: true,
            info: true,
            desc_info: true
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
                        // description: form_field['description'],
                        desc: form_field['desc'],
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
            desc, disabled, info, desc_info
        } = this.state
        var id = this.props.match.params.id
        return(
            <div className="card">
                <div className="card-body">
                    <RequestDetail
                        aimag_name={aimag_name}
                        zahialagch={zahialagch}
                        project_name={project_name}
                        object_type={object_type}
                        object_count={object_count}
                        hurungu_oruulalt={hurungu_oruulalt}
                        vector_datas={vector_datas}
                        selected_tools={selected_tools}
                        desc={desc}
                        id={id}
                        disabled={disabled}
                        info={info}
                        desc_info={desc_info}
                    />
                </div>
            </div>
        )
    }
}
