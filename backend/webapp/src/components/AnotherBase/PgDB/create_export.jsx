import React, { Component, Fragment } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"
import SelectField from '@utils/Tools/Form/select_field'
import Loader from "@utils/Loader"
import Modal from "@utils/Modal/Modal"
import FieldForm from './field_form'
import SelectOption from './components/selectOptions'
import {GPIcon} from "@utils/Tools"
import { listenOnce } from 'ol/events';


export default class  ExportCreate extends Component {

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
            selected_dt_list: [],
            data_type_list: [],
            id_list: [],
            message: 'Property сонгоогүй байна.',
            is_loading: false,
            modal_status: 'closed',
            ano_table_names: [],
            ano_table_fields: [],
            table_field_name: '',
            matched_feilds: [],
            check_data_type:false,
            check_error: [],
            pk_field_name: "",
            pk_start_index: '',
            pk_field_type: "",
            pk_field_count: "",
            pk_field_max_range: "",
            checked_choices: [],
            checked_datas: [],
            check_ids: [],
            data_list: [
                {
                    'id': 1,
                    'name': 'Дата хооронд',
                    'eng_name': 'between',
                    'keys': [1, 2]
                },
                {
                    'id': 2,
                    'name': 'Эхлэх эхний утгаар',
                    'eng_name': 'since one of data',
                    'keys': [1]
                },
                {
                    'id': 3,
                    'name': 'Төгсөх сүүлийн утгаар',
                    'eng_name': 'until one of data',
                    'keys': [2]
                },
                {
                    'id': 4,
                    'name': 'Оруулах өгөгдлийн тоо хэмжээгээр',
                    'eng_name': 'limit',
                    'keys': [3]
                },
            ],
            choice_datas: [
                {
                    'name': 'Дата-ны эхлэх утга',
                    'eng_name': 'pk_start_index',
                    'value': '',
                    'key': 1
                },
                {
                    'name': 'Дата-ны эцсийн утга',
                    'eng_name': 'pk_field_max_range',
                    'key': 2,
                    'value': '',
                },
                {
                    'name': 'Оруулах өгөгдлийн тоо хэмжээ',
                    'eng_name': 'pk_field_count',
                    'key': 3,
                    'value': '',
                },
            ],
        }

        this.handleChange = this.handleChange.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.getFeatProperties = this.getFeatProperties.bind(this)
        this.handleSetField = this.handleSetField.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.getArray = this.getArray.bind(this)
        this.getTableFields = this.getTableFields.bind(this)

        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.setSelectedField = this.setSelectedField.bind(this)
        this.dataTypeValidation = this.dataTypeValidation.bind(this)
        this.getFilterType = this.getFilterType.bind(this)
        this.setSelectedOptions = this.setSelectedOptions.bind(this)
    }

    componentDidMount(){
        const {id} = this.state
        this.getInspireTree(id)
    }

    handleGetDetial( packages, features ){
        const {table_id, id} = this.state
        this.setState({ is_loading: true })
        service.pg_config.tableDetail(id, table_id, true).then(({success, form_datas}) => {
            if(success){
                form_datas['selected_packages'] = this.getArray(packages, form_datas.theme_name)
                form_datas['selected_features'] = this.getArray(features, form_datas.package_name)
                form_datas['matched_feilds'] = form_datas.id_list
                form_datas['pk_field_name'] = form_datas.pk_field_name
                form_datas['pk_start_index'] = form_datas.pk_start_index
                form_datas['pk_field_type'] = form_datas.pk_field_type
                form_datas['pk_field_count'] = form_datas.pk_field_count
                form_datas['pk_field_max_range'] = form_datas.pk_field_max_range
                this.setState({ ...form_datas, is_loading: false })
            }
        })
    }

    getInspireTree(id){
        const {table_id} = this.state
        Promise.all([
            service.pg_config.getAnotherPgDetail(id),
            service.pg_config.getInspireTree(id),
        ]).then(([{table_names}, {themes, packages, features}]) => {
            this.setState({themes, packages, features, ano_table_names: table_names})
            if(table_id) this.handleGetDetial(packages, features)
        })

    }

    getTableFields(table_name){
        const {id, matched_feilds} = this.state
        service.pg_config.fieldNames(id, table_name).then(({fields}) => {
            var value = obj => obj.data_type.slice(0,4) == 'geom'
            var index_of = fields.findIndex(value)
            if(index_of != -1)
                var geom_field_name = fields[index_of].column_name
            if (fields)
            {
                this.setState({ano_table_fields: fields, geo_data_field: geom_field_name,
            })
        }
        })
    }

    getArray(data, selected_value) {
        var array = [...data]
        var seleted_datas = array.filter((data) => data.parent == selected_value)
        return seleted_datas
    }

    handleChange(name, selection) {
        const { packages, features } = this.state
        var selected_value = ''
        var data_list = {}
        var seleted_datas = []
        if (name == 'pk_field_name') {
            data_list['pk_field_name'] = selection.column_name
            data_list['pk_field_type'] = selection.data_type
        }

        if (name == 'choice_datas') {
            var data = e.target.value
            var table_data = e.target.selectedIndex
            var optionElement = e.target.childNodes[table_data]
            var selected_data_name =  optionElement.getAttribute('id')
            data_list[selected_data_name] = data
        }

        else{
            selected_value = selection.code
            if ( name == 'theme' ) {
                data_list['theme_name'] = selected_value
                seleted_datas = this.getArray(packages, selected_value)
                data_list['selected_packages'] = seleted_datas
                data_list['feature_name'] = ''
                data_list['matched_feilds'] = []
                data_list['selected_features'] = []
            }

            else if ( name == 'package' ) {
                if (selected_value) {
                    data_list['package_name'] = selected_value
                    seleted_datas = this.getArray(features, selected_value)
                    data_list['selected_features'] = seleted_datas
                    data_list['feature_name'] = ''
                    data_list['matched_feilds'] = []
                }
                else {
                    data_list['feature_name'] = ''
                    data_list['selected_features'] = []
                }
            }

            else {
                data_list['feature_name'] = selected_value
            }

            if (! selected_value) {
                // data_list['selected_features'] = []
                data_list['feature_name'] = ''
            }
        }
        this.setState({ ...data_list })
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name, packages, features, table_name} = this.state
        if (pS.feature_name != feature_name) {
            if (feature_name) this.getFeatProperties(feature_name)
            else this.setState({feature_name, matched_feilds: []})
        }

        if (pS.packages != packages) {
            this.setState({packages})
        }

        if (pS.features != features) {
            this.setState({features})
        }

        if (pS.table_name != table_name) {
            this.getTableFields(table_name)
        }
    }

    getFeatProperties(feature_code) {
        this.setState({ is_loading: true })
        service.pg_config.getProperties(feature_code).then(({data_type_list}) => {
            if (data_type_list && data_type_list.length > 0) {
                this.setState({ data_type_list, is_loading: false })
            }
        })
    }

    handleSave(){
        const {
            id, table_id, table_name, matched_feilds,
            feature_name, geo_data_field, pk_field_name,
            pk_start_index, pk_field_type, pk_field_count,
            pk_field_max_range
        } = this.state
            this.setState({ is_loading: true })
            var pk_field_config = {
                "pk_field_name": pk_field_name,
                "pk_start_index": pk_start_index,
                "pk_field_type": pk_field_type,
                "pk_field_count": pk_field_count,
                "pk_field_max_range": pk_field_max_range,
            }

            var values = {
                'table_field': geo_data_field,
                'property_id': 'geo_datas',
                'data_type': 'geom'
            }

            var all_fields = matched_feilds.concat(values)
            service.pg_config.tableSave(id, table_id, all_fields, feature_name, table_name, true, pk_field_config).then(({success, info}) => {
                this.setState({ is_loading: false })
                if(success){
                    this.modalChange(
                        'fa fa-check-circle',
                        'success',
                        info,
                        false,
                        () => this.props.history.push(`/back/another-base/connection/pg/${id}/list/`)
                    )
                }
                else {
                    this.modalChange(
                        'fa fa-exclamation-circle',
                        'warning',
                        info,
                        false,
                        null
                    )
                }
            })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title, has_button, modalClose) {
        this.setState(
            {
                modal_icon,
                icon_color,
                title,
                has_button,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    handleSetField(data_key, prop_key, e){
        const { data_type_list, table_fields, matched_feilds } = this.state
        var data = e.target.value
        var table_data = e.target.selectedIndex
        var optionElement = e.target.childNodes[table_data]
        var selected_data_type =  optionElement.getAttribute('name')
        var selected_id =  optionElement.getAttribute('id')
        this.dataTypeValidation(prop_key, data_key, selected_id)

        var values = {
            'table_field': data,
            'table_data_type': selected_data_type,
            'property_id': data_type_list[data_key].properties[prop_key].property_id
        }
        var joined = []
        if(data) {
            if (matched_feilds.length > 0) {
                var value = obj => obj.property_id == data_type_list[data_key].properties[prop_key].property_id
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
        }
        else {
            var array = [...matched_feilds]
            for (let [i, layer] of array.entries()) {
                if (layer.property_id == data_type_list[data_key].properties[prop_key].property_id) {
                    array.splice(i, 1);
                }
            }
            joined = array
        }

        this.setState({matched_feilds: joined})
    }

    setSelectedField(data) {
        const { matched_feilds } = this.state
        var selected_field = ''
        if (Object.keys(matched_feilds).length > 0) {
                var field_of_data = obj => obj.property_id == data.property_id
                var index_of = matched_feilds.findIndex(field_of_data)
                if (index_of != -1) {
                    selected_field = matched_feilds[index_of].table_field
                }
        }
        return selected_field
    }

    dataTypeValidation(prop_key, data_key, index){
        const {data_type_list, ano_table_fields, check_error} = this.state
        var type=false
        var prop_id = data_type_list[data_key].properties[prop_key].property_id
        var list_check_error = [...check_error]
        var check_data_type = list_check_error.indexOf(prop_id)
        if (index) {
            var prop_data_type = data_type_list[data_key].properties[prop_key].value_type_id
            var table_data_type = ano_table_fields[parseInt(index)].data_type.slice(0,4)
            if (prop_data_type != table_data_type) {
                type = true
                if (table_data_type == 'text' && prop_data_type =='char') type = false
                else if (table_data_type == 'date' && prop_data_type =='time') type = false
                else if (table_data_type == 'nume' && prop_data_type =='inte') type = false
                else if (table_data_type == 'inte' && prop_data_type =='char') type = false
                else {
                    if (check_data_type && check_data_type == -1) {
                        list_check_error.push(prop_id)
                    }
                }
            }
            else {
                type = false
            }
        }
        else
            type=false


        data_type_list[data_key].properties[prop_key]['form_state'] = type

        if (!type){
            if (check_data_type > -1) {
                list_check_error = list_check_error.filter((val) => val != prop_id)
            }
        }
        this.setState({
            ...data_type_list,
            check_error: list_check_error
        })
    }

    setSelectedOptions(lists, e) {
        var { choice_datas, data_list, checked_datas } = this.state
        var value = ''
        var checked_datas = []
        lists.forEach(element => {
            value = obj => obj.id == element
            var index_of = data_list.findIndex(value)
            var data_keys = data_list[index_of].keys
            data_keys.forEach(data_key => {
                value = obj => obj.key == data_key
                var index_of_checked = checked_datas.findIndex(value)
                if (index_of_checked < 0)  {
                    var index_of_checked = choice_datas.findIndex(value)
                    checked_datas.push(choice_datas[index_of_checked])
                }
            });
        });

        this.setState({checked_datas})

    }

    getFilterType() {
        const { data_list, check_ids } = this.state
        var modal = {}
        modal['modal_status'] = 'open'
        modal['text'] = () => <SelectOption data_list={data_list} setSelectedOptions={this.setSelectedOptions}/>
        global.MODAL(modal)
    }

    render() {
        const {
            table_id, id,
            themes, theme_name, package_name,
            feature_name, selected_features,
            selected_packages, data_type_list,
            table_name, is_loading,
            ano_table_names, ano_table_fields,
            matched_feilds, geo_data_field,
            check_error, checked_datas, pk_field_name
        } = this.state
        return (
            <div className="card p-2">
                <Loader
                    is_loading={is_loading}
                    text={'Уншиж байна'}
                />
                <div className="form-row p-4 mx-1">
                    <div className="form-group col-md-6">
                        <label htmlFor='ano_table_name'>Хүснэгтүүд</label>
                            <select
                                name='table_name'
                                id='ano_table_name_id'
                                className="form-control col-md-6"
                                value={table_name}
                                disabled={table_id ? true : false}
                                onChange={(e) => {this.setState({table_name: e.target.value})}}
                            >
                                <option value=''></option>
                                {
                                    ano_table_names.map((value, idy) =>
                                        <option key = {idy} value={value.table_name}>{value.table_name}</option>
                                    )
                                }
                            </select>
                    </div>
                </div>
                <div className="form-row col-md-12 p-4 mx-1">
                    <SelectField
                        state_name='theme'
                        label="Theme"
                        option_name = "name"
                        option_key = "code"
                        data_list={themes}
                        default_value={theme_name}
                        className={"col-md-4"}
                        default_text={'theme-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <SelectField
                        state_name='package'
                        label="package"
                        option_name = "name"
                        option_key = "code"
                        data_list={selected_packages}
                        default_value={package_name}
                        className={"col-md-4"}
                        default_text={'package-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <SelectField
                        state_name='feature'
                        label="feature"
                        data_list={selected_features}
                        option_name = "name"
                        option_key = "code"
                        default_value={feature_name}
                        className={"col-md-4"}
                        default_text={'feature-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                </div>
                {
                    feature_name &&
                    <div className="col-md-12 px-3 mt-5">
                        <div className='row'>
                            <div className='col-md-3'>
                            </div>
                            <div className='col-md-9 px-0'>
                                <div className='row d-flex mr-3'>
                                    <span
                                        className="col-md-6 m-1 border rounded mr-auto"
                                        name='inspire_property'
                                    >
                                        Геометр талбар
                                    </span>&nbsp;
                                    <span
                                        className={"col-md-5 m-1 border rounded form-control" + ( !geo_data_field ? ' is-invalid border-danger' : '')}
                                        name='inspire_property'
                                        title={!geo_data_field ? 'Геометр талбаргүй хүснэгт байна !!!': ''}
                                    >
                                        {geo_data_field}
                                    </span>
                                </div>
                                <div className="row d-flex mr-4 justify-content-center">
                                    <a
                                        className="text-primary"
                                        onClick={this.getFilterType}
                                    >
                                        <GPIcon icon={"fa fa-plus-circle mx-1 text-primary mt-2"}/>
                                        шүүлтүүр нэмэх
                                    </a>
                                </div>
                                {
                                    checked_datas && checked_datas.length >0 ?
                                    <Fragment>
                                        <div className='row d-flex mr-3'>
                                            <span
                                                className="col-md-6 m-1 border rounded mr-auto"
                                                name='inspire_property'
                                            >
                                                Давтагдашгүй талбар
                                            </span>&nbsp;
                                            <SelectField
                                                state_name='pk_field_name'
                                                data_list={ano_table_fields}
                                                option_name = "data_type"
                                                option_key = "column_name"
                                                option_text = 'column_name'
                                                default_value={pk_field_name}
                                                className={"d-flex col-md-5 m-1 p-0 align-items-middle"}
                                                handleSelectField={this.handleChange}
                                            />
                                        </div>
                                        {
                                            checked_datas.map((data, idx) =>
                                            <div className='row d-flex mr-3'>
                                                <span
                                                    className="col-md-6 m-1 border rounded mr-auto"
                                                    name='inspire_property'
                                                >
                                                    {data.name}
                                                </span>&nbsp;
                                                <input
                                                    name='choice_datas'
                                                    type="text"
                                                    id={data.eng_name}
                                                    value={data.value}
                                                    className={`form-control col-md-5 m-1 `}
                                                    handleChange={(e) => { this.handleChange('choice_datas', e) }}
                                                >
                                                </input>
                                            </div>
                                            )
                                        }
                                    </Fragment>
                                    : null
                                }
                            </div>
                        </div>
                        <hr />
                    {
                        data_type_list && data_type_list.length > 0
                        ?
                            data_type_list.map((data_type_data, idx) =>
                                <Fragment key={idx}>
                                    <div className="form-row mr-3">
                                        <div className='form-group col-md-3 align-self-center text-center px-2 '>
                                            <b className="text-wrap">{data_type_data.data_type_name}</b><br/>
                                            <small className="text-center">({data_type_data.data_type_definition})</small>
                                        </div>
                                        <div className='form-group col-md-9'>
                                            {
                                                data_type_data.properties && data_type_data.properties.length > 0
                                                ?
                                                    data_type_data.properties.map((property_data, idy) =>
                                                        <FieldForm key={idy}
                                                            data_key={idx}
                                                            prop_key={idy}
                                                            property_data={property_data}
                                                            ano_table_fields={ano_table_fields}
                                                            handleSetField={this.handleSetField}
                                                            dataTypeValidation={this.dataTypeValidation}
                                                            setSelectedField={this.setSelectedField(property_data)}
                                                        />
                                                    )
                                                :
                                                    null
                                            }
                                        </div>
                                    </div>
                                    <hr />
                                </Fragment>
                            )
                        : null
                    }
                    </div>
                }
                <div className="form-row col-md-12 p-4 m-1">
                    <button
                        type="button"
                        className="btn gp-btn-primary"
                        onClick={this.handleSave}
                        disabled={
                            (!table_name || matched_feilds.length < 0 || check_error.length >0 || ! geo_data_field ) ? true : false
                        }
                    >
                        {
                            table_id
                            ?
                                "Засах"
                            :
                                "Хадгалах"
                        }
                    </button>
                    <Modal
                        modal_status={ this.state.modal_status }
                        modal_icon={ this.state.modal_icon }
                        icon_color={ this.state.icon_color }
                        title={ this.state.title }
                        has_button={ this.state.has_button }
                        modalClose={ this.state.modalClose }
                    />
                </div>
                <BackButton
                    {...this.props}
                    name={'Буцах'}
                    navlink_url={`/back/another-base/connection/pg/${id}/list/`}
                />
            </div>
        );
    }
}

