import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
    emy_logo: Yup.string(),
    batlagdsan_tohioldol: Yup.string(),
    edgersen_humuusiin_too: Yup.string(),
    emchlegdej_bui_humuus_too: Yup.string(),
    tusgaarlagdsan_humuusiin_too: Yup.string(),
    medeellin_eh_survalj: Yup.string(),
    emiin_sangiin_too: Yup.string(),
    emlegiin_too: Yup.string(),
    niit_eruul_mend_baiguullaga_too: Yup.string(),
    gzbgzzg_logo: Yup.string(),
    title: Yup.string(),
})

export default class CovidConfig extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                emy_logo:'',
                batlagdsan_tohioldol:'',
                edgersen_humuusiin_too:'',
                emchlegdej_bui_humuus_too:'',
                tusgaarlagdsan_humuusiin_too:'',
                medeellin_eh_survalj:'',
                emiin_sangiin_too:'',
                emlegiin_too:'',
                niit_eruul_mend_baiguullaga_too:'',
                gzbgzzg_logo:'',
                title:'',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        service.config.covid.get().then((values) => {
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

        service.config.covid
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
                    Covid
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
                                            <div className="form-group col-md-12">
                                                <label htmlFor="title">Гарчиг</label>
                                                <Field
                                                    name="title"
                                                    id="id_title"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emy_logo">ЕМЯ logo</label>
                                                <Field
                                                    name="emy_logo"
                                                    id="id_emy_logo"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="gzbgzzg_logo">ГЗБГЗЗГ logo</label>
                                                <Field
                                                    name="gzbgzzg_logo"
                                                    id="id_gzbgzzg_logo"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="batlagdsan_tohioldol">Батлагдсан тохиолдол</label>
                                                <Field
                                                    name="batlagdsan_tohioldol"
                                                    id="id_batlagdsan_tohioldol"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="edgersen_humuusiin_too">Эдгэрсэн хүмүүсийн тоо</label>
                                                <Field
                                                    name="edgersen_humuusiin_too"
                                                    id="id_edgersen_humuusiin_too"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emchlegdej_bui_humuus_too">Эмчлэгдэж буй хүмүүсийн тоо</label>
                                                <Field
                                                    name="emchlegdej_bui_humuus_too"
                                                    id="id_emchlegdej_bui_humuus_too"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="tusgaarlagdsan_humuusiin_too">Тусгаарлагдаж буй хүмүүсийн тоо</label>
                                                <Field
                                                    name="tusgaarlagdsan_humuusiin_too"
                                                    id="id_tusgaarlagdsan_humuusiin_too"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="medeellin_eh_survalj">Мэдээллийн эх сурвалж</label>
                                                <Field
                                                    name="medeellin_eh_survalj"
                                                    id="id_medeellin_eh_survalj"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emiin_sangiin_too">Эмийн сангийн тоо</label>
                                                <Field
                                                    name="emiin_sangiin_too"
                                                    id="id_emiin_sangiin_too"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="emlegiin_too">Эмнэлгийн тоо</label>
                                                <Field
                                                    name="emlegiin_too"
                                                    id="id_emlegiin_too"
                                                    type="text"
                                                    className="form-control"
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="niit_eruul_mend_baiguullaga_too">Нийт эрүүл мэндийн байгуулагын тоо</label>
                                                <Field
                                                    name="niit_eruul_mend_baiguullaga_too"
                                                    id="id_niit_eruul_mend_baiguullaga_too"
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
