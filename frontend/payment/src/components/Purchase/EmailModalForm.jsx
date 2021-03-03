import React, {Component, Fragment} from "react"
import { Formik, Form, Field, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import {service} from '../service'

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(({ value }) => `Зөв e-mail хаяг оруулна уу.`)
        .max(254, '254-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна e-mail хаяг оруулна уу.'),
})


export default class EmailModalForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initial_values:{
                email: '',
            },
            status: this.props.status || 'initial',
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleProceed = this.handleProceed.bind(this)
    }

    componentDidMount() {
        if (this.state.status == 'initial') {
            this.handleOpen()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.status != prevProps.status) {
            if (['initial', 'open'].includes(this.props.status)) {
                this.handleOpen()
            }
            if (['closing', 'closed'].includes(this.props.status)) {
                this.handleClose()
            }
        }
    }

    handleOpen() {
        this.setState({status: 'initial'})
        setTimeout(() => {
            this.setState({status: 'open'})
        }, 0)
    }

    handleClose(callback) {
        this.setState({status: 'closing'})
        setTimeout(() => {
            this.setState({status: 'closed'})
            if (callback) {
                callback()
            } else {
                this.setState({ status: 'closed' })
                if (this.props.modalClose) {
                    this.props.modalClose()
                }
            }
        }, 150)
    }

    handleProceed(values, { setStatus, setSubmitting, setErrors }) {
        service.setEmail(values.email).then(({success, errors}) => {
            if (success) {
                setStatus('saved')
                setSubmitting(false)
                this.handleClose(this.props.modalAction)
            }else{
                setErrors(errors)
                setSubmitting(false)
            }
        })
    }

    render () {
        const {status, initial_values} = this.state

        const className =
            "modal fade" +
            (status == 'initial' ? ' d-block' : '') +
            (status == 'open' ? ' show d-block' : '') +
            (status == 'closing' ? ' d-block' : '') +
            (status == 'closed' ? ' d-none' : '')

        const classNameBackdrop =
            "modal-backdrop fade" +
            (status == 'open' ? ' show' : '') +
            (status == 'closed' ? ' d-none' : '')
        const {body_component} = this.props

        return (
            <Fragment>
                <Formik
                    initialValues={initial_values}
                    enableReinitialize
                    validationSchema={validationSchema}
                    onSubmit={this.handleProceed}
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
                                <div className={className}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content" style={{border: 'none', borderRadius: "7px", background: "#ebebeb"}}>
                                            <div className="col-md-12 offset-md-12 float-right my-1">
                                                <button type="button" className="close mt-2 mr-2" aria-label="Close">
                                                    <span aria-hidden="true" onClick={() => this.handleClose()} >&times;</span>
                                                </button>
                                            </div>
                                            <div className="d-flex justify-content-center">
                                                <h5>Таны e-mail хаяг хоосон байна.</h5>
                                            </div>
                                            <div className="modal-body text-center text-wrap ml-2 mr-2 text-justify">
                                                <div className="row">

                                                    <div className="form-group col-md-12">
                                                        <div className="row">
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="email">Бүртгүүлэх e-mail хаяг оруулна уу</label>
                                                                    <Field
                                                                        name="email"
                                                                        id="id_email"
                                                                        type="text"
                                                                        className="form-control"
                                                                    />
                                                                    <ErrorMessage className="text-danger" name="email" component="span"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer" style={{border: 'none'}}>
                                                <button type="button" onClick={() => this.handleClose()} className="btn btn-primary waves-effect waves-light">
                                                    <i className="fa fa-times"></i>
                                                    {"  БУЦАХ"}
                                                </button>
                                                <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || Object.keys(errors).length >0}>
                                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                    {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                    {!isSubmitting && <i className="fa fa-check-square-o">Үргэлжлүүлэх</i>}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                            )
                        }}
                    </Formik>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }

}
