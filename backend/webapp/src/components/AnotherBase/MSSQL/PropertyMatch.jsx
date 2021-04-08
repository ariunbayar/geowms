import React, { Component } from 'react';

import { service } from '../service';


const Match = (props) => {

    return (
        <div>
            <label htmlFor="">{props.column_name}: </label>
            <select
                name="" id=""
                className="form-control"
                onChange={(e) => {
                    props.sendValue(props.column_name, e.target.value)
                }}
            >
                <option value=""> -- Property Сонгоно уу -- </option>
                {
                    props.properties.map((prop, idx) =>
                        <option key={idx} value={prop.property_id}>{prop.property_name}</option>
                    )
                }
            </select>
            <br />
        </div>
    )
}


class PropertyMatch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            table_name: props.selected_value,
            connection_id: props.connection_id,
            fields: [],
            properties: [],
            columns: {},
        }
        this.getAttributes = this.getAttributes.bind(this)
        this.getProperties = this.getProperties.bind(this)
        this.getValue = this.getValue.bind(this)
        this.saveMatch = this.saveMatch.bind(this)
    }

    componentDidMount() {
        this.getProperties()
    }

    getProperties() {
        service
            .mssql_config
            .getProperties()
            .then(({ success, properties }) => {
                if (success) {
                    this.setState({ properties })
                }
            })

    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected_value != this.props.selected_value) {
            this.setState({ table_name: this.props.selected_value })
            this.getAttributes(this.props.selected_value)
        }
    }

    getAttributes(table_name) {
        const { connection_id } = this.state
        service
            .mssql_config
            .getAttributes(table_name, connection_id)
            .then(({ success, fields }) => {
                if (success) {
                    this.setState({ fields })
                }
            })
            .catch((e) => {
                alert("Холболтонд алдаа гарсан байна")
            })
    }

    getValue(field_name, property_id) {
        const { columns } = this.state
        if (property_id == '') {
            for (const item in columns) {
                if (columns[item] == field_name) {
                    delete columns[item]
                }
            }
        }
        else {
            columns[property_id] = field_name
        }
        this.setState({ columns })
    }

    saveMatch() {
        const { table_name, columns, connection_id } = this.state
        service
            .mssql_config
            .insertToInspire(table_name, columns, connection_id)
            .then(rsp => {
                console.log(rsp);
            })
    }

    render() {
        const { fields, properties } = this.state
        return (
            <div>
                {
                    fields.map((field, idx) =>
                        <Match key={idx}
                            column_name={field}
                            properties={properties}
                            sendValue={this.getValue}
                        />
                    )
                }
                {
                    fields.length > 0
                    &&
                        <button
                            type="button"
                            className="btn gp-btn-primary"
                            onClick={this.saveMatch}
                        >
                            Хадгалах
                        </button>
                }
            </div>
        );
    }
}

export default PropertyMatch;