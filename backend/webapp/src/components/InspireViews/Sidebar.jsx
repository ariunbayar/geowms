import React, { Component, Fragment } from 'react'

import Loader from "@utils/Loader"
import ModalAlert from '../ModalAlert'
import ChooseStyle from './ChooseStyle'
import SetTileCache from './setTileCache'

import './styles.css'
import { service } from './service'

export default class SideBar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false,
            id_list: [],
            save_is_load: false,
            modal_alert_check: 'closed',
            title: '',
            model_type_icon: 'success',
            view: '',
            style_names: props.style_names,
            url: props.url,
            defualt_url: props.defualt_url,
            geom_type: props.geom_type,
            is_loading: props.property_loading,
            tile_cache_check: false,
            check_list: props.check_list,
            is_loading: false,
            invalid_feedback: false,

            zoom_stop: 0,
            zoom_start: 0,
            cache_type: 'seed',
            number_of_cache: 2,
            image_format: 'png',
        }
        this.handleInput = this.handleInput.bind(this)
        this.getTileCacheValue = this.getTileCacheValue.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleAllCheck = this.handleAllCheck.bind(this)
        this.getValuesFromState = this.getValuesFromState.bind(this)
        this.makeView = this.makeView.bind(this)
        this.getStyleName = this.getStyleName.bind(this)
    }

    getTileCacheValue(field, value){
        this.state[field] = value
    }

    handleInput(e){
        let id_list = this.state.id_list
        var check_list = this.state.check_list
        const value = parseInt(e.target.value)
        if (e.target.checked) {
            id_list.push(value)
        } else {
            id_list = id_list.filter((oid) => oid != value)
        }

        if(id_list.length == this.props.property_length){ check_list = true }
        else { check_list = false }

        this.setState({ id_list, check_list })
    }

    handleSave() {
        const { fid, tid } = this.props
        const { id_list, view, tile_cache_check, zoom_start } = this.state

        let values
        values = this.getValuesFromState()

        let model_type_icon
        let msg
        service
            .setPropertyFields(fid, tid, id_list, view.id, values)
            .then(({ success, data, error }) => {
                if(success) {
                    this.props.getAll()
                    model_type_icon = 'success'
                    msg = data
                }
                else {
                    msg = error
                    model_type_icon = 'danger'
                }
                this.setState({ save_is_load: false, is_loading: false, modal_alert_check: 'open', title: msg, model_type_icon })
            })
            .catch(() => {
                this.setState({ save_is_load: false, is_loading: false, modal_alert_check: 'open', title: "Алдаа гарсан байна", model_type_icon: "danger" })
                this.modalCloseTime()
            })
    }

    handleAllCheck(e) {
        let id_list = []
        const { fields } = this.props
        if(e.target.checked)
        {
            fields.map((f_config, idx) =>
                f_config.data_types.map((data_type, idx) =>
                    data_type.data_type_configs.map((data_type_config, idx) =>
                        id_list.push(data_type_config.property_id)
                    )
                )
            )
            this.setState({id_list:id_list, check_list: true })
        }
        else { this.setState({ id_list: [], check_list: false }) }
    }

    componentDidMount() {
        const{ id_list }= this.props
        this.setState({ id_list })
    }

    componentDidUpdate(pP, pS) {
        const { view, tile_cache_check } = this.state

        if(pP.check_list != this.props.check_list) {
            this.setState({ check_list: this.props.check_list })
        }

        if(pS.tile_cache_check != tile_cache_check) {
            this.setState({
                check_style: false,
                tile_cache_check
            })
        }

        if (pP.view?.view_name != this.props.view?.view_name){
            this.setState({
                check_style: false,
                view: this.props.view
            })
        }

        if(pP.fields !== this.props.fields){
            const fields = this.props.fields
            this.setState({ fields })
        }

        if(pP.id_list !== this.props.id_list){
            const id_list = this.props.id_list
            this.setState({ id_list })
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
            this.setState({ tile_cache_check: false })
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

    modalCloseTime() {
        this.state.timer = setTimeout(() => {
            this.setState({ modal_alert_check: 'closed' })
        }, 2000)
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

    makeView() {
        const props = this.props
        const { fid, tid } = props
        const { view, style_name } = this.state

        const values = this.getValuesFromState()
        if(style_name) {
            this.setState({ save_is_load: true, is_loading: true, load_text: "View үүсгэж байна" })
            service
                .makeView(fid, tid, view.id, values)
                .then(({ success, data, error}) => {
                    if(success) {
                        props.getProperties(props.fid, props.tid, props.fname, '')
                    }
                    else {
                        alert(error)
                    }
                    this.setState({ is_loading: false, load_text: "", check_list: false })
                })
        }
        else this.setState({ invalid_feedback: true })
    }

    getStyleName(style_name) {
        this.state.style_name = style_name
    }

    render() {
        const { fields, fid, fname, has_view } = this.props
        const { is_loading, id_list, check_list } = this.state
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
                                                    View
                                                    <div className="custom-control custom-switch ml-1">
                                                        <input
                                                            id="allcheck"
                                                            type="checkbox"
                                                            className="custom-control-input"
                                                            checked={check_list}
                                                            onChange={this.handleAllCheck}
                                                        />
                                                            <label className="custom-control-label" htmlFor="allcheck"></label>
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
                                                                                    onChange={this.handleInput}
                                                                                    value={data_type_config.property_id}
                                                                                />
                                                                                <label htmlFor={data_type_config.property_name}></label>
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
                    <ModalAlert
                        title={this.state.title}
                        model_type_icon ={this.state.model_type_icon}
                        status={this.state.modal_alert_check}
                        modalAction={() => this.handleModalAlert()}
                    />
                </div>
            </Fragment>
        )
    }
}
