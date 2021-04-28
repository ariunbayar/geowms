import React, { Component } from 'react';

export default class FieldForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { data, table_fields, data_key, setSelectedField} = this.props

        return (
            <div className="col-md-12 mb-1 pb-1">
                <label className='col-md-4 d-inline-block'>
                    {data.column_name}
                </label>
                <select
                    value={setSelectedField}
                    className="form-control col-md-3 d-inline-block"
                    id="table_name"
                    onChange={(e) => this.props.handleSetField(data_key ,e.target.value)}
                >
                    <option>---Хүснэгтийн талбарыг сонгоно уу---</option>
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
