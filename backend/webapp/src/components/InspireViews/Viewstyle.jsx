import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import StyleMap from './Map'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
})


export class ViewStyle extends Component {

    constructor(props) {

        super(props)
        this.state = {
            style_state: 'create_style',
            initial_values: {
                style_name: '',
                style_title: '',
                style_color: '#ffffff',
                style_size: '',
                style_kind: ''
            },
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {

    }

    handleSubmit(values, { setStatus, setValues }) {

    }

    render() {
        const {fname, view_name} = this.props
        const { initial_values, style_state } = this.state
        return (
            <div className="card">

                <div className="card-header">
                    <h4 className="text-center">{fname}</h4>
                    {view_name && <h4 className="text-center"><small>View name: {view_name}</small></h4>}
                </div>

                <div className="card-body">
                    <Formik
                        initialValues={ initial_values }
                        enableReinitialize
                        validationSchema={ validationSchema }
                        onSubmit={ this.handleSubmit }
                    >
                        {({
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            setFieldValue,
                            setStatus,
                            setValues,
                            handleBlur,
                            values,
                            isValid,
                            dirty,
                        }) => {
                            return (
                                <Form>
                                    <fieldset>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="">Төлөв</label>
		                                        <select className="form-control form-control-sm"
		                                            onChange={(e) => this.setState({ style_state: e.target.value })}>
		                                            <option value="create_style">Style үүсгэх</option>
		                                            <option value="update_style">Үүссэн style-с сонгох</option>
		                                        </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            {style_state == 'create_style' ?
                                                <Fragment>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="style_name">Style-ийн нэр</label>
                                                        <Field
                                                            name="style_name"
                                                            id="id_geoserver_host"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="style_title">Style-ийн гарчиг</label>
                                                        <Field
                                                            name="style_title"
                                                            type="text"
                                                            className="form-control"
                                                            id="style_title"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="style_color">Style-ийн өнгө</label>
                                                        <Field
                                                            name="style_size" as="select"
                                                            className="form-control" className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                            <option value="stroke">stroke</option>
                                                            <option value="fill">fill</option>
                                                            <option value="fill_opacity">fill-opacity</option>
                                                        </Field>
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="id_geoserver_user">Style-ийн хэмжээ</label>
                                                        <Field
                                                            name="style_size"
                                                            type="text"
                                                            className="form-control"
                                                            id="style_size"
                                                        />
                                                    </div>
                                                    {/* <div className="form-group col-md-6">
                                                        <label htmlFor="id_geoserver_user">Style-ийн өнгө</label>
                                                        <Field
                                                            name="style_size" as="select"
                                                            className="form-control" className={'form-control ' + (errors.center_typ ? 'is-invalid' : '')}>
                                                            <option value="stroke">stroke</option>
                                                            <option value="fill">fill</option>
                                                            <option value="fill_opacity">fill-opacity</option>
                                                        </Field>
                                                        <ErrorMessage name="style_size" component="div" className="text-dange"/>
                                                    </div> */}
                                             </Fragment>
                                            : null
                                            }
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="">Өнгө</label>
                                                <input
                                                    type="color"
                                                    value= {initial_values.style_color}
                                                    onChange={(e) => this.setState({ initial_values: {style_color: e.target.value} })}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <StyleMap/>
                                            </div>
                                        </div>
                                    </fieldset>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>

            </div>
        )
    }
}
