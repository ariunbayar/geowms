import React, { Component } from 'react';

export default class FieldForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { data, table_fields, data_key } = this.props
        return (
            <div className="row mb-1 border-bottom pb-1">
                <label>
                    {data.column_name}
                </label>
                <select
                    value={data.real_name}
                    className="custom-select"
                    id="table_name"
                    onChange={(e) => this.props.handleSetField(data_key ,e.target.value)}
                >
                    <option></option>
                    {
                        table_fields.map((row, idx) =>
                            <option key={idx} value={row.column_name}>{row.column_name}</option>
                        )
                    }
                </select>

            </div>
        );
    }
}
