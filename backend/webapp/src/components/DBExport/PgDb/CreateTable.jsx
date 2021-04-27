import React, { Component } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"
import FieldForm from "./fieldForm"

export default class  PgForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            table_id: props.match.params.table_id,
            table_names: [],
            view_names: [],
            table_name: '',
            view_name: '',
            view_fields: [],
            table_fields: [],
            matched_feilds: [],
        }

        this.handleChange = this.handleChange.bind(this)
        this.getViewNames = this.getViewNames.bind(this)
        this.handleSetField = this.handleSetField.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount(){
        const {id, table_id} = this.state
        if(table_id) this.handleGetDetial(id, table_id)
        this.getViewNames(id)
    }

    handleGetDetial(id, table_id){
        service.pg_config.tableDetail(id, table_id).then(({success, form_datas}) => {
            if(success){
                this.setState({
                    table_name: form_datas.table_name,
                    view_name: form_datas.feature_code,
                    matched_feilds: form_datas.field_config,
                    view_fields: form_datas.view_fields,
                    table_fields: form_datas.table_field_names
                })
            }
        })
    }

    getViewNames(id){
        service.pg_config.getViewNames(id).then(({view_names, table_names}) => {
            this.setState({view_names, table_names})
        })
    }

    getTableFields(name, value){
        const {id} = this.state
        service.pg_config.fieldNames(id, name, value).then(({state_name, table_fields}) => {
            var fields = {}
            fields[state_name] = table_fields
            this.setState({ ...fields })
        })
    }

    handleChange(e) {
        const selected_value = e.target.value
        var name = e.target.name
        this.setState({ [name]: selected_value })
        this.getTableFields(name, selected_value)

    }

    handleSave(){
        const {id, table_id, matched_feilds, view_name, table_name} = this.state
        service.pg_config.tableSave(id, table_id, matched_feilds, view_name, table_name).then(({success}) => {
            if(success){
                alert("Амжилттай хадгаллаа.")
                this.props.history.push(`/back/db-export/connection/pg/${id}/tables/`)
            }
        })
    }

    handleSetField(key, data){
        console.log("iish irsen")
        const { view_fields, table_fields, matched_feilds } = this.state
        var values = {
            'table_field': data,
            'view_field': view_fields[key].column_name
        }
        var joined = matched_feilds.concat(values)
        this.setState({ matched_feilds: joined})
    }

    render() {
        const {
            table_names, table_id, id,
            table_name, view_name,
            view_names, view_fields,
            table_fields, matched_feilds
        } = this.state
        console.log("veiw", view_fields)
        console.log("table", table_fields)
        return (
            <div className="card">
                <div className="form-row card-body">
                    <div className="form-group">
                        <label htmlFor="id_view_name">Veiw-ийн нэр</label>
                        <select
                            className="custom-select"
                            name='view_name'
                            id="id_view_name"
                            onChange={(e) => this.handleChange(e)}
                            value={view_name}
                            disabled={table_id ? true : false}
                        >
                            <option value=""> -- View-ийн нэр сонгоно уу -- </option>
                            {
                                view_names.map((item, idx) =>
                                    <option key={idx} value={item.relname}>{item.relname}</option>
                                )
                            }
                        </select>
                        <label htmlFor="id_table_name mt-1">Хүснэгтийн нэр</label>
                        <select
                            className="custom-select"
                            id="id_table_name"
                            name='table_name'
                            onChange={(e) => this.handleChange(e)}
                            disabled={table_id ? true : false}
                            value={table_name}
                        >
                            <option value=""> -- Хүснэгтийн нэр сонгоно уу -- </option>
                            {
                                table_names.map((item, idx) =>
                                    <option key={idx} value={item.table_name}>{item.table_name}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                {
                (view_fields && table_fields)
                &&
                <div className="card-body">
                    {view_fields.map((data, idx) =>
                        <FieldForm
                            data_key={idx}
                            table_fields={table_fields}
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
                    navlink_url={`/back/db-export/connection/pg/${id}/tables/`}
                />
            </div>
        );
    }
}

