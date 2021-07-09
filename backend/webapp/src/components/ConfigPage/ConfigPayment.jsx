import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'

import {service} from './service'


const validationSchema = Yup.object().shape({
    POLYGON_PER_KM_AMOUNT: Yup.string(),
    POLYGON_PER_M_AMOUNT: Yup.string(),
    PROPERTY_PER_AMOUNT: Yup.string(),
})


export default class ConfigPayment extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
                POLYGON_PER_KM_AMOUNT: '',
                POLYGON_PER_M_AMOUNT: '',
                PROPERTY_PER_AMOUNT: '',
            },
            values: {},
        }

        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.ChangeState = this.ChangeState.bind(this)
    }

    componentDidMount() {
        service.config.payment.get().then((values) => {
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

        service.config.payment
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

        ChangeState(state){
            this.setState(prevState => ({ [state]: !prevState[state] }))
        }

    render() {

        const {
            is_editing,
            initial_values,
            is_seperate, is_point,
        } = this.state

        return (
            <div className="card">
                <div className="card-header">
                    Үнийн тохиргоо
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
                            status,
                            setStatus,
                        }) => {
                            return (
                                <Form>
                                    <fieldset disabled={ !is_editing }>
                                        <div className="form-row">
                                            <label role='button' className={is_seperate && 'text-info col-md-12'} htmlFor='payment_seperate'>
                                                <i
                                                    id='payment_seperate'
                                                    role='button'
                                                    className={`fa ${is_seperate ? 'fa-angle-right' : 'fa-angle-down'} text-secondary mr-2`}
                                                    onClick={() => this.ChangeState('is_seperate') }>
                                                </i>
                                                Хэсэгчлэн худалдан авалтын үнэ
                                            </label>
                                            {
                                                is_seperate
                                                &&
                                                <>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="POLYGON_PER_KM_AMOUNT">POLYGON PER KM AMOUNT</label>
                                                        <Field
                                                            name="POLYGON_PER_KM_AMOUNT"
                                                            id="id_POLYGON_PER_KM_AMOUNT"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="POLYGON_PER_M_AMOUNT">POLYGON PER M AMOUNT</label>
                                                        <Field
                                                            name="POLYGON_PER_M_AMOUNT"
                                                            id="id_POLYGON_PER_M_AMOUNT"
                                                            type="text"
                                                            className="form-control"
                                                        />
                                                    </div>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="PROPERTY_PER_AMOUNT">PROPERTY PER AMOUNT</label>
                                                            <Field
                                                                name="PROPERTY_PER_AMOUNT"
                                                                id="id_PROPERTY_PER_AMOUNT"
                                                                type="text"
                                                                className="form-control"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className="form-row">
                                            <label role='button' className={`${is_point && 'text-info'} mb-1`}>
                                                <i
                                                    role='button'
                                                    className={`fa ${is_point ? 'fa-angle-right' : 'fa-angle-down'} text-secondary mr-2`}
                                                    onClick={() => this.ChangeState('is_point')}>

                                                </i>
                                                Цэгүүдийн үнэ
                                            </label>
                                            {
                                                is_point
                                                &&
                                                <div className='form-row'>
                                                    {
                                                        initial_values.code_list &&
                                                            initial_values.code_list.map((code_list, idx) =>
                                                                <div key={idx}className="form-group col-md-6">
                                                                    <label>
                                                                        {code_list.code_list_name}
                                                                    </label>
                                                                    <Field
                                                                        id={code_list.code_list_name}
                                                                        name={code_list.code_list_code}
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                </div>
                                                            )
                                                    }
                                                </div>
                                            }
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
