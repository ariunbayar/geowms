import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {service} from './service'
import BackButton from "@utils/Button/BackButton"


const validationSchema = Yup.object().shape({
    minute: Yup.string()
        .required('хоосон байна!'),
    hour: Yup.string()
        .required('хоосон байна!'),
    day: Yup.string()
        .required('хоосон байна!'),
    month: Yup.string()
        .required('хоосон байна!'),
    day_week: Yup.string()
        .required('хоосон байна!'),
})

class CronTab extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                id: props.match.params.id,
                minute: '',
                hour: '',
                day: '',
                month: '',
                day_week: '',
                crontab_is_active: false
            },
            info: '',
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
            .cronTabDetail(id)
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
            .cronTabSave(values)
            .then(({ success, errors, info }) => {

                if (success) {
                    setStatus('save_success')
                    this.setState({info})
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
            info
        } = this.state

        return (
            <div className="card">

                <div className="card-header">
                    CronTab Тохиргоо
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
                                            <div className="form-group col-md-1 text-wrap">
                                                <label htmlFor="id_minute">minute</label>
                                                <Field
                                                    name="minute"
                                                    id="id_minute"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['minute']}</p>
                                            </div>
                                            <div className="form-group col-md-1 text-wrap">
                                                <label htmlFor="id_hour">hour</label>
                                                <Field
                                                    name="hour"
                                                    id="id_hour"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['hour']}</p>
                                            </div>
                                            <div className="form-group col-md-1">
                                                <label htmlFor="id_day">day(month)</label>
                                                <Field
                                                    name="day"
                                                    id="id_day"
                                                    type="text"
                                                    className="form-control"
                                                />
                                                <p className="text-danger">{errors['day']}</p>
                                            </div>
                                            <div className="form-group col-md-1">
                                                <label htmlFor="id_month">month</label>
                                                <Field
                                                    name="month"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_month"
                                                />
                                                <p className="text-danger">{errors['month']}</p>
                                            </div>
                                            <div className="form-group col-md-1">
                                                <label htmlFor="id_day_week">day(week)</label>
                                                <Field
                                                    name="day_week"
                                                    type="text"
                                                    className="form-control"
                                                    id="id_day_week"
                                                />
                                                <p className="text-danger">{errors['day_week']}</p>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-1">
                                            <label htmlFor="id_crontab_is_active">Идэвхжүүлэх</label>
                                            <Field
                                                className="ml-2"
                                                name='crontab_is_active'
                                                id="id_crontab_is_active"
                                                type="checkbox"
                                            />
                                            <p className="text-danger">{errors['crontab_is_active']}</p>
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
                                    { info &&
                                         <div className="alert alert-icon-success alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-success">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>{info}</span>
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

export default CronTab;