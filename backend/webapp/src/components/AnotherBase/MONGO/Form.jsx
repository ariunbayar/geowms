import React, { Component } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"

class FieldForm extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { data, properties, data_key } = this.props
        var data_id = []
        var is_included = false
        properties.map((row) => {
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
        properties.map((row) => {
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
            <div className="row mb-1 border-bottom pb-1">
                <div className="col-2">
                    {data.name_1}
                </div>
                <div className="col-2">
                    {data.name_2}
                </div>
                <div className="col-4">
                <select
                    value={data.real_name}
                    className="custom-select"
                    id="table_name"
                    onChange={(e) => this.props.handleSetField(data_key, e.target.value)}
                >
                    <option> -- Property Сонгоно уу -- </option>
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

                </div>
            </div>
        );
    }
}


class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            table_id: props.match.params.table_id,
            table_names: [
            ],
            selected_value: '',
            feature_value: '',
            features: [],
            field_names: [],
            properties: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.getTableNames = this.getTableNames.bind(this)
        this.getProperties = this.getProperties.bind(this)
        this.handleSetField = this.handleSetField.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount(){
        const {id, table_id} = this.state
        if(table_id) this.handleState(id, table_id)
        this.getTableNames(id)
    }

    handleState(id, table_id){
        service.mongo_config.tableConfig(id, table_id).then(({success, form_datas}) => {
            if(success){
                this.setState({
                    selected_value: form_datas.table_name,
                    feature_value: form_datas.feature_code,
                    field_names: form_datas.field_config,
                })
                this.getProperties(form_datas.feature_code)

            }
        })
    }

    getTableNames(id){
        service.mongo_config.tables(id).then(({success, table_names, features}) => {
            if(success) this.setState({table_names, features})
        })
    }

    getTableFields(name){
        const {id} = this.state
        service.mongo_config.fieldNames(id, name).then(({success, field_names}) => {
            if(success) this.setState({field_names})
        })
    }

    handleChange(name, e) {
        const selected_value = e.target.value
        this.setState({ [name]: selected_value })
        if(name == 'selected_value') this.getTableFields(selected_value)
        if(name == 'feature_value') this.getProperties(selected_value)

    }

    handleSave(){
        const {id, table_id, field_names, feature_value, selected_value} = this.state
        service.mongo_config.tableSave(id, table_id, field_names, selected_value, feature_value).then(({success}) => {
            if(success){
                alert("Амжилттай хадгаллаа.")
                this.props.history.push(`/back/another-base/connection/mongo/${id}/list/`)
            }
        })
    }

    getProperties(feature_code) {
        service
            .mssql_config
            .getProperties(feature_code)
            .then(({ success, properties }) => {
                if (success) {
                    this.setState({ properties })
                }
            })
    }

    handleSetField(key, data){
        const {field_names} = this.state
        var temp = field_names
        temp[key]['real_name'] = data
        this.setState({field_names: temp})

    }

    render() {
        const { table_names, selected_value, features, feature_value, field_names, properties, table_id, id } = this.state
        return (
            <div className="card">
                <div className="form-row card-body">
                    <div className="form-group">
                        <label htmlFor="table_name">Хүснэгтийн нэр</label>
                        <select
                            className="custom-select"
                            id="table_name"
                            onChange={(e) => this.handleChange('selected_value', e)}
                            value={selected_value}
                            disabled={table_id ? true : false}
                        >
                            <option value=""> -- Хүснэгтийн нэр сонгоно уу -- </option>
                            {
                                table_names.map((item, idx) =>
                                    <option key={idx} value={item}>{item}</option>
                                )
                            }
                        </select>
                        <label htmlFor="table_name mt-1">Feature нэр</label>
                        <select
                            className="custom-select"
                            id="table_name"
                            onChange={(e) => this.handleChange('feature_value', e)}
                            disabled={table_id ? true : false}
                            value={feature_value}
                        >
                            <option value=""> -- feature нэр сонгоно уу -- </option>
                            {
                                features.map((item, idx) =>
                                    <option key={idx} value={item.code}>{item.name}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                {(field_names && feature_value && properties && field_names.length > 0)  &&
                <div className="card-body">
                    <div className="row mb-1 border-bottom pb-1">
                        <div className="col-2">
                            Json obj нэр
                        </div>
                        <div className="col-2">

                            Json obj доторх Json obj нэр
                        </div>
                        <div className="col-4">
                            property сонгох
                        </div>
                    </div>
                    {field_names.map((data, idx) =>
                        <FieldForm
                            data_key={idx}
                            properties={properties}
                            data={data}
                            handleSetField={this.handleSetField}
                        />
                    )}
                    <a className="btn btn-primary text-white m-3" onClick={this.handleSave}>
                        Хадгалах
                    </a>
                </div>
                }
                <BackButton
                    {...this.props}
                    name={'Буцах'}
                    navlink_url={`/back/another-base/connection/mongo/${id}/list/`}
                />
            </div>
        );
    }
}

export default Form;
