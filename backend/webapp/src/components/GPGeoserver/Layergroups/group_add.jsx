import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { service } from './service'
import ModelSelectLayer from "./ModelSelect"
import ModalAlert from "../../ModalAlert"
import {GPIcon} from "@utils/Tools"
import Loader from "@utils/Loader"

export class GroupAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                title: '',
                abstract: '',
                layers: '',
                minx: '',
                maxx: '',
                miny: '',
                maxy: '',
                projection: ''
            },
            errors: '',
            layer_list: [],
            layer_detail: [],
            select_layer_status: false,
            modal_alert_status: 'closed',
            model_alert_text: '',
            model_alert_icon: 'success',
            timer: null,
            old_name: props.match.params.group_name || '',
            values: [],
            modalAction: '',
            style_list: [],
            more_detail: '',
            work_space_list: [],
            work_space_name: '',
            group_layer_name: '',
            name_invalid: false,
            is_loading: false
        }
        this.getDetialAll = this.getDetialAll.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.handleSelectedLayers = this.handleSelectedLayers.bind(this)
        this.removeLayer = this.removeLayer.bind(this)
        this.handleMoveUp = this.handleMoveUp.bind(this)
        this.handleMoveDown = this.handleMoveDown.bind(this)
        this.handleSwap = this.handleSwap.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
        this.handleSelectModel = this.handleSelectModel.bind(this)
        this.setStyleName = this.setStyleName.bind(this)
        this.getWsDetail = this.getWsDetail.bind(this)
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    componentDidMount() {
        const group_name = this.props.match.params.group_name
        if (group_name) {
            this.getDetialAll(group_name)
        }
        Promise.all([
            service.getLayers(),
            service.getStyleList(),
            service.getWslist(),
        ]).then(([{layer_list}, {style_list}, {work_space_list}]) => {
            this.setState({layer_detail: layer_list, style_list, work_space_list})
        })

    }

    getWsDetail(e) {
        var work_space_name = e.target.value
        service.getLayers(work_space_name).then(({layer_list}) =>{
            this.setState({layer_detail: layer_list, work_space_name})
        })
    }

    setStyleName(value, idx) {
        var detail = this.state.layer_list
        detail[idx].style_name = value
        this.setState({layer_list: detail, select_layer_status: false})
    }

    handleSelectModel(modal_title, modalAction, values, more_detail) {
        return (
            this.setState({
                select_layer_status: true,
                modalAction: modalAction,
                modal_title,
                values,
                more_detail
            })
        )
    }

    componentDidUpdate(pP, pS) {
        if (pS.layer_detail != this.state.layer_detail) {
            this.setState({layer_detail: this.state.layer_detail})
        }
    }

    getDetialAll(group_name) {
        service.getGroupDetial(group_name).then(({detial_list, layer_list}) => {
            var bound = detial_list.bounds
            if( detial_list ) {
                this.setState({
                    form_values: {
                        title: detial_list.title,
                        abstract: detial_list.abstractTxt,
                        minx: bound.minx,
                        maxx: bound.maxx,
                        miny: bound.miny,
                        maxy: bound.maxy,
                        projection: bound.crs
                    },
                    layer_list,
                    group_layer_name: detial_list.name,
                })
            }
        })
    }

    modalClose(){
        this.setState({select_layer_status: false})
    }

    handleSelectedLayers(value) {
        var joined = this.state.layer_list.concat(value)
        this.setState({ layer_list: joined, select_layer_status: false})
    }

    removeLayer(e, value) {
        var array = [...this.state.layer_list]
        for (let [i, layer] of array.entries()) {
            if (layer.layer_name == value.layer_name) {
                array.splice(i, 1);
            }
        }
        this.setState({layer_list: array})
    }

    handleMoveUp(e, index) {
        var arr = [...this.state.layer_list]
        if (index > 0) {
            this.handleSwap(arr, index, index - 1);
        }
    }

    handleMoveDown(e, index) {
        var arr = [...this.state.layer_list]
        if (index < arr.length - 1) {
            this.handleSwap(arr, index, index + 1);
        }
    }

    handleSwap(obj, prop1, prop2) {
        var tmp = obj[prop1];
        obj[prop1] = obj[prop2];
        obj[prop2] = tmp;
        this.setState({layer_list: obj})
    }

    handleSubmit( values, { setStatus, setSubmitting, setErrors }) {
        const { layer_list, old_name, group_layer_name} = this.state
        var group_state = false
        const group_name = this.props.match.params.group_name

        if (!group_layer_name) {
            this.setState({ name_invalid: true})
        }
        if (group_name) group_state = true

        if (group_layer_name) {
            this.setState({is_loading: true})
            service
            .createLayerGroup(values, group_layer_name,  layer_list, group_state, old_name)
            .then(({ success, info, errors }) => {
                if (success) {
                    this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'success'})
                    setStatus('saved')
                    this.modalCloseTime()
                } else {
                    if (errors) {
                        setErrors(errors)
                    }
                    else {
                        this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'danger', is_loading: false})
                    }
                    setSubmitting(false)
                }
            })
        }
        else {
            setSubmitting(false)
        }
    }

    handleOnChange(e) {
        var input_value = e.target.value
        var group_layer_name = input_value.replace(' ', '_')
        this.setState({group_layer_name})
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed", is_loading: false})
        }, 2000)
        this.props.history.push("/back/gp-geoserver/layer-groups/")
    }

    render() {
        const {
            form_values, layer_list, layer_detail,
            select_layer_status, modal_alert_status,
            model_alert_text, model_alert_icon,
            modalAction, modal_title, values,
            style_list, more_detail, work_space_list,
            work_space_name, name_invalid, group_layer_name,
            is_loading
        } = this.state
        const group_name = this.props.match.params.group_name
        return (
            <div className="col-md-8"  style={{ minHeight: '72vh'}}>
                <div className="row">
                    <div className="col-4 col-md-4 col-xl-4">
                        <div className="row">
                        <Loader is_loading={is_loading} text={'Уншиж байна'}/>
                            <div className="col-12 mt-3 col-md-12 col-xl-12">
                                <div className="h-100">
                                    <Formik
                                        enableReinitialize
                                        initialValues={
                                            form_values
                                        }
                                        onSubmit={this.handleSubmit}
                                    >
                                    {({
                                        errors,
                                        isSubmitting,
                                    }) => {
                                    return (
                                        <Form>
                                            <div className="form-row col-md-12">
                                                <div className="form-row">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="" >Нэр</label>
                                                        <input
                                                            className={'form-control ' + ((name_invalid) ? 'is-invalid' : '')}
                                                            name='group_layer_name'
                                                            id="group_layer_name_id"
                                                            type="text"
                                                            value={group_layer_name}
                                                            onChange={(e) => this.handleOnChange(e)}
                                                        />
                                                        {
                                                            !group_layer_name && name_invalid &&
                                                                <small className="text-danger">Style-ийн нэр хоосон байна</small>
                                                        }
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="title">Гарчиг</label>
                                                        <Field
                                                            className={'form-control '}
                                                            name='title'
                                                            id="title"
                                                            type="text"
                                                            placeholder="Гарчиг"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-12 mb-2">
                                                        <label htmlFor="abstract">Товч тайлбар</label>
                                                        <Field
                                                            className={'form-control'}
                                                            name='abstract'
                                                            id="abstract_id"
                                                            as='textarea'
                                                            placeholder="Товч тайлбар"
                                                        />
                                                    </div>
                                                    {
                                                        group_name &&
                                                        <div>
                                                            <div className="form-row col-md-12 my-2">
                                                                <label htmlFor="bbox" className="col-md-12">Bounding box</label>
                                                                <label htmlFor="bbox" className="col-md-12">
                                                                    <a className="col-3 float-left pl-1">Minx</a>
                                                                    <a className="col-3 float-left pl-1">Maxx</a>
                                                                    <a className="col-3 float-left pl-1">Miny</a>
                                                                    <a className="col-3 float-left pl-1">Maxy</a>
                                                                </label>
                                                                <Field
                                                                    type="number"
                                                                    name='minx'
                                                                    id='minx'
                                                                    placeholder="minx"
                                                                    disabled={true}
                                                                    className="form-control col-3"
                                                                />
                                                                <Field
                                                                    type="number"
                                                                    name='miny'
                                                                    id='miny'
                                                                    disabled={true}
                                                                    placeholder="miny"
                                                                    className="form-control col-3"
                                                                />
                                                                <Field
                                                                    type="number"
                                                                    name='maxx'
                                                                    disabled={true}
                                                                    id='maxx'
                                                                    placeholder="maxx"
                                                                    className="form-control col-3"
                                                                />
                                                                <Field
                                                                    type="number"
                                                                    name='maxy'
                                                                    id='maxy'
                                                                    disabled={true}
                                                                    placeholder="maxy"
                                                                    className="form-control col-3"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="id_name">Projection</label>
                                                                <Field
                                                                    className={'form-control col-4'}
                                                                    name='projection'
                                                                    disabled={true}
                                                                    id="projection"
                                                                    type="text"
                                                                    placeholder="projection"
                                                                />
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        !group_name &&
                                                        <div className="col-md-12">
                                                            <div className="form-group col-md-12 px-0">
                                                                <label htmlFor="ws_check">WorkSpace-ээс сонгох</label>
                                                                <select
                                                                    name='work_space_name'
                                                                    id='work_space_name'
                                                                    className="form-control col-md-6"
                                                                    value={work_space_name}
                                                                    onChange={(e) => {this.getWsDetail(e)}}
                                                                >
                                                                    <option value=''></option>
                                                                    {
                                                                        work_space_list.map((value, idy) =>
                                                                            <option key = {idy} value={value}>{value}</option>
                                                                        )
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className="col-md-12">
                                                        <div className="row justify-content-center overflow-auto" style={{height: '30vh'}}>
                                                            <table className="table table-wrapper-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col"> № </th>
                                                                        <th scope="col">Давхарга</th>
                                                                        <th scope="col">Төрөл</th>
                                                                        <th scope="col">Style</th>
                                                                        <th scope="col">Эрэмбэ</th>
                                                                        <th scope="col">Хасах</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        layer_list.length > 0 ? layer_list.map((value, idx) =>
                                                                        <tr key={idx}>
                                                                            <th scope="row">{idx+1}</th>
                                                                            <td>{value.layer_name}</td>
                                                                            <td>{value.type}</td>
                                                                            <td>
                                                                                <a
                                                                                    href="#"
                                                                                    onClick={
                                                                                        (e) => this.handleSelectModel(
                                                                                            'Update Style',
                                                                                            this.setStyleName,
                                                                                            style_list,
                                                                                            idx
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    {value.style_name}
                                                                                </a>
                                                                            </td>
                                                                            <td className="text-center mx-0 px-0">
                                                                                {
                                                                                    idx != 0
                                                                                    &&
                                                                                    <a href="#" onClick={(e) => this.handleMoveUp(e, idx)}>
                                                                                        <GPIcon icon={"fa fa-arrow-up text-primary float-right"}/>
                                                                                    </a>
                                                                                }
                                                                                {
                                                                                    idx != layer_list.length-1
                                                                                    &&
                                                                                    <a href="#" onClick={(e) => this.handleMoveDown(e, idx)}>
                                                                                        <GPIcon icon={"fa fa-arrow-down text-primary float-left"}/>
                                                                                    </a>
                                                                                }
                                                                            </td>
                                                                            <td className="text-center mx-0 px-0">
                                                                                <a href="#" onClick={(e) => this.removeLayer(e, value)}>
                                                                                    <GPIcon icon={"fa fa-minus-circle text-danger"}/>
                                                                                </a>
                                                                            </td>
                                                                        </tr>
                                                                        ): null
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            <div className="form-group col-md-12">
                                                                <a
                                                                    href="#"
                                                                    onClick={
                                                                        (e) => this.handleSelectModel(
                                                                            'Давхарга нэмэх',
                                                                            this.handleSelectedLayers,
                                                                            layer_detail
                                                                        )
                                                                    }
                                                                >
                                                                    <GPIcon icon={"fa fa-plus-circle text-success mr-4 mt-2"}/>
                                                                    Давхарга нэмэх
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
                                                            {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                            {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                            {!isSubmitting && 'Хадгалах' }
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Form>
                                        )}}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    {select_layer_status &&
                        <ModelSelectLayer
                            modalClose={this.modalClose}
                            modalAction={modalAction}
                            layer_list={values}
                            total_items={layer_detail}
                            title={modal_title}
                            more_detail={more_detail}
                        />
                    }
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={modal_alert_status}
                    title={model_alert_text}
                    model_type_icon={model_alert_icon}
                />
            </div>
        )

    }

}
