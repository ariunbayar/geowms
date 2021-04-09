import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'

import {service} from '../service'
import BackButton from "@utils/Button/BackButton"


const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('хоосон байна!'),
    definition: Yup.string(),
    mongo_engine: Yup.string()
        .required('хоосон байна!'),
    mongo_client_host: Yup.string()
        .required('хоосон байна!'),
    mongo_client_username: Yup.string(),
    mongo_client_password: Yup.string(),
    mongo_database: Yup.string()
        .required('хоосон байна!'),
    mongo_port: Yup.string()
        .required('хоосон байна!')
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
                mongo_engine: '',
                mongo_client_host: '',
                mongo_client_username: '',
                mongo_client_password: '',
                mongo_database: '',
                mongo_port: '',
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
            .mongo_config
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

    handleSubmit(values, { setStatus, setValues, setErrors }) {

        setStatus('saving')
        service
            .mongo_config
            .save(values)
            .then(({ success, errors }) => {

                if (success) {
                    setStatus('save_success')
                } else {
                    setErrors(errors)
                    return Promise.reject()
                }

            })
            .catch(() => {
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
                    MongoDB Connection Тохиргоо
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
                                                <label htmlFor="id_mongo_engine">ENGINE</label>
                                                <Field
                                                    name="mongo_engine"
                                                    id="id_mongo_engine"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['mongo_engine']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_mongo_client_host">Server HOST</label>
                                                <Field
                                                    name="mongo_client_host"
                                                    id="id_mongo_client_host"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['mongo_client_host']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_mongo_client_username">Username</label>
                                                <Field
                                                    name="mongo_client_username"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_mongo_client_username"
                                                />
                                                <p className="text-danger">{errors['mongo_client_username']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_mongo_client_password">Password</label>
                                                <Field
                                                    name="mongo_client_password"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_mongo_client_password"
                                                />
                                                <p className="text-danger">{errors['mongo_client_password']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_mongo_database">Database Name</label>
                                                <Field
                                                    name="mongo_database"
                                                    id="id_mongo_database"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['mongo_database']}</p>
                                            </div>
                                            <div className="form-group col-md-6">
                                                <label htmlFor="id_mongo_port">Port</label>
                                                <Field
                                                    name="mongo_port"
                                                    id="id_mongo_port"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['mongo_port']}</p>
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
