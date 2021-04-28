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
            selected_data_type: '',
            table_field_error: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.getViewNames = this.getViewNames.bind(this)
        this.handleSetField = this.handleSetField.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.setSelectedField = this.setSelectedField.bind(this)
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
        const {id, table_id, matched_feilds, view_name, table_name, table_field_error} = this.state
        if (! table_field_error.length >0){
            service.pg_config.tableSave(id, table_id, matched_feilds, view_name, table_name).then(({success}) => {
                if(success){
                    alert("Амжилттай хадгаллаа.")
                    this.props.history.push(`/back/db-export/connection/pg/${id}/tables/`)
                }
            })
        }
    }

    handleSetField(key, e){
        const { view_fields, table_fields, matched_feilds, table_field_error} = this.state
        var data = e.target.value
        var values = {
            'table_field': data,
            'view_field': view_fields[key].column_name
        }
        var joined = []
        var check = false
        var check_error = [...table_field_error]
        if(data) {
            if (matched_feilds.length > 0) {
                if (matched_feilds.length > 0) {
                            var value = obj => obj.view_field == view_fields[key].column_name
                            var index_of = matched_feilds.findIndex(value)
                            if (index_of != -1) {
                                matched_feilds[index_of]['table_field'] = data
                                joined = matched_feilds
                            }
                            else joined = matched_feilds.concat(values)
                    }
                    else joined = matched_feilds.concat(values)
            }

            var index = e.target.selectedIndex
            var optionElement = e.target.childNodes[index]
            var selected_data_type =  optionElement.getAttribute('name')
            var error_name = table_field_error.filter(item => {
                return item.toLowerCase().includes(table_fields[key].column_name.toLowerCase())
            })

            if ((table_fields[key].data_type.slice(0,4) != selected_data_type.slice(0,4))) {
                if (! error_name.length >0) {
                    check_error.push(table_fields[key].column_name)
                }
            }
            else {
                check = true
            }

        }
        else {
            var array = [...matched_feilds]
            for (let [i, layer] of array.entries()) {
                if (layer.view_field == view_fields[key].column_name) {
                    array.splice(i, 1);
                }
            }
            joined = array
        }

        if (check || !data) {
            check_error = table_field_error.filter((field_error) => field_error != table_fields[key].column_name)
        }
        this.setState({ matched_feilds: joined, selected_data_type, table_field_error: check_error})

        // if (matched_feilds.length > 0) {
        //         var value = obj => obj.view_field == view_fields[key].column_name
        //         var index_of = matched_feilds.findIndex(value)
        //         if (data) {
        //             if (index_of != -1) {
        //                 matched_feilds[index_of]['table_field'] = data
        //                 joined = matched_feilds
        //             }
        //             else joined = matched_feilds.concat(values)
        //         }
        //         else {
        //             var array = [...matched_feilds]
        //             for (let [i, layer] of array.entries()) {
        //                 if (layer.view_field == view_fields[key].column_name) {
        //                     array.splice(i, 1);
        //                 }
        //             }
        //             joined = array
        //         }
        // }
        // else joined = matched_feilds.concat(values)



        // var check_error = []
        // if (view_fields[key].data_type.slice(0,4) != selected_data_type.slice(0,4) ) {
        //     check_error.push(data)
        // }
        // else {
        //     check_error = table_field_error.filter((field_error) => field_error != data)
        // }

    }

    setSelectedField(data) {
        const { matched_feilds } = this.state
        var selected_field = ''
        if (Object.keys(matched_feilds).length > 0) {
                var field_of_data = obj => obj.view_field == data.column_name
                var index_of = matched_feilds.findIndex(field_of_data)
                if (index_of != -1) {
                    selected_field = matched_feilds[index_of].table_field
                }
        }
        return selected_field
    }

    render() {
        const {
            table_names, table_id, id,
            table_name, view_name,
            view_names, view_fields,
            table_fields, matched_feilds,
            selected_data_type, table_field_error
        } = this.state
        return (
            <div className="card">
                <div className="form-row card-body">
                    <div className="form-group col-md-4">
                        <label htmlFor="id_view_name">Veiw-ийн нэр</label>
                        <select
                            className="form-control"
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
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="id_table_name mt-1">Хүснэгтийн нэр</label>
                        <select
                            className="form-control"
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
                            matched_feilds={matched_feilds}
                            handleSetField={this.handleSetField}
                            setSelectedField={this.setSelectedField(data)}
                            selected_data_type={selected_data_type}
                        />
                    )}
                    <a
                        className="btn btn-primary text-white m-3"
                        disabled={table_field_error.length > 0}
                        onClick={this.handleSave}
                    >
                        {table_field_error.length > 0 && <i className="fa fa-spinner fa-spin"></i>}
                        {table_field_error.length > 0 && <a className="text-light">Алдаатай байна.</a>}
                        {!table_field_error.length > 0 && 'Хадгалах' }
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

