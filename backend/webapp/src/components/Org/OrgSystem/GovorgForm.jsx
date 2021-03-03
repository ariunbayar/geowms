import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {service} from "./service"
import {validationSchema} from './validationSchema'
import ModalAlert from "../../ModalAlert"
import BackButton from "@utils/Button/BackButton"


export class GovorgForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            govorg: {},
            wms_list: [],
            layers: [],
            modal_alert_status: "closed",
            title: '',
            model_type_icon: '',
            timer: null,
        }

        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {

        const system_id = this.props.match.params.system_id
        service.getWMSList().then(({wms_list}) => {
            this.setState({wms_list})
        })

        if (system_id) {
            service.detail(system_id).then(({govorg}) => {
                this.setState(({govorg, layers: govorg.layers,}))
            })
        }

    }

    handleLayerToggle(e) {
        let layers = this.state.layers

        const value = parseInt(e.target.value)

        if (e.target.checked) {
            layers.push(value)
        } else {
            layers = layers.filter((id) => id != value)
        }
        this.setState({layers})
    }

    handleSubmit(values, {setStatus, setSubmitting, setErrors}) {
        const org_id = this.props.match.params.id
        const data = {
            ...values,
            layers: this.state.layers,
            'org': org_id
        }

        setStatus('checking')
        setSubmitting(true)

        if(this.state.govorg.id){
            data.id = this.state.govorg.id
            service.update(data).then(({success, info, errors}) => {
                if (success){
                    setStatus('saved')
                    setSubmitting(false)
                    this.setState({
                        modal_alert_status: "open",
                        title: info,
                        model_type_icon: 'success',
                    })
                    this.modalCloseTime()
                } else {
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
        } else{
            service.create(data).then(({success, info, errors}) => {
                if (success){
                    setStatus('saved')
                    setSubmitting(false)
                    this.setState({
                        modal_alert_status: "open",
                        title: info,
                        model_type_icon: 'success',
                    })
                    this.props.refreshCount()
                    this.modalCloseTime()
                } else {
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
        }

    }

    modalCloseTime(){
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.state.timer = setTimeout(() => {
            this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`)
        }, 2000)
    }

    modalClose(){
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        this.props.history.push(`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/`)
    }

    render() {
        return (

            <div className="my-4">
                <div className="row">
                    <div className="col-md-4">
                        <Formik
                            enableReinitialize
                            initialValues={{
                                name: this.state.govorg.name || '',
                                website: this.state.govorg.website || '',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                            {({
                                errors,
                                status,
                                touched,
                                isSubmitting,
                                setFieldValue,
                                handleBlur,
                                values,
                                isValid,
                                dirty,
                            }) => {
                                const has_error = Object.keys(errors).length > 0
                                return (
                                    <Form>

                                        <div className="form-group">

                                            <label htmlFor="id_name" >
                                                Системүүдийн нэр:
                                            </label>

                                            <Field
                                                className={'form-control mb-2' + (errors.name ? ' is-invalid' : '')}
                                                placeholder="Системүүдийн нэр"
                                                name='name'
                                                id="id_name"
                                                type="text"
                                            />
                                            <ErrorMessage name="name" component="div" className="invalid-feedback"/>

                                            <label htmlFor="id_website">
                                                Домэйнээр хязгаарлах:
                                            </label>
                                            <Field
                                                className={'form-control my-1' + (errors.website ? ' is-invalid' : '')}
                                                placeholder="Байршуулах вэбсайт"
                                                name='website'
                                                id="id_website"
                                                type="text"
                                            />
                                            <ErrorMessage name="website" component="div" className="invalid-feedback"/>
                                            <small className="text-muted">Жишээ нь: https://domain.mn</small>
                                        </div>

                                        <div></div>
                                        <div className="span3">
                                            <div>
                                                <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting}>
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
                    <div className="col-md-8">
                     {this.state.wms_list.map((wms, wms_index) =>
                        <div className="col-md-12" id="accordion1" key={wms_index}>
                            <div className="row">
                                <div className="col-md-8 arrow-tree">
                                    <a className="btn btn-link shadow-none collapsed"
                                        data-toggle="collapse"
                                        data-target={`#collapse-${wms_index}`}
                                        aria-expanded="true"
                                        aria-controls="collapse-1"
                                    >
                                    {wms.is_active ?
                                    <i className="fa fa-check-circle" style={{color:"green"}} aria-hidden="false"></i>:
                                    <i className="fa fa-times-circle" style={{color:"#FF4748"}}></i>
                                    }
                                    <strong> {wms.name}</strong> {wms.public_url}
                                    </a>
                                </div>
                            </div>
                            {wms.is_active && wms.layer_list.map((layer, idx) =>
                                <div key={idx}  id={`collapse-${wms_index}`} className="ml-5 collapse" data-parent="#accordion1">
                                    <label>
                                        <input type="checkbox"
                                            value={layer.id}
                                            onChange={this.handleLayerToggle}
                                            checked={this.state.layers.indexOf(layer.id) > -1}
                                        />
                                        {} {layer.title} ({layer.code})
                                    </label>
                                </div>
                            )}
                        </div>
                    )}
                    </div>
                </div>
                <ModalAlert
                    modalAction={() => this.modalClose()}
                    status={this.state.modal_alert_status}
                    title={this.state.title}
                    model_type_icon = {this.state.model_type_icon}
                />
            </div>

        )
    }
}
