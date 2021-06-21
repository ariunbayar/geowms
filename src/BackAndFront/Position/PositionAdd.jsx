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
            modal_status: "closed",
            is_backend: props.is_backend,
            prefix: `/back/байгууллага/түвшин/${props.match.params.level}/${props.match.params.id}/position/create/`,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleCongfig = this.handleCongfig.bind(this)
    }

    componentDidMount() {
        this.handleCongfig()
    }

    handleCongfig() {
        const { is_allow, is_backend } = this.props
        const { level, id } = this.props.match.params
        if (is_backend) {
            this.setState({
                prefix: `/back/байгууллага/түвшин/${level}/${id}/position/create/`,
            })
        }
        else {
            this.setState({
                prefix: "/gov/api/role/position/create/",
            })
        }
    }

    handleSubmit(form_values, { setSubmitting }) {
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
                    alert("success")
                }
                else {
                    alert("else")
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
        const { form_values, is_backend } = this.state

        return (
            <div className={`${!is_backend && "card" }`}>
                <div className={`${!is_backend && "card-body" }`}>
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
