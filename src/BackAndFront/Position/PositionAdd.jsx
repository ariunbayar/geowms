import React, { Component } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import { object, string } from 'yup'

import { service } from "./service"


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
            is_backend: props.is_backend,
            org_id: props.match.params.id,
            level: props.match.params.level,
            link: ``,
            back_link: ``,
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleConfig = this.handleConfig.bind(this)
    }

    UNSAFE_componentWillMount() {
        this.handleConfig()
    }

    handleConfig() {
        const { is_backend } = this.props
        const { org_id, level } = this.state
        var link
        if (is_backend) {
            this.setState({
                link: `/back/api/org/${org_id}/position/create/`,
                back_link: `/back/байгууллага/түвшин/${level}/${org_id}/position/`
            })
        }
        else {
            this.setState({
                link: "/gov/api/role/position/create/",
                back_link: `/gov/perm/position/`
            })
        }
    }

    handleSubmit(form_values, { setSubmitting }) {
        const { link } = this.state
        service
            .postRequest(link, form_values)
            .then(({success, data, error}) => {
                if (success) {
                    const modal = {
                        modal_status: "open",
                        modal_icon: "fa fa-check-circle",
                        modal_bg: '',
                        icon_color: 'success',
                        title: "Амжилттай хадгаллаа",
                        text: data,
                        has_button: false,
                        actionNameBack: '',
                        actionNameDelete: '',
                        modalAction: null,
                        modalClose: () => this.props.history.push(this.state.back_link)
                    }
                    global.MODAL(modal)
                }
                else {
                    const modal = {
                        modal_status: "open",
                        modal_icon: "fa fa-times-circle",
                        modal_bg: '',
                        icon_color: 'danger',
                        title: 'Алдаа гарлаа',
                        text: error,
                        has_button: false,
                        actionNameBack: '',
                        actionNameDelete: '',
                        modalAction: null,
                        modalClose: null
                    }
                    global.MODAL(modal)
                }
            })
        setSubmitting(false)
    }

    render() {
        const { form_values, is_backend } = this.state

        return (
            <div className={`${!is_backend && "card"}`}>
                <div className={`${!is_backend && "card-body"}`}>
                    <div className="row">
                        <Formik
                            enableReinitialize
                            initialValues={form_values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                        {({
                            errors,
                            isSubmitting,
                        }) => {
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
            </div>
        )
    }
}

export default PositionAdd
