import React, { Component } from 'react';

import { service } from '../../service';


const Match = (props) => {
    const is_display_value_types = ['text', 'multi-text', 'link', 'boolean']
    var data_id = []
    var is_included = false
    props.properties.map((row) => {
        if (data_id.length > 0) {
            is_included = false
            data_id.map((data_id) => {
                if (data_id == row.data_type_id) {
                    is_included = true
                }
            })
        }
        if (is_included == false) {
            data_id = data_id.concat(row.data_type_id)
        }
    })
    var list_options =[]
    data_id.map((data_id) => {
        list_options.push({
            data_type_name:'',
            data_type_id: data_id,
            children: [],
        })
    })
    props.properties.map((row) => {
        list_options.map((list_option, idx) => {
            if (list_option.data_type_id == row.data_type_id) {
                list_option.data_type_name=row.data_type_name
                list_option.children.push({
                    property_name: row.property_name,
                    property_id: row.property_id,
                })
            }
        })

    })
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
                    list_options.map((row, idx) =>
                        // is_display_value_types.includes(prop.value_type_id)
                        // &&

                            <optgroup key={idx} label={row.data_type_name}>

                                {row.children.map((next_row,idx) =>

                                    <option key={idx} value={next_row.property_id}>{next_row.property_name}</option>

                                )}

                            </optgroup>

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

    // componentDidMount() {
    //     const { feature_code, ano_db_table } = this.state
    //     if (Object.keys(ano_db_table).length === 0) {
    //         this.getProperties(feature_code)
    //     }
    // }

    getProperties(feature_code, ano_db_table) {
        service
            .mssql_config
            .getProperties(feature_code)
            .then(({ success, properties }) => {
                if (success) {
                    if (Object.keys(ano_db_table).length > 0) {
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
            if (this.props.feature_code) {
                this.getProperties(this.props.feature_code, this.props.ano_db_table)
            }
        }
        if (prevProps.ano_db_table != this.props.ano_db_table) {
            this.setState({ ano_db_table: this.props.ano_db_table })
            if (this.props.ano_db_table) {
                this.setProperties(this.props.ano_db_table)
            }
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
        let tb_id
        if (table_id) tb_id = table_id
        if (!table_id) tb_id = null
        service
            .mssql_config
            .saveToDbTable(table_name, columns, connection_id, feature_code, tb_id)
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
                    'Холболтонд алдаа гарсан байна',
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
                        &&
                            !default_values_keys.includes(field)
                            &&
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
