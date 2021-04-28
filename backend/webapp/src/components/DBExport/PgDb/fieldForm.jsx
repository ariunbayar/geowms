import React, { Component } from 'react';

export default class FieldForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selected_field: props.setSelectedField,
            selected_data_type: props.selected_data_type,
            field_class_name: ''
        }
    }

    componentDidUpdate(pP, pS) {
        const { data, selected_data_type, selected_field, setSelectedField } = this.props
        if (pP.setSelectedField != setSelectedField) {
            var field_type = ''
            if (setSelectedField) {
                if ( data.data_type.slice(0,4) != selected_data_type.slice(0,4) ) {
                    field_type = 'is-invalid'
                }
            }
            this.setState({field_class_name: field_type})
        }
    }

    render() {
        const { data, table_fields, data_key, setSelectedField} = this.props
        const { field_class_name } = this.state
        return (
            <div className="col-md-12 mb-1 pb-1">
                <label className='col-md-4 d-inline-block'>
                    {data.column_name}
                </label>
                <select
                    value={setSelectedField}
                    className={
                        'form-control col-md-3 d-inline-block ml-4 '
                        +
                        (
                            field_class_name ? field_class_name : ''
                        )
                    }
                    id="table_name"
                    onChange={(e) => this.props.handleSetField(data_key, e)}
                >
                    <option value=''>---Хүснэгтийн талбарыг сонгоно уу---</option>
                    {
                        table_fields.map((row, idx) =>
                            <option
                                key={idx}
                                value={row.column_name}
                                name={row.data_type}>{row.column_name}
                            </option>
                        )
                    }
                </select>
                {
                    field_class_name
                    &&
                <span className='d-block text-center text-danger'>
                    {data.column_name} болон {setSelectedField} талбаруудын төрөл таарахгүй байна !!!
                </span>
                }

            </div>
        );
    }
}
