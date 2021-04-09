import React, { Component } from 'react';

import { service } from '../../service';


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
                defaultValue={props.default_value}
            >
                <option value=""> -- Property Сонгоно уу -- </option>
                {
                    props.properties.map((prop, idx) =>
                        <option key={idx} value={prop.property_id}>{prop.data_type_name}:  {prop.property_name}</option>
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
            table_id: props.match.params.table_id,
            fields: [],
            properties: [],
            columns: {},
            feature_code: props.feature_code,
            ano_db_table: props.ano_db_table,
            default_values: {},
        }
        this.getAttributes = this.getAttributes.bind(this)
        this.getProperties = this.getProperties.bind(this)
        this.setProperties = this.setProperties.bind(this)
        this.getValue = this.getValue.bind(this)
        this.saveMatch = this.saveMatch.bind(this)
    }

    componentDidMount() {
        const { feature_code, ano_db_table } = this.state
        if (ano_db_table.length === 0) {
            this.getProperties(feature_code)
        }
    }

    getProperties(feature_code, ano_db_table) {
        service
            .mssql_config
            .getProperties(feature_code)
            .then(({ success, properties }) => {
                if (success) {
                    if (ano_db_table) {
                        const default_values = this.parseString(ano_db_table['field_config'])
                        this.setState({ default_values, columns: default_values, feature_code, properties })
                    }
                    else {
                        this.setState({ properties })
                    }
                }
            })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selected_value != this.props.selected_value) {
            this.setState({ table_name: this.props.selected_value })
            this.getAttributes(this.props.selected_value)
        }
        if (prevProps.feature_code != this.props.feature_code) {
            this.setState({ feature_code: this.props.feature_code })
            this.getProperties(this.props.feature_code)
        }
        if (prevProps.ano_db_table != this.props.ano_db_table) {
            this.setState({ ano_db_table: this.props.ano_db_table })
            this.setProperties(this.props.ano_db_table)
        }
    }

    parseString(str_obj) {
        str_obj = str_obj.replaceAll("'", '"')
        const parsed = JSON.parse(str_obj)
        return parsed
    }

    setProperties(ano_db_table) {
        let feature_code = ano_db_table['feature_code']
        this.getProperties(feature_code, ano_db_table)
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
            delete columns[field_name]
        }
        else {
            columns[field_name] = property_id
        }
        this.setState({ columns })
    }

    saveMatch() {
        this.props.setLoading(true)
        const { table_name, columns, connection_id, feature_code, table_id } = this.state
        service
            .mssql_config
            .saveToDbTable(table_name, columns, connection_id, feature_code, table_id)
            .then(({ success }) => {
                if (success) {
                    this.props.setLoading(false)
                    this.props.setModal(
                        null,
                        '',
                        'Амжилттай хадгаллаа',
                        'fa fa-check-circle',
                        'success',
                        false,
                        null,
                        () => this.props.history.push(`/back/another-base/connection/mssql/${connection_id}/tables/`)
                    )
                }
            })
            .catch(() => {
                this.props.setLoading(false)
                this.props.setModal(
                    null,
                    '',
                    'Холболтонд алдааг гарсан байна',
                    'fa fa-check-circle',
                    'danger',
                    false,
                    null,
                    null,
                )
            })
    }

    render() {
        const { fields, properties, table_id, default_values, columns } = this.state
        console.log(columns);
        let default_values_keys = Object.keys(default_values)
        return (
            <div>
                {
                    fields.map((field, idx) =>
                        default_values_keys.length > 0
                        ?
                            default_values_keys.map((field_name, idx) => {
                                if (field_name == field) {
                                    return <Match key={idx}
                                                column_name={field}
                                                properties={properties}
                                                sendValue={this.getValue}
                                                default_value={default_values[field_name]}
                                            />
                                }
                            })
                        :
                            <Match key={idx}
                                column_name={field}
                                properties={properties}
                                sendValue={this.getValue}
                            />
                    )
                }
                {
                    fields.map((field, idx) =>
                        default_values_keys.length > 0
                        ?
                            !default_values_keys.includes(field)
                            &&
                                <Match key={idx}
                                    column_name={field}
                                    properties={properties}
                                    sendValue={this.getValue}
                                />
                        :
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
                            {
                                table_id
                                ?
                                    "Засах"
                                :
                                    "Хадгалах"
                            }
                        </button>
                }
            </div>
        );
    }
}

export default PropertyMatch;