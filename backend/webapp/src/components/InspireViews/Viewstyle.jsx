import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
})


export class ViewStyle extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                style_kind: 'none'
            },
            values: {},
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {

    }
    handleChange(e){
        console.log(e.target.name)
    }

    handleSubmit(values, { setStatus, setValues }) {

    }

    render() {
        const {fname, view_name} = this.props
        const initial_values  = this.state.initial_values
        return (
            <div className="card">

                <div className="card-header">
                    <h4 className="text-center">{fname}</h4>
                    {view_name && <h4 className="text-center"><small>View name: {view_name}</small></h4>}
                </div>

                <div className="card-body">
                    <Formik
                        initialValues={ initial_values }
                        initialStatus={ 'initial' }
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
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-12 mb-4">
                                                <a href="#" onClick={event => this.handleChange(event, id, 'up')}>
                                                    <i className="fa fa-chevron-up gp-text-primary" aria-hidden="true"></i>
                                                </a>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-12 mb-4">
                                                <button type="button" className="btn gp-outline-primary" name="update" onClick={(e) =>this.handleChange}>
                                                    Үүссэн style-аас сонгох
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        <div className="col-md-12">
                                            <a className="col-md-6">Шинээр style үүсгэх</a>
                                            <a className="col-md-6">Үүссэн style-аас сонгох</a>
                                        </div>
                                    }
                                    <div className="col-md-12 ml-3">
                                        <a>Map</a>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </div>

            </div>
        )
    }
}
