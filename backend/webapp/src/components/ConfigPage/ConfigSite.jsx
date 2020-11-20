import React, { Component, Fragment } from "react"

import {service} from './service'
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'


const validationSchema = Yup.object().shape({
    site_title: Yup.string(),
    site_footer_text: Yup.string(),
    agency_name: Yup.string(),
    agency_contact_address: Yup.string(),
    agency_contact_email: Yup.string(),
    agency_contact_phone: Yup.string(),
})


export default class ConfigSite extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                site_title: '',
                site_footer_text: '',
                agency_name: '',
                agency_contact_address: '',
                agency_contact_email: '',
                agency_contact_phone: '',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        service.config.site.get().then((values) => {
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

        service.config.site
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
                <div className="card-body">

                    <div className="card-header">
                        Сайтын тохиргоо
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
                                            <div className="form-group">
                                                <label htmlFor="id_site_title">Сайтын гарчиг</label>
                                                <Field
                                                    name="site_title"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_site_title"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="id_site_footer_text">Footer текст</label>
                                                <Field
                                                    name="site_footer_text"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_site_footer_text"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="id_agency_name">Агентлагийн нэр</label>
                                                <Field
                                                    name="agency_name"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_agency_name"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="id_agency_contact_address">Хаяг</label>
                                                <Field
                                                    name="agency_contact_address"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_agency_contact_address"
                                                />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="id_agency_contact_email">Мэйл</label>
                                                    <Field
                                                        name="agency_contact_email"
                                                        type="text"
                                                        className="form-control"
                                                        id="agency_contact_email"
                                                    />
                                                </div>
                                                <div className="form-group col-md-6">
                                                    <label htmlFor="id_agency_contact_phone">Утас</label>
                                                    <Field
                                                        name="agency_contact_phone"
                                                        type=""
                                                        className="form-control"
                                                        id="id_agency_contact_phone"
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
            </div>

        )
    }
}
