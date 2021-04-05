import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import * as Yup from 'yup'
import { service } from './service'
import ModalAlert from "@utils/Modal/ModalAlert"
import InspireMap from "@utils/BundleMap"
import {NemaPP} from './covid_dashboard/components/nemapop'
import BackButton from "@utils/Button/BackButton"


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
                is_open: 1,
                layer_name: '',
                created_by: '',
                created_at: '',
                user_id: '',
            },

            modal_alert_status: 'closed',
            model_alert_text: '',
            model_alert_icon: 'success',
            timer: null,
            url:'',
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
        service.getDetialAll(id).then(({nema_detail_list, url}) => {
            if( nema_detail_list.length >0 ) {
                nema_detail_list = nema_detail_list[0]
                this.setState({
                    form_values: {
                        code: nema_detail_list.code,
                        is_open: nema_detail_list.is_open,
                        layer_name: nema_detail_list.layer_name,
                        created_by: nema_detail_list.created_by,
                        created_at: nema_detail_list.created_at,
                        user_id: nema_detail_list.user_id,
                    },
                    url
                })
            }
        })
    }

    modalClose(){
        this.setState({modal_alert_status: false})
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {
        const id = this.props.match.params.id
        service
            .create_nema_layer(values, id)
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
        this.props.history.push("/gov/nema/list/")
    }

    render() {
        const {
            form_values, modal_alert_status,
            model_alert_text, model_alert_icon,
            layer_types, url
        } = this.state
        const id = this.props.match.params.id
        return (
            <div className="col-md-12">
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
                                                            <strong>Давхаргын код</strong>
                                                        </label>
                                                        <Field
                                                            type="text"
                                                            name='code'
                                                            id='code'
                                                            className={'form-control col-12' + (errors.code ? 'is-invalid' : '')}
                                                        />
                                                        <ErrorMessage name="code" component="div" className="text-danger"/>
                                                    </div>

                                                    {
                                                        id &&
                                                        <div className="form-row col-md-12 my-2">
                                                            <label htmlFor="" className="col-md-12">
                                                                <strong>Давхаргын Нэр</strong>
                                                            </label>
                                                            <Field
                                                                type="text"
                                                                name='layer_name'
                                                                id='layer_name'
                                                                className={'form-control col-12'}
                                                            />
                                                        </div>
                                                    }
                                                </div>
                                                <div className="form-row col-md-12 mb-4 mt-2">
                                                    <label htmlFor="" className="col-md-6 pt-2">Давхаргын статус</label>
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
                                                {
                                                    id &&
                                                    <div className="form-row col-md-12 mb-4 mt-2">
                                                        <div className="form-group col-md-6 mb-2">
                                                            <label htmlFor="">Үүсгэсэн</label>
                                                            <Field
                                                                className={'form-control'}
                                                                name='created_by'
                                                                id="created_by"
                                                                type="text"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6 mb-2">
                                                            <label htmlFor="">Үүссэн</label>
                                                            <Field
                                                                className={'form-control'}
                                                                name='created_at'
                                                                id="created_at"
                                                                type="text"
                                                            />
                                                        </div>
                                                    </div>

                                                }
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
                    <div className="col-8 col-md-8 col-xl-8">
                        {
                            id &&
                            <InspireMap
                                code={form_values.code }
                                url={url}
                                height="55vh"
                                PPContent={NemaPP}
                            />
                        }
                    </div>
                </div>
                {
                    modal_alert_status &&
                    <ModalAlert
                        modalAction={() => this.modalClose()}
                        status={modal_alert_status}
                        title={model_alert_text}
                        model_type_icon={model_alert_icon}
                    />
                }
                <BackButton {...this.props} name={'Буцах'} navlink_url={`/gov/nema/list/`}></BackButton>
            </div>
        )

    }

}
