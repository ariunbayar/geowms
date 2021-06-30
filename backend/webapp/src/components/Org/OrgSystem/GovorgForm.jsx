import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {service} from "./service"
import {validationSchema} from './validationSchema'
import Attributes from  './Attributes'
export class GovorgForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            govorg: {},
            wms_list: [],
            layers: [],
            title: '',
            prop_arrow: false,
            accepted_props: []
        }

        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handlePropCheck = this.handlePropCheck.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.modalClose = this.modalClose.bind(this)
    }

    componentDidMount() {
        const { system_id, id } = this.props.match.params
        service
            .getWMSList(id)
            .then(({ wms_list }) => {
                this.setState({ wms_list })
            })

        if (system_id) {
            service
                .detail(system_id)
                .then(({ govorg }) => {
                    this.setState(({ govorg, layers: govorg.layers, accepted_props: govorg.govorg_attributes }))
                })
        }
    }

    getIndexOfLayer(layer_id, val_dict) {
        var find_index = obj => obj.layer_id == layer_id
        var index_of = val_dict.findIndex(find_index)
        return index_of
    }

    handlePropCheck(e) {
        let accepted_props = this.state.accepted_props
        const value = e.target.value
        const layer_id = e.target.name
        var attributes = []
        var index_of = this.getIndexOfLayer(layer_id, accepted_props)

        if (e.target.checked) {
            if (index_of > -1) {
                accepted_props[index_of].attributes.push(value)
            }
            else {
                attributes.push(value)
                accepted_props.push({
                    'layer_id': layer_id,
                    'attributes': attributes
                })
            }
        } else {
            var lists = accepted_props[index_of].attributes.filter((val) => val != value)
            accepted_props[index_of].attributes = lists
        }
        this.setState({ accepted_props })
    }

    handleCheck(layer_id, value) {
        var accepted_props = this.state.accepted_props
        var index_of = this.getIndexOfLayer(layer_id, accepted_props)
        var check_prop = false
        if (index_of > -1) {
            var index_of_prop = accepted_props[index_of].attributes.indexOf(value)
            if (index_of_prop > -1) {
                check_prop = true
            }
        }
        return check_prop
    }

    handleLayerToggle(e) {
        var { layers, accepted_props } = this.state
        const value = parseInt(e.target.value)

        if (e.target.checked) {
            layers.push(value)
        } else {
            layers = layers.filter((id) => id != value)
            accepted_props = accepted_props.filter((val) => val.layer_id != value)
        }
        this.setState({ layers, accepted_props })
    }

    setModal(title, text, icon, has_button) {
        const modal = {
            modal_status: "open",
            modal_icon: icon,
            modal_bg: '',
            icon_color: '',
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: 'Буцах',
            actionNameDelete: '',
            modalAction: '',
            modalClose: this.modalClose,
        }
        global.MODAL(modal)
    }

    handleSubmit(values, { setStatus, setSubmitting, setErrors }) {
        const org_id = this.props.match.params.id
        const data = {
            ...values,
            layers: this.state.layers,
            'org': org_id,
            'accepted_props': this.state.accepted_props
        }

        setStatus('checking')
        setSubmitting(true)

        if(this.state.govorg.id) {
            data.id = this.state.govorg.id
            service.update(data).then(({ success, info, errors }) => {
                if (success) {
                    setStatus('saved')
                    setSubmitting(false)
                    this.setModal(info, '', 'fa fa-check-circle text-success', false)
                } else {
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
        } else{
            service.create(data).then(({ success, info, errors }) => {
                if (success) {
                    setStatus('saved')
                    setSubmitting(false)
                    global.refreshSystemCount()
                    this.setModal(info, '', 'fa fa-check-circle text-success', false)
                } else {
                    setErrors(errors)
                    setSubmitting(false)
                }
            })
        }
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
                                            <label htmlFor="id_name">
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
                        {
                            this.state.wms_list.map((wms, wms_index) =>
                                <div className="col-md-12" id="accordion1" key={wms_index}>
                                    <div className="row">
                                        <div className="col-md-8 arrow-tree">
                                            <a className="btn btn-link shadow-none collapsed"
                                                data-toggle="collapse"
                                                data-target={`#collapse-${wms_index}`}
                                                aria-expanded="true"
                                                aria-controls="collapse-1"
                                            >
                                            {
                                                wms.is_active
                                                ?
                                                    <i className="fa fa-check-circle" style={{color:"green"}} aria-hidden="false"></i>
                                                :
                                                    <i className="fa fa-times-circle" style={{color:"#FF4748"}}></i>
                                            }
                                            <strong>{wms.name}</strong> {wms.public_url}
                                            </a>
                                        </div>
                                    </div>
                                    {
                                        wms.is_active
                                        &&
                                            wms.layer_list.map((layer, idx) =>
                                                <Attributes
                                                    key={idx}
                                                    idx={idx}
                                                    layer={layer}
                                                    wms_index={wms_index}
                                                    layers={this.state.layers}
                                                    handlePropCheck={this.handlePropCheck}
                                                    handleCheck={this.handleCheck}
                                                    handleLayerToggle={this.handleLayerToggle}
                                                />
                                            )
                                    }
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        )
    }
}
