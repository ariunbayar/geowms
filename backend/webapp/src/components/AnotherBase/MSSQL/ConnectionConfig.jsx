import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'

import {service} from '../service'
import BackButton from "@utils/Button/BackButton"


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('хоосон байна!'),
    definition: Yup.string(),
    msssql_server: Yup.string()
        .required('хоосон байна!'),
    msssql_port: Yup.string()
        .required('хоосон байна!'),
    msssql_username: Yup.string()
        .required('хоосон байна!'),
    msssql_password: Yup.string()
        .required('хоосон байна!'),
    msssql_database: Yup.string()
        .required('хоосон байна!'),
})


class ConnectionConfig extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                id: props.match.params.id,
                name: '',
                definition: '',
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
        const {id} = this.props.match.params
        if(id) this.getConfigs(id)
    }

    getConfigs(id) {
        service
            .mssql_config
            .get(id)
            .then(({values}) => {
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
                                    <fieldset>
                                        <div className="form-row">
                                            <div className="form-group col-md-6 text-wrap">
                                                <label htmlFor="id_name">Нэр</label>
                                                <Field
                                                    name="name"
                                                    id="id_name"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['name']}</p>
                                            </div>
                                            <div className="form-group col-md-6 text-wrap">
                                                <label htmlFor="id_definition">Тайлбар</label>
                                                <Field
                                                    name="definition"
                                                    id="id_definition"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['definition']}</p>
                                            </div>
                                            <div className="form-group col-md-6 text-wrap">
                                                <label htmlFor="id_msssql_server">Server IP</label>
                                                <Field
                                                    name="msssql_server"
                                                    id="id_msssql_server"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['msssql_server']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_msssql_port">Server PORT</label>
                                                <Field
                                                    name="msssql_port"
                                                    id="id_msssql_port"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['msssql_port']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_msssql_username">Username</label>
                                                <Field
                                                    name="msssql_username"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_msssql_username"
                                                />
                                                <p className="text-danger">{errors['msssql_username']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_msssql_password">Password</label>
                                                <Field
                                                    name="msssql_password"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_msssql_password"
                                                />
                                                <p className="text-danger">{errors['msssql_password']}</p>
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="id_msssql_database">Database Name</label>
                                                <Field
                                                    name="msssql_database"
                                                    id="id_msssql_database"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['msssql_database']}</p>
                                            </div>
                                        </div>

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

                                    </fieldset>

                                    { status == 'save_success' &&
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

                                    { status == 'save_error' &&
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
