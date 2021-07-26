import React, { Component } from "react"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import {validationSchema} from './validationSchema'
import {service} from "./service"


export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                name: '',
                description: ''
            },
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getDetail = this.getDetail.bind(this)
    }

    componentDidMount() {
        const id = this.props.match.params.id
        if (id) {
            this.getDetail(id)
        }
    }

    getDetail(id) {
        service
            .getDetailRole(id)
            .then(({ success, name, description }) => {
                if (success) {
                    this.setState({
                        values: {
                            name: name,
                            description: description
                        },
                    })
                }
            })
    }

    handleSubmit(values, {setStatus, setSubmitting, setErrors}) {
        setStatus('checking')
        setSubmitting(true)

        service.createPerm(values, this.props.match.params.id).then(({ success, errors }) => {
            if(success) {
                setStatus('saved')
                setSubmitting(false)
                const modal = {
                    modal_status: "open",
                    modal_icon: "fa fa-check-circle",
                    modal_bg: '',
                    icon_color: 'success',
                    title: 'Амжилттай хадгаллаа',
                    text: '',
                    has_button: false,
                    actionNameBack: '',
                    actionNameDelete: '',
                    modalAction: null,
                    modalClose: () => this.props.history.push(`/back/org-role/`)
                }
                global.MODAL(modal)
            } else {
                setSubmitting(false)
                setErrors(errors)
            }
        })

    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <Formik
                                enableReinitialize
                                initialValues={this.state.values}
                                validationSchema={validationSchema}
                                onSubmit={this.handleSubmit}
                            >
                                {({
                                    errors,
                                    isSubmitting,
                                }) => {
                                    const has_error = Object.keys(errors).length > 0
                                    return (
                                        <Form>

                                            <div className="form-group">
                                                <label htmlFor="id_name">Эрхийн нэр:</label>
                                                <Field
                                                    className={'form-control ' + (errors.name ? 'is-invalid' : '')}
                                                    placeholder="Эрхийн нэр"
                                                    name='name'
                                                    id="id_name"
                                                    type="text"
                                                />

                                                <ErrorMessage name="name" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="id_description">Эрхийн тайлбар:</label>
                                                <Field
                                                    className={'form-control ' + (errors.description ? 'is-invalid' : '')}
                                                    placeholder="Эрхийн тайлбар"
                                                    name='description'
                                                    id="id_description"
                                                    type="text"
                                                />

                                                <ErrorMessage name="description" component="div" className="invalid-feedback"/>
                                            </div>
                                            <div></div>
                                            <div className="span3">
                                                <div>
                                                    <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                                        {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                        {isSubmitting && ' Шалгаж байна.'}
                                                        {!isSubmitting && 'Хадгалах' }
                                                    </button>
                                                </div>
                                            </div>
                                        </Form>
                                    )
                                }}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
