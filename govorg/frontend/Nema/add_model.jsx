import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { service } from './service'

const validationSchema = Yup.object().shape({
    code: Yup.string()
    .required('Давхаргын нэр оруулна уу !'),
})

export class ModelAddNema extends Component {

    constructor(props) {
        super(props)
        this.state = {
            form_values: {
                code: '',
                is_open: 1
            },
            modal_alert_status: 'closed',
            model_alert_text: '',
            model_alert_icon: 'success',
            timer: null,
            layer_types: [
                {'layer_choice': '1', 'choice_value': 'Нээлттэй'},
                {'layer_choice': '2', 'choice_value': 'Хаалттай'},
            ]
        }
        this.getDetialAll = this.getDetialAll.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)

    }

    componentDidMount() {
        const id = this.props.match.params.id
        if (id) {
            this.getDetialAll(id)
        }

    }

    getDetialAll(id) {
        service.getGroupDetial(id).then(({nema_detail}) => {
            if( nema_detail ) {
                this.setState({
                    form_values: {
                        code: nema_detail.code
                    },
                })
            }
        })
    }

    modalClose(){
        this.setState({select_layer_status: false})
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {
        const id = this.props.match.params.id
        service
            .create_nema_layer(values)
            .then(({ success, info, errors }) => {
                if (success) {
                    this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'success'})
                    setStatus('saved')
                    this.modalCloseTime()
                } else {
                    if (errors) {
                        setErrors(errors)
                    }
                    else {
                        this.setState({modal_alert_status: "open", model_alert_text: info, model_alert_icon: 'danger'})
                    }
                    setSubmitting(false)
                }
            })

    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
        this.props.history.push("/gov/nema/")
    }

    render() {
        const {
            form_values, modal_alert_status,
            model_alert_text, model_alert_icon,
            layer_types
        } = this.state
        const id = this.props.match.params.id
        return (
            <div className="col-md-8">
                <div className="row">
                    <div className="col-4 col-md-4 col-xl-4">
                        <div className="row">
                            <div className="col-12 mt-3 col-md-12 col-xl-12">
                                <div className="h-100">
                                    <Formik
                                        enableReinitialize
                                        initialValues={
                                            form_values
                                        }
                                        validationSchema={validationSchema}
                                        onSubmit={this.handleSubmit}
                                    >
                                    {({
                                        errors,
                                        isSubmitting,
                                    }) => {
                                    return (
                                        <Form>
                                            <div className="form-row col-md-12">
                                                <div className="form-row col-md-12 d-inline-block text-dark">
                                                    <div className="form-row col-md-12">
                                                        <label htmlFor="" className="col-md-12">
                                                            <strong>Давхаргын нэр</strong>
                                                        </label>
                                                        <Field
                                                            type="code"
                                                            name='code'
                                                            id='code'
                                                            className={'form-control col-12' + (errors.code ? 'is-invalid' : '')}
                                                        />
                                                        <ErrorMessage name="code" component="div" className="text-danger"/>
                                                    </div>
                                                </div>
                                                <div className="form-row col-md-12 mb-4 mt-2">
                                                    <label htmlFor="" className="col-md-6">Давхаргын харагдац</label>
                                                        <Field
                                                                name='is_open'
                                                                id='is_open'
                                                                as="select"
                                                                className="form-control col-md-6"
                                                        >
                                                            {
                                                                layer_types.map((layer, idy) =>
                                                                <option key = {idy} value={layer.layer_choice}>{layer.choice_value}</option>
                                                                )
                                                            }
                                                        </Field>
                                                </div>
                                                <div className="form-group">
                                                    <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
                                                        {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                        {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                        {!isSubmitting && 'Хадгалах' }
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                        )}}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1>hoho</h1>
                    </div>
                </div>
            </div>
        )

    }

}
