import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from '../service'
import BackButton from "@utils/Button/BackButton"


const validationSchema = Yup.object().shape({
    msssql_server: Yup.string(),
    msssql_port: Yup.string(),
    msssql_username: Yup.string(),
    msssql_password: Yup.string(),
    msssql_database: Yup.string(),
})


class ConnectionConfig extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                msssql_server: '',
                msssql_port: '',
                msssql_username: '',
                msssql_password: '',
                msssql_database: '',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getConfigs = this.getConfigs.bind(this)
    }

    componentDidMount() {
        this.getConfigs()
    }

    getConfigs() {
        service
            .mssql_config
            .get()
            .then((values) => {
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
        service
            .mssql_config
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
                    Mssql Connection Тохиргоо
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
                                            <div className="form-group col-md-6 text-wrap">
                                                <label htmlFor="id_msssql_server">Server IP</label>
                                                <Field
                                                    name="msssql_server"
                                                    id="id_msssql_server"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_msssql_port">Server PORT</label>
                                                <Field
                                                    name="msssql_port"
                                                    id="id_msssql_port"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_msssql_username">Username</label>
                                                <Field
                                                    name="msssql_username"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_msssql_username"
                                                />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_msssql_password">Password</label>
                                                <Field
                                                    name="msssql_password"
                                                    type="password"
                                                    className="form-control"
                                                    id="id_msssql_password"
                                                />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="id_msssql_database">Database Name</label>
                                                <Field
                                                    name="msssql_database"
                                                    id="id_msssql_database"
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
                <BackButton {...this.props} name={'Буцах'} navlink_url={`/back/another-base/`}></BackButton>
            </div>
        )
    }
}

export default ConnectionConfig;
