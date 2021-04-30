import React, { Component } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"
import SelectField from './selectField'

export default class  PgForm extends Component {

    constructor(props) {
        super(props);
        this.over_dec = []
        this.state = {
            id: props.match.params.id,
            table_id: props.match.params.table_id,
            table_name: '',
            themes: [],
            packages: [],
            features: [],
            feature_name: '',
            theme_name: '',
            package_name: '',
            selected_packages: [],
            selected_features: [],
            selected_dt_list: []
        }

        this.handleChange = this.handleChange.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.getFeatProperties = this.getFeatProperties.bind(this)
        // this.handleSetField = this.handleSetField.bind(this)
        // this.handleSave = this.handleSave.bind(this)
    }

    componentDidMount(){
        const {id, table_id} = this.state
        // if(table_id) this.handleGetDetial(id, table_id)
        this.getInspireTree(id)
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

    getInspireTree(id){
        service.pg_config.getInspireTree(id).then(({themes, packages, features}) => {
            this.setState({themes, packages, features})
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

    handleChange(name, e) {
        const { packages, features } = this.state
        const selected_value = e.target.value
        var data_list = {}
        var seleted_datas = []
        var array = []

        if ( name == 'theme' ) {
            data_list['theme_name'] = selected_value
            array = [...packages]
            seleted_datas = array.filter((data) => data.parent == selected_value)
            data_list['selected_packages'] = seleted_datas
        }

        else if ( name == 'package' ) {
            data_list['package_name'] = selected_value
            array = [...features]
            seleted_datas = array.filter((data) => data.parent == selected_value)
            data_list['selected_features'] = seleted_datas
        }
        else {
            data_list['feature_name'] = selected_value
        }

        this.setState({...data_list})
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name } = this.state
        if (pS.theme_name != theme_name) {
            if (!theme_name) {
                this.setState({selected_features: []})
            }
        }
        if (pS.feature_name != feature_name) {
            if (feature_name) this.getFeatProperties(feature_name)
        }
    }

    getFeatProperties(feature_code) {
        service.pg_config.getProperties(feature_code).then(({state_name, table_fields}) => {
            var fields = {}
            fields[state_name] = table_fields
            this.setState({ ...fields })
        })
    }

    handleSave(){
        const {id, table_id, matched_feilds, view_name, table_name, table_field_error} = this.state
        if (! table_field_error.length >0 && ! this.over_dec.length > 0){
            service.pg_config.tableSave(id, table_id, matched_feilds, view_name, table_name).then(({success}) => {
                if(success){
                    alert("Амжилттай хадгаллаа.")
                    this.props.history.push(`/back/db-export/connection/pg/${id}/tables/`)
                }
            })
        }
    }

    handleSetField(key, e){
        const { view_fields, table_fields, matched_feilds, table_field_error, old_error_name } = this.state
        var data = e.target.value
        var values = {
            'table_field': data,
            'view_field': view_fields[key].column_name
        }
        var joined = []
        var check = false
        var check_error = []
        var error_name = ''
        if(data) {
            if (matched_feilds.length > 0) {
                var value = obj => obj.view_field == view_fields[key].column_name
                var index_of = matched_feilds.findIndex(value)
                if (index_of != -1) {
                    matched_feilds[index_of]['table_field'] = data
                    joined = matched_feilds
                }
                else {
                    joined = matched_feilds.concat(values)
                }
            }
            else joined = matched_feilds.concat(values)

            var index = e.target.selectedIndex
            var optionElement = e.target.childNodes[index]
            var selected_data_type =  optionElement.getAttribute('name')
            error_name = table_field_error.filter(item => {
                return item.toLowerCase().includes(data.toLowerCase())
            })

            if ((view_fields[key].data_type.slice(0,4) != selected_data_type.slice(0,4))) {
                if (! error_name.length >0) {
                    check_error.push(data)
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
            check_error = []
        }
        this.setState({ matched_feilds: joined, selected_data_type, table_field_error: check_error, old_error_name })
    }


    render() {
        const {
            table_id, id,
            themes, theme_name, package_name,
            feature_name, selected_features,
            selected_packages
        } = this.state
        return (
            <div className="card">
                <div className="form-row card-body">
                    <div className="form-group col-md-4">
                        <label htmlFor="id_view_name">Хүснэгтийн нэр</label>
                        <input
                            className='form-control'
                        />
                    </div>
                </div>
                <div className="form-row p-4">
                    <SelectField
                        title_name='theme'
                        data_list={themes}
                        defualt_value={theme_name}
                        setSelect={this.handleChange}
                    />
                    <SelectField
                        title_name='package'
                        data_list={selected_packages}
                        defualt_value={package_name}
                        setSelect={this.handleChange}
                    />
                    <SelectField
                        title_name='feature'
                        data_list={selected_features}
                        defualt_value={feature_name}
                        setSelect={this.handleChange}
                    />
                </div>
                <BackButton
                    {...this.props}
                    name={'Буцах'}
                    navlink_url={`/back/db-export/connection/pg/${id}/tables/`}
                />
            </div>
        );
    }
}

