import React, { Component } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"
import SelectField from '@utils/Tools/Form/select_field'
import Loader from "@utils/Loader"
import Modal from "@utils/Modal/Modal"
import { checkedFonts } from 'ol/render/canvas';

export default class  ExportCreate extends Component {

    constructor(props) {
        super(props);
        this.over_dec = []
        this.state = {
            id: props.match.params.id,
            table_id: props.match.params.tsable_id,
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
            ano_table_fields: []
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
    }

    componentDidMount(){
        const {id} = this.state
        this.getInspireTree(id)
    }

    handleGetDetial( packages, features ){
        const {table_id, id} = this.state
        this.setState({ is_loading: true })
        service.pg_config.tableDetail(id, table_id).then(({success, form_datas}) => {
            if(success){
                form_datas['selected_packages'] = this.getArray(packages, form_datas.theme_name)
                form_datas['selected_features'] = this.getArray(features, form_datas.package_name)
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
        const {id} = this.state
        service.pg_config.fieldNames(id, table_name).then(({fields}) => {
            if (fields) this.setState({ano_table_fields: fields})
        })
    }

    getArray(data, selected_value) {
        var array = [...data]
        var seleted_datas = array.filter((data) => data.parent == selected_value)
        return seleted_datas
    }

    handleChange(name, e) {
        const { packages, features } = this.state
        const selected_value = e.target.value
        var data_list = {}
        var seleted_datas = []
        var array = []

        if ( name == 'theme' ) {
            data_list['theme_name'] = selected_value
            seleted_datas = this.getArray(packages, selected_value)
            data_list['selected_packages'] = seleted_datas
            data_list['feature_name'] = ''
            data_list['id_list'] = []
        }

        else if ( name == 'package' ) {
            if (selected_value) {
                data_list['package_name'] = selected_value
                seleted_datas = this.getArray(features, selected_value)
                data_list['selected_features'] = seleted_datas
                data_list['id_list'] = []

            }
            else {
                data_list['feature_name'] = ''
            }
        }
        else {
            data_list['feature_name'] = selected_value
        }

        if (! selected_value) {
            data_list['selected_features'] = []
            data_list['feature_name'] = ''
        }

        this.setState({ ...data_list })
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name, packages, features, table_name} = this.state
        if (pS.feature_name != feature_name) {
            if (feature_name) this.getFeatProperties(feature_name)
            else this.setState({feature_name})
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
        const {id, table_id, table_name, id_list, feature_name} = this.state
            this.setState({ is_loading: true })
            service.pg_config.tableSave(id, table_id, id_list, feature_name, table_name).then(({success, info}) => {
                this.setState({ is_loading: false })
                if(success){
                    this.modalChange(
                        'fa fa-check-circle',
                        'success',
                        info,
                        false,
                        () => this.props.history.push(`/back/db-export/connection/pg/${id}/tables/`)
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

    handleSetField(e){
        let id_list = this.state.id_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            id_list.push(value)
        } else {
            id_list = id_list.filter((oid) => oid != value)
        }
        this.setState({id_list})
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

    render() {
        const {
            table_id, id,
            themes, theme_name, package_name,
            feature_name, selected_features,
            selected_packages, data_type_list,
            id_list, table_name, is_loading,
            ano_table_names
        } = this.state
        return (
            <div className="card">
                <Loader
                    is_loading={is_loading}
                    text={'Уншиж байна'}
                />
                <div className="form-row card-body p-4 mx-1">
                    <div className="form-group col-md-4">
                        <label htmlFor='ano_table_name'>Хүснэгтүүд</label>
                            <select
                                name='table_name'
                                id='ano_table_name_id'
                                className="form-control col-md-6"
                                value={table_name}
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
                <div className="form-row col-md-9 p-4 mx-1">
                    <SelectField
                        title_name='theme'
                        data_list={themes}
                        defualt_value={theme_name}
                        defualt_text={'theme-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <SelectField
                        title_name='package'
                        data_list={selected_packages}
                        defualt_value={package_name}
                        defualt_text={'package-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                    <SelectField
                        title_name='feature'
                        data_list={selected_features}
                        defualt_value={feature_name}
                        defualt_text={'feature-ийн нэр сонгоно уу'}
                        handleSelectField={this.handleChange}
                    />
                </div>
                {
                    // feature_name &&
                    // <div className="col-md-7 px-3">
                    //     <SelectField
                    //         title_name={data_type.data_type_definition}
                    //         data_list={data_type.properties}
                    //         defualt_value={''}
                    //         defualt_text={'feature-ийн нэр сонгоно уу'}
                    //         handleSelectField={this.handleChange}
                    //     />
                    // </div>
                }
                <div className="form-row col-md-12 p-4 m-1">
                    <button
                        type="button"
                        className="btn gp-btn-primary"
                        onClick={this.handleSave}
                        disabled={ (!table_name || id_list.length < 1) ? true : false}
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
                    navlink_url={`/back/db-export/connection/pg/${id}/tables/`}
                />
            </div>
        );
    }
}

