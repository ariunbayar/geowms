import React, { Component, Fragment } from 'react'

import Loader from "@utils/Loader"
import Modal from "@utils/Modal/Modal"
import ChooseStyle from './ChooseStyle'
import SetTileCache from './setTileCache'
import ImportTemplate from './components/ImportTemplate'

import './styles.css'
import { service } from './service'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            id_list: props.id_list || [],
            open_datas: [],
            save_is_load: false,
            modal_status: 'closed',
            view: '',
            style_names: props.style_names,
            url: props.url,
            defualt_url: props.defualt_url,
            geom_type: props.geom_type,
            is_loading: props.property_loading,
            tile_cache_check: false,
            check_list: props.check_list,
            check_open: props.check_open,
            is_loading: false,
            is_open: false,

            zoom_stop: 0,
            zoom_start: 0,
            cache_type: 'seed',
            number_of_cache: 2,
            image_format: 'png',
            files: []
        }
        this.handleInput = this.handleInput.bind(this)
        this.getTileCacheValue = this.getTileCacheValue.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleAllCheck = this.handleAllCheck.bind(this)
        this.getValuesFromState = this.getValuesFromState.bind(this)
        this.makeView = this.makeView.bind(this)
        this.getStyleName = this.getStyleName.bind(this)
        this.getFile = this.getFile.bind(this)
    }

    getTileCacheValue(field, value){
        this.state[field] = value
    }

    handleInput(e, value, list, list_name, total_field){
        var check = this.state[total_field]
        if (e.target.checked) {
            list.push(value)
        } else {
            list = list.filter((oid) => oid != value)
        }

        if (list.length == this.props.property_length) { check = true }
        else { check = false }

        this.setState({ [list_name]: list, [total_field]: check })
    }

    handleSave() {
        const { fid, tid } = this.props
        const { id_list, view, open_datas, files } = this.state
        let values
        values = this.getValuesFromState()

        const form_datas = new FormData()

        form_datas.append('fid', fid)
        form_datas.append('tid', tid)
        form_datas.append('id_list', id_list)
        form_datas.append('open_datas', open_datas)

        if (view){
            form_datas.append('view_id', view.id)
        }
        if (files && files.length > 0){
            form_datas.append('files', files[0])
        }
        form_datas.append('values',  JSON.stringify({values}))
        service
            .setPropertyFields(form_datas)
            .then(({ success, msg }) => {
                if(success) {
                    this.props.getAll()
                    this.modalChange(
                        'fa fa-check-circle',
                        null,
                        'success',
                        msg,
                        false,
                        '',
                        '',
                        null,
                        null,
                    )
                }
                else {
                    this.modalChange(
                        'fa fa-exclamation-circle',
                        null,
                        'danger',
                        msg,
                        false,
                        '',
                        '',
                        null,
                        null,
                    )
                }
                this.setState({ save_is_load: false, is_loading: false})
            })
    }

    handleAllCheck(e, list_name, check_name, field) {
        let id_list = []
        const { fields } = this.props
        if(e.target.checked)
        {
            fields.map((f_config, idx) =>
                f_config.data_types.map((data_type, idx) =>
                    data_type.data_type_configs.map((data_type_config, idx) =>
                        id_list.push(data_type_config[field])
                    )
                )
            )
            this.setState({ [list_name]: id_list, [check_name]: true })
        }
        else { this.setState({ [list_name]: [], [check_name]: false }) }
    }

    componentDidUpdate(pP, pS) {
        const { view, tile_cache_check } = this.state

        if(pP.check_list != this.props.check_list) {
            this.setState({ check_list: this.props.check_list })
        }

        if(pP.check_open != this.props.check_open) {
            this.setState({ check_open: this.props.check_open })
        }

        if(pS.tile_cache_check != tile_cache_check) {
            this.setState({
                check_style: false,
                tile_cache_check
            })
        }

        if(pP.files != this.props.files){
            const props_files = this.props.files
            let files = props_files
            if (!files) {
                files = []
            }
            this.setState({ files })
        }

        if (pP.view?.view_name != this.props.view?.view_name){
            this.setState({
                check_style: false,
                view: this.props.view
            })
        }

        if(pP.fields !== this.props.fields){
            const fields = this.props.fields
            this.setState({ fields, files: this.props.files })
        }

        if(pP.id_list !== this.props.id_list){
            const id_list = this.props.id_list
            this.setState({ id_list })
        }

        if(pP.open_datas !== this.props.open_datas){
            const open_datas = this.props.open_datas
            this.setState({ open_datas })
        }

        if(pP.style_names !== this.props.style_names){
            this.setState({ style_names: this.props.style_names })
        }

        if(pP.url !== this.props.url){
            this.setState({ url: this.props.url })
        }

        if(pP.view_style_name !== this.props.view_style_name){
            this.setState({ style_name: this.props.view_style_name })
        }

        if(pP.geom_type !== this.props.geom_type){
            this.setState({ geom_type: this.props.geom_type })
        }

        if(pP.defualt_url !== this.props.defualt_url){
            this.setState({ defualt_url: this.props.defualt_url })
        }

        if(pP.property_loading !== this.props.property_loading){
            this.setState({ is_loading: this.props.property_loading })
        }

        if(pP.fid !== this.props.fid){
            this.setState({
                tile_cache_check: false,
                files: [],
                is_open: false,
            })
        }

        if(pP.cache_values !== this.props.cache_values) {
            if (this.props.cache_values) {
                if (this.props.cache_values.length > 0) {
                    const cache_values = this.props.cache_values[0]
                    this.setState({
                        ...cache_values
                    })
                }
                else {
                    this.setState({
                        zoom_stop: 0,
                        zoom_start: 0,
                        cache_type: 'seed',
                        number_of_cache: 0,
                        image_format: 'png',
                    })
                }
            }
        }
    }

    handleModalAlert() {
        this.setState({ modal_alert_check: 'closed' })
        clearTimeout(this.state.timer)
    }

    getValuesFromState() {
        const {
            style_name, geom_type, zoom_stop,
            zoom_start, number_of_cache, image_format, cache_type, tile_cache_check
        } = this.state
        const values = {
            'style_name': style_name,
            'geom_type': geom_type,
            'tile_cache_check': tile_cache_check,
            'cache_values': {
                'zoom_stop': zoom_stop,
                'zoom_start':zoom_start,
                'number_of_cache': number_of_cache,
                'cache_type': cache_type,
                'image_format': image_format,
            }
        }
        return values
    }

    async makeView() {
        const props = this.props
        const { fid, tid } = props
        const { view, style_name, files } = this.state

        const values = this.getValuesFromState()

        const form_datas = new FormData()

        form_datas.append('fid', fid)
        form_datas.append('tid', tid)
        form_datas.append('view_id', view.id)
        if ( files && files.length > 0 ) {
            form_datas.append('files', files[0])
        }
        form_datas.append('values',  JSON.stringify({values}))

        if(style_name) {
            this.setState({ save_is_load: true, is_loading: true, load_text: "View үүсгэж байна" })
            service.makeView(form_datas)
                .then(({ success, data, error }) => {
                    if(success) {
                        props.getProperties(props.fid, props.tid, props.fname, '')
                    }
                    else {
                        this.modalChange(
                            'fa fa-check-circle',
                            null,
                            'danger',
                            `${error}`,
                            false,
                            '',
                            '',
                            null,
                            null,
                        )
                    }
                })
                .catch((error) => {
                    this.modalChange(
                        'fa fa-check-circle',
                        null,
                        'danger',
                        `View үүсэх явцад алдаа гарсан байна`,
                        false,
                        '',
                        '',
                        null,
                        null,
                    )
                })
                .finally (() => {
                    this.setState({ is_loading: false, load_text: "", check_list: false, check_open: false })
                })
        }
    }

    getStyleName(style_name) {
        this.state.style_name = style_name
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    getFile(files) {
        this.setState({ files })
    }

    render() {
        const { fields, fname } = this.props
        const { is_loading, id_list, check_list, check_open, open_datas } = this.state
        const state = this.state
        return (
            <Fragment>
                <Loader is_loading={is_loading} text={state.load_text ? state.load_text : "Хүсэлтийг уншиж байна."}/>
                <div className={`card col-md-6 mb-1 bundle-view-right-scroll`} style={{left:"10px"}}>
                    <div className="card-header">
                        <h4 className="text-center">{fname}</h4>
                    </div>
                    <div className="card-body">
                        {
                            fname
                            &&
                                <div>
                                    <ImportTemplate {...this.state} getFile={this.getFile}/>
                                    <SetTileCache {...this.state} getTileCacheValue={this.getTileCacheValue}/>
                                    <ChooseStyle {...this.props} {...this.state} getStyleName={this.getStyleName}/>
                                </div>
                        }
                        {
                            fields.length > 0
                            ?
                                <div>
                                    <table className="table table-bordered mb-3">
                                        <thead>
                                            <tr>
                                                <th className="text-center" style={{width: "15%"}}>
                                                    Data <br/> type
                                                </th>
                                                <th className="text-center" style={{width: "15%"}}>
                                                    <label htmlFor="allcheck" className="text-dark"> Public </label>
                                                    <div className="custom-control custom-switch ml-1">
                                                        <input
                                                            id="allcheck"
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            checked={check_list}
                                                            onChange={(e) => this.handleAllCheck(e, 'id_list', 'check_list', 'property_id')}
                                                        />
                                                            <label className="custom-control-label" htmlFor="allcheck"></label>
                                                    </div>
                                                </th>
                                                <th className="text-center" style={{width: "15%"}}>
                                                    <label htmlFor="open_datas" className="text-dark"> Нээлттэй <br /> өгөгдөл </label>
                                                    <div className="custom-control custom-switch ml-1">
                                                        <input
                                                            id="check_open"
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            checked={check_open}
                                                            onChange={(e) => this.handleAllCheck(e, 'open_datas', 'check_open', 'property_code')}
                                                        />
                                                            <label className="custom-control-label" htmlFor="check_open"> </label>
                                                    </div>
                                                </th>
                                                <th className="text-center" style={{width: "70%"}}>
                                                    Property
                                                </th>
                                            </tr>
                                            {fields.map((f_config, idx) =>
                                                <Fragment key={idx}>
                                                    {f_config.data_types.map((data_type, idx) =>
                                                        <Fragment key={idx}>
                                                            <tr key={idx}>
                                                                <th rowSpan={data_type.data_type_configs.length + 1}
                                                                    className="text-wrap align-middle text-justify m-2"
                                                                >
                                                                    <span className="text-center align-middle">({data_type.data_type_name_eng})</span><br/>
                                                                    <span className="text-center align-middle">{data_type.data_type_name}</span><br/>
                                                                    <span className="text-justify text-muted align-middle"><small>{data_type.data_type_definition}</small></span>
                                                                </th>
                                                            </tr>
                                                            {data_type.data_type_configs.map((data_type_config, idx) =>
                                                                <Fragment key={idx}>
                                                                    <tr key={idx}>
                                                                        <th>
                                                                            <div className="icheck-primary text-center">
                                                                                <input
                                                                                    id={data_type_config.property_name}
                                                                                    type="checkbox"
                                                                                    checked={id_list.indexOf(data_type_config.property_id) > -1}
                                                                                    onChange={(e) => this.handleInput(e, parseInt(data_type_config.property_id), id_list, 'id_list', 'check_list')}
                                                                                />
                                                                                <label htmlFor={data_type_config.property_name}></label>
                                                                            </div>
                                                                        </th>
                                                                        <th>
                                                                            <div className="icheck-primary text-center">
                                                                                <input
                                                                                    id={idx + data_type_config.property_code}
                                                                                    type="checkbox"
                                                                                    checked={open_datas.indexOf(data_type_config.property_code) > -1}
                                                                                    onChange={(e) => this.handleInput(e, data_type_config.property_code, open_datas, 'open_datas', 'check_open')}
                                                                                />
                                                                                <label htmlFor={idx + data_type_config.property_code}></label>
                                                                            </div>
                                                                        </th>
                                                                        <th>
                                                                            <label
                                                                                htmlFor={data_type_config.property_name}
                                                                                data-toggle="tooltip"
                                                                                data-placement="right"
                                                                                title={data_type_config.property_definition}
                                                                            >
                                                                                {data_type_config.property_name}
                                                                                <br/>
                                                                                {
                                                                                    data_type_config.value_types.map((value_type, idx) =>
                                                                                        <span key={idx}>
                                                                                            {value_type.value_type_name}
                                                                                        </span>
                                                                                    )
                                                                                }
                                                                            </label>
                                                                        </th>
                                                                    </tr>
                                                                </Fragment>
                                                            )}
                                                        </Fragment>
                                                    )}
                                                </Fragment>
                                            )}
                                        </thead>
                                    </table>
                                    <div>
                                        <button
                                            className="btn btn-block gp-btn-primary"
                                            onClick={this.handleSave}
                                        >
                                            Хадгалах
                                        </button>
                                    </div>
                                </div>
                            :
                                <div className="">
                                    {
                                        fname
                                        &&
                                            <div className="h-100 d-flex flex-column">
                                                <a
                                                    onClick={this.makeView}
                                                    className="btn gp-btn-primary btn-block text-white px-5 py-3"
                                                >
                                                    View үүсгэх
                                                </a>
                                            </div>
                                    }
                                </div>
                        }
                    </div>
                    <Modal
                        modal_status={ this.state.modal_status }
                        modal_icon={ this.state.modal_icon }
                        modal_bg={ this.state.modal_bg }
                        icon_color={ this.state.icon_color }
                        title={ this.state.title }
                        text={ this.state.text }
                        has_button={ this.state.has_button }
                        actionNameBack={ this.state.actionNameBack }
                        actionNameDelete={ this.state.actionNameDelete }
                        modalAction={ this.state.modalAction }
                        modalClose={ this.state.modalClose }
                    />
                </div>
            </Fragment>
        )
    }
}

