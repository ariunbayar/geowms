import React, { Component } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { object, string } from 'yup'

import { service } from "./service"
import BackButton from "@utils/Button/BackButton"
import Modal from "@utils/Modal/Modal"


export const validationSchema = object().shape({
    name: string()
        .max(250, '250-с илүүгүй урттай утга оруулна уу!')
        .required('Хоосон байна утга оруулна уу.'),
})


export class PositionAdd extends Component {
    constructor(props) {
        super(props)

        this.state = {
            form_values: {
                name: '',
            },
            prefix: "/gov/api/role/position/create/",
            modal_status: "closed",
            is_backend: props.is_backend,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
    }

    handleSubmit(form_values, { setStatus, setSubmitting, setErrors }) {
        const { prefix, is_backend } = this.state
        var go_list
        if (is_backend) {
            form_values["org_id"] = this.props.match.params.id
            go_list = `/back/байгууллага/түвшин/${this.props.match.params.level}/${this.props.match.params.id}/position/`
        }
        else {
            go_list = "/gov/perm/position/"
        }
        service
            .postRequest(prefix, form_values)
            .then(({success, data, error}) => {
                if (success) {
                    this.modalChange(
                        "fa fa-check-circle",
                        null,
                        "success",
                        'Амжилттай нэмлээ',
                        data,
                        false,
                        "",
                        "",
                        null,
                        () => this.props.history.push(go_list)
                    )
                }
                else {
                    this.modalChange(
                        "fa fa-exclamation-circle",
                        null,
                        "danger",
                        "Алдаа гарлаа",
                        error,
                        false,
                        "",
                        "",
                        null,
                        null
                    )
                }
            })
        setSubmitting(false)
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    render() {
        const { form_values } = this.state

        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <Formik
                            enableReinitialize
                            initialValues={ form_values }
                            validationSchema={ validationSchema }
                            onSubmit={ this.handleSubmit }
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
                            const has_error = Object.keys(errors).length > 0
                            return (
                                <Form className="col-12">
                                    <div>
                                        <div className="form-row">
                                            <div className="form-group col-md-6">
                                                <div className="position-relative has-icon-right">
                                                    <label htmlFor="name">Албан тушаал</label>
                                                    <Field
                                                        className={'form-control ' + (errors.name ? 'is-invalid' : '')}
                                                        name='name'
                                                        id="id_name"
                                                        type="text"
                                                        placeholder="Албан тушаал"
                                                    />
                                                    <ErrorMessage name="name" component="div" className="text-danger"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary waves-effect waves-light m-1" disabled={isSubmitting}>
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
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
                <BackButton {...this.props} name={'Буцах'} navlink_url={"/gov/perm/position"}></BackButton>
            </div>
        )
    }
}

export default PositionAdd
