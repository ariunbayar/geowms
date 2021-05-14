import React, { Component } from 'react';

export default class FieldForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const {
            property_data, setSelectedField, ano_table_fields,
            data_key, prop_key
        } = this.props
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
                        className={`form-control col-md-5 m-1 ${property_data.form_state ? "border-danger" : ''}`}
                        value={setSelectedField}
                        onChange={(e) => this.props.handleSetField( data_key, prop_key, e)}
                    >
                        <option value=''></option>
                        {
                            (ano_table_fields && Object.keys(ano_table_fields).length >0)
                            &&
                            ano_table_fields.map((value, idy) =>
                                <option
                                    key = {idy}
                                    value={value.column_name}
                                    name = {value.data_type}
                                    id = {idy}
                            >{value.column_name}</option>
                            )
                        }
                    </select>
                </div>
        );
    }
}
