import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { service } from './service'
import ModelSelectLayer from "./ModelSelect"
import ModalAlert from "../ModalAlert"
import { cmpPos } from "codemirror"


const validationSchema = Yup.object().shape({
    name: Yup.string()
    .required('Нэр оруулна уу !'),
    title: Yup.string(),
    abstract: Yup.string(),
})


export class GroupAdd extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                name: '',
                title: '',
                abstract: '',
                layers: '',
                minx: '',
                maxx: '',
                miny: '',
                maxy:'',
                projection:''
            },
            errors: '',
            layer_list: [],
            layer_detail: [],
            select_layer_status: false,
            modal_alert_status: 'closed',
            model_alert_text: '',
            model_alert_icon: 'success',
            timer: null,
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

    }

    componentDidMount() {
        const group_name = this.props.match.params.group_name
        if (group_name) {
            this.getDetialAll(group_name)
        }
        service.getLayers().then(({layer_list})=> {
            this.setState({layer_detail:layer_list})
        })

    }

    getDetialAll(group_name) {
        service.getGroupDetial(group_name).then(({detial_list, layer_list}) => {
            var bound = detial_list.bounds
            if( detial_list ) {
                this.setState({
                    form_values: {
                        name: detial_list.name,
                        title: detial_list.title,
                        abstract: detial_list.abstractTxt,
                        minx: bound.minx,
                        maxx: bound.maxx,
                        miny: bound.miny,
                        maxy: bound.maxy,
                        projection: bound.crs
                    },
                    layer_list
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

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {
        const { layer_list } = this.state
        var group_state = false
        const group_name = this.props.match.params.group_name
        if (group_name) group_state = true
        service
            .createLayerGroup(values, layer_list, group_state)
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
                        this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'danger'})
                    }
                    setSubmitting(false)
                }
            })

    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
        this.props.history.push("/back/layer-groups/")
    }

    render() {
        const {
                form_values, layer_list, layer_detail,
                select_layer_status, modal_alert_status, model_alert_text, model_alert_icon
            } = this.state
        const group_name = this.props.match.params.group_name
        return (
            <div className="col-md-12" style={{height:"calc( 85vh - 60px - 7px)"}}>
                <div className="row">
                    <div className="col-4 col-md-4 col-xl-4">
                        <div className="row">
                            <div className="col-12 mt-3 col-md-12 col-xl-12">
                                <div className="h-100">
                                    <Formik
                                        enableReinitialize
                                        initialValues={
                                            form_values
                                        }
                                        validationSchema={validationSchema}
                                        onSubmit={this.handleSubmit}
                                    >
                                    {({
                                        errors,
                                        isSubmitting,
                                    }) => {
                                    const has_error = Object.keys(errors).length > 0
                                    return (
                                        <Form>
                                            <div className="form-row col-md-12">
                                                <div className="form-row">
                                                    <div className="form-group col-md-12">
                                                            <label htmlFor="" >Нэр</label>
                                                            <Field
                                                                className={'form-control ' + (errors.name ? 'is-invalid' : '')}
                                                                name='name'
                                                                id="name"
                                                                type="text"
                                                                disabled={group_name ? true : false}
                                                            />
                                                            <ErrorMessage name="name" component="div" className="text-danger"/>

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
                                                            id="abstract"
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
                                                                    id='minx'
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
                                                                    id='maxx'
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
                                                    <div className="col-md-12">
                                                        <div className="row justify-content-center">
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
                                                                        layer_list.length >0 ? layer_list.map((value, idx) =>
                                                                        <tr key={idx}>
                                                                            <th scope="row">{idx+1}</th>
                                                                            <td>{value.layer_name}</td>
                                                                            <td>{value.type}</td>
                                                                            <td>{value.style_name}</td>
                                                                            <td className="text-center">
                                                                            <a href="#">
                                                                                <i className="fa fa-arrow-up text-primary mr-2" aria-hidden="true"  onClick={(e) => this.handleMoveUp(e, idx)}></i>
                                                                                <i className="fa fa-arrow-down text-primary" aria-hidden="true"  onClick={(e) => this.handleMoveDown(e, idx)}></i>
                                                                            </a>
                                                                            </td>
                                                                            <td className="text-center">
                                                                                <a href="#" onClick={(e) => this.removeLayer(e, value)}>
                                                                                    <i className="fa fa-minus-circle text-danger" aria-hidden="true"></i>
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
                                                                <a href="#" onClick={(e) => this.setState({ select_layer_status: true})}>
                                                                    <i className="fa fa-plus-circle text-success mr-2 mt-2" aria-hidden="true"></i>
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
                            modalAction={this.handleSelectedLayers}
                            layer_list = {layer_detail}
                            title="Давхаргууд"
                        />
                    }
                </div>
                <ModalAlert
                    modalAction = {() => this.modalClose()}
                    status = {modal_alert_status}
                    title = {model_alert_text}
                    model_type_icon = {model_alert_icon}
                />
            </div>
        )

    }

}
