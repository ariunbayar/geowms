import React, { Component } from 'react';
import { service } from '../service';
import BackButton from "@utils/Button/BackButton"
import SelectField from './selectField'
import './style.css'
import Loader from "@utils/Loader"
import Modal from "@utils/Modal/Modal"

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
            selected_dt_list: [],
            data_type_list: [],
            id_list: [],
            alert_sms: false,
            message: '',
            is_loading: false,
            modal_status: 'closed',
        }

        this.handleChange = this.handleChange.bind(this)
        this.getInspireTree = this.getInspireTree.bind(this)
        this.getFeatProperties = this.getFeatProperties.bind(this)
        this.handleSetField = this.handleSetField.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.getArray = this.getArray.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)

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
        service.pg_config.getInspireTree(id).then(({themes, packages, features}) => {
            this.setState({themes, packages, features})
            if(table_id) this.handleGetDetial(packages, features)
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
        }

        else if ( name == 'package' ) {
            if (selected_value) {
                data_list['package_name'] = selected_value
                seleted_datas = this.getArray(features, selected_value)
                data_list['selected_features'] = seleted_datas

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
        const { theme_name, feature_name, packages, features } = this.state
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
        if(id_list.length){
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
            this.setState({alert_sms: false})
        }
        else {
            this.setState({alert_sms: true})
        }
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
    onMouseEnter(){
      this.setState({message:'Property сонгоогүй байна.'})
    }

    onMouseLeave(){
      this.setState({message:''})
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
            id_list, table_name, alert_sms,
            is_loading
        } = this.state
        return (
            <div className="card">
                <Loader
                    is_loading={is_loading}
                    text={'Уншиж байна'}
                />
                <div className="form-row card-body p-4 mx-1">
                    <div className="form-group col-md-4">
                        <label htmlFor="id_view_name">Хүснэгтийн нэр</label>
                        <input
                            className='form-control'
                            type='text'
                            value={table_name}
                            disabled={table_id ? true : false}
                            onChange={(e) => this.setState({table_name: e.target.value})}
                        />
                    </div>
                </div>
                <div className="form-row col-md-9 p-4 mx-1">
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
                {
                    feature_name &&
                    <div className="col-md-7 px-3">
                            <table className="table table-bordered m-1">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{width: "8%"}}>
                                            Data <br/>type
                                        </th>
                                        <th className="text-center" style={{width: "5%"}}>
                                        </th>
                                        <th className="text-center" style={{width: "15%"}}>
                                            Property
                                            <div
                                                type="button"
                                                onMouseEnter={() => this.onMouseEnter()}
                                                onMouseLeave={() => this.onMouseLeave()}
                                                className={`float right` + ` ${alert_sms ? "d-block" : "d-none" }`}
                                            >
                                                <i className="text-danger icon-exclamation  float-right blink">
                                                    <div className={`alert rounded position-absolute`+`${this.state.message ? " d-block" : " d-none"}`} style={{zIndex:'1'}}role="alert">
                                                        <h6 className="alert-heading"></h6>
                                                        <p> {this.state.message}</p>
                                                    </div>
                                                </i>
                                            </div>
                                        </th>
                                    </tr>
                                    {data_type_list.map((data_type, idx) =>
                                        <>
                                            <tr key={idx}>
                                                <th rowSpan={data_type.properties.length +1}
                                                    className="text-wrap align-middle text-justify m-4 pl-5"
                                                >
                                                    <span className="text-center align-middle">({data_type.data_type_name})</span><br/>
                                                    <span className="text-center align-middle">{data_type.data_type_eng}</span><br/>
                                                    <span className="text-justify text-muted align-middle"><small>{data_type.data_type_definition}</small></span>
                                                </th>
                                            </tr>
                                            {data_type.properties.map((property, idx) =>
                                                <>
                                                    <tr key={idx}>
                                                        <th className="d-flex justify-content-center">
                                                            <div className="icheck-primary">
                                                                <input
                                                                    name={property.property_name}
                                                                    id={property.property_name}
                                                                    type="checkbox"
                                                                    checked={id_list.indexOf(property.property_id) > -1}
                                                                    onChange={this.handleSetField}
                                                                    value={property.property_id}
                                                                />
                                                                <label
                                                                    htmlFor={property.property_name}
                                                                >
                                                            </label>
                                                            </div>
                                                        </th>
                                                        <th>
                                                            <label
                                                                data-toggle="tooltip" data-placement="right"
                                                                className="text-left"
                                                                style={{marginLeft: "4%"}}
                                                            >
                                                                {property.property_name}
                                                            </label>
                                                        </th>
                                                    </tr>
                                                </>
                                            )}
                                        </>
                                    )}
                                </thead>
                            </table>
                        </div>
                }
                <div className="form-row col-md-12 p-4 m-1">
                    <button
                        type="button"
                        className="btn gp-btn-primary"
                        onClick={this.handleSave}
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

