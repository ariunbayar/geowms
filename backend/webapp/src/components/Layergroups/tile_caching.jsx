import React, { Component } from "react"
import {Switch, Route, NavLink} from "react-router-dom"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { service } from './service'
import ModalAlert from "../ModalAlert"

var validationSchema = Yup.object().shape({
    zoom_start: Yup.number()
        .max(21, "Хамгийн ихдээ 21 байна"),
    zoom_stop: Yup.number()
        .max(21, "Хамгийн ихдээ 21 байна"),
    number_of_cache: Yup.number()
        .max(21, "Хамгийн ихдээ 21 байна"),
})


export class TileCaching extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                image_format: 'png',
                zoom_start: 0,
                zoom_stop: 0,
                cache_type: 'reseed',
                number_of_cache: 1,
            },
            modal_alert_status: 'closed',
            model_alert_text: '',
            model_alert_icon: 'success',
            image_formats: ['png', 'jpeg'],
            cache_types: ['seed', 'reseed', 'truncate'],
            errors: '',
            timer: null,

        }
        this.getDetialAll = this.getDetialAll.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)

    }

    componentDidMount() {
        const group_name = this.props.match.params.group_name
        if (group_name) {
            this.getDetialAll(group_name)
        }
    }


    getDetialAll(group_name) {
        service.getGroupCacheList(group_name).then(({ cache_list }) => {

            if ( cache_list.length > 0) {
                var value = cache_list[0]
                this.setState({
                    form_values: {
                        image_format: value.image_format,
                        zoom_start: value.zoom_start,
                        zoom_stop: value.zoom_stop,
                        cache_type: value.cache_type,
                        number_of_cache: value.number_of_cache,
                    }
                })
            }
        })
    }

    modalClose(){
        this.setState({modal_alert_status: "closed"})
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {
        const group_name = this.props.match.params.group_name
        service.createGroupCache(values, group_name).then(({ success, errors, info}) => {
            if (success) {
                this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'success'})
                setStatus('saved')
                this.modalCloseTime()
            } else {
                setErrors(errors)
            }
            setSubmitting(false)
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
                form_values, modal_alert_status,
                model_alert_text, model_alert_icon,
                image_formats, cache_types
            } = this.state
        const group_name = this.props.match.params.group_name
        return (
            <div className="ml-3">
                <div className="row">
                    <div className="col-md-4">
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
                                    <div className="form-row col-md-8">
                                        <div className="form-row">
                                            <div className="form-row col-md-12 mb-2">
                                                    <label
                                                        htmlFor="group_name"
                                                        className="col-md-12 my-2 text-center text-dark h5">
                                                        {group_name}
                                                    </label>
                                            </div>
                                            <div className="form-row col-md-12 mb-2">
                                                    <label htmlFor="image_format" className="col-md-6 my-2"> Зургийн формат</label>
                                                       <Field
                                                            name='image_format'
                                                            id='image_format'
                                                            as="select"
                                                            className="form-control col-md-6"
                                                        >
                                                        {
                                                            image_formats.map((format, idy) =>
                                                                <option key = {idy} value={format}>{format}</option>
                                                            )
                                                        }
                                                    </Field>
                                            </div>
                                            <div className="form-row col-md-12 mb-4 mt-2">
                                                    <label htmlFor="" className="col-md-6">Үйлдлийн төрөл</label>
                                                       <Field
                                                        name='cache_type'
                                                        id='cache_type'
                                                        as="select"
                                                        className="form-control col-md-6"
                                                    >
                                                        {
                                                            cache_types.map((cache, idy) =>
                                                            <option key = {idy} value={cache}>{cache}</option>
                                                            )
                                                        }
                                                    </Field>
                                            </div>
                                            <div className="form-group col-md-6">
                                                    <label htmlFor="">Томруулах эхний утга</label>
                                                    <Field
                                                        className={'form-control ' + (errors.zoom_start ? 'is-invalid' : '')}
                                                        name='zoom_start'
                                                        id="zoom_start"
                                                        type="number"
                                                    />
                                                    <ErrorMessage name="zoom_start" component="div" className="text-danger"/>

                                            </div>
                                            <div className="form-group col-md-6 mb-2">
                                                    <label htmlFor="">Томруулах сүүлчийн утга</label>
                                                    <Field
                                                        className={'form-control ' + (errors.zoom_stop ? 'is-invalid' : '')}
                                                        name='zoom_stop'
                                                        id="zoom_stop"
                                                        type="number"
                                                    />
                                                    <ErrorMessage name="zoom_stop" component="div" className="text-danger"/>
                                            </div>
                                            <div className="form-group col-md-6 mb-2">
                                                    <label htmlFor="">Хэрэглэх таскуудын тоо</label>
                                                    <Field
                                                        className={'form-control ' + (errors.number_of_cache ? 'is-invalid' : '')}
                                                        name='number_of_cache'
                                                        id="number_of_cache"
                                                        type="number"
                                                    />
                                                    <ErrorMessage name="number_of_cache" component="div" className="text-danger"/>
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
                                </Form>
                                )}}
                        </Formik>
                    </div>
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
