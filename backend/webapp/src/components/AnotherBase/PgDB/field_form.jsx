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

    // componentDidUpdate(pP, pS) {
    //     const { data, selected_data_type, selected_field, setSelectedField } = this.props
    //     if (pP.setSelectedField != setSelectedField) {
    //         var field_type = ''
    //         if (setSelectedField) {
    //             if ( data.data_type.slice(0,4) != selected_data_type.slice(0,4) ) {
    //                 field_type = 'is-invalid'
    //             }
    //         }
    //         this.setState({field_class_name: field_type})
    //     }
    // }

    render() {
        const {
            property_data, selected_table_name, ano_table_fields,
            data_key, prop_key
        } = this.props
        const { field_class_name } = this.state
        return (
            <div className="
                    row d-flex justify-content-between"
                >
                    <span
                        className="col-md-6 m-1 border rounded"
                        name='inspire_property'
                    >
                        {property_data.property_name}
                    </span>
                    <select
                        name='table_field_name'
                        id='table_field_id'
                        className="form-control col-md-5 m-1"
                        value={selected_table_name}
                        onChange={(e) => this.props.handleSetField(data_key, prop_key, e)}
                    >
                        <option value=''></option>
                        {
                            ano_table_fields.map((value, idy) =>
                                <option key = {idy} value={value.column_name}>{value.column_name}</option>
                            )
                        }
                    </select>
                </div>
        );
    }
}