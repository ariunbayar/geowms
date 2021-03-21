import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
    geoserver_host: Yup.string(),
    geoserver_protocal: Yup.string(),
    geoserver_user: Yup.string(),
    geoserver_pass: Yup.string(),
    geoserver_port: Yup.string(),
    geoserver_db_host: Yup.string(),
})


export default class ConfigGeoserver extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                geoserver_host: '',
                geoserver_user: '',
                geoserver_pass: '',
                geoserver_port:'',
                geoserver_db_host:'',
                geoserver_protocal: '',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        service.config.geoserver.get().then((values) => {
            this.setState({
                initial_values: values,
                values,
            })
        })
    }

    handleEdit(e) {
        e.preventDefault()

        const { is_editing } = this.state

        this.setState({
            is_editing: !is_editing,
        })
    }

    handleSubmit(values, { setStatus, setValues }) {

        setStatus('saving')

        service.config.geoserver
            .save(values)
            .then(({ success }) => {

                if (success) {
                    setStatus('save_success')
                    this.setState({ values })
                } else {
                    return Promise.reject()
                }

            })
            .catch(() => {
                setValues(this.state.values)
                setStatus('save_error')
            })
            .finally(() => {
                this.setState({ is_editing: false })
            })

    }

    render() {

        const {
            is_editing,
            initial_values,
        } = this.state

        return (
            <div className="card">

                <div className="card-header">
                    GeoServer API тохиргоо
                    <div className="card-action">
                        <a href="#" onClick={ this.handleEdit }>
                            <i className="fa fa-edit"></i>
                        </a>
                    </div>
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
                                    <fieldset disabled={ !is_editing }>
                                        <div className="form-row">
                                            <div className="form-group col-md-12 text-wrap">
                                                <small htmlFor="id_geoserver_host">IP Address / Domain name</small>
                                                <Field
                                                    name="geoserver_host"
                                                    id="id_geoserver_host"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <small htmlFor="id_geoserver_user">Port</small>
                                                <Field
                                                    name="geoserver_port"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_geoserver_port"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <small htmlFor="geoserver_protocal">Protocal</small>
                                                <Field
                                                    name="geoserver_protocal"
                                                    id="geoserver_protocal"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_geoserver_user">Username</label>
                                                <Field
                                                    name="geoserver_user"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_geoserver_user"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_geoserver_pass">Password</label>
                                                <Field
                                                    name="geoserver_pass"
                                                    type="password"
                                                    className="form-control"
                                                    id="id_geoserver_pass"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="id_geoserver_db_host">Database hostname</label>
                                                <Field
                                                    name="geoserver_db_host"
                                                    id="id_geoserver_db_host"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>

                                        { is_editing &&
                                            <button
                                                type="submit"
                                                className="btn gp-btn-primary"
                                                disabled={ status == 'saving' }
                                            >
                                                {status == 'saving' &&
                                                    <Fragment>
                                                        <i className="fa fa-circle-o-notch fa-spin"></i> {}
                                                        Түр хүлээнэ үү...
                                                    </Fragment>
                                                }
                                                {status != 'saving' && 'Хадгалах' }
                                            </button>
                                        }

                                    </fieldset>

                                    { !is_editing && status == 'save_success' &&
                                        <div className="alert alert-icon-success alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-success">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Амжилттай хадгаллаа!</span>
                                            </div>
                                        </div>
                                    }

                                    { !is_editing && status == 'save_error' &&
                                        <div className="alert alert-icon-warning alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-warning">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Хадгалахад алдаа гарлаа!</span>
                                            </div>
                                        </div>
                                    }
                                </Form>
                            )
                        }}
                    </Formik>
                </div>

            </div>
        )
    }
}
