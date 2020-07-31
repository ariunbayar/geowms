import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {TextField} from '../../helpers/forms'
import {service} from "./service"
import {validationSchema} from './validationSchema'

export class GovorgForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            govorg: {},
            wms_list: [],
            values: {
                id: '',
                name: '',
            },
            layers: [],
        }

        this.handleLayerToggle = this.handleLayerToggle.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentDidMount() {

        Promise.all([
            service.getWMSList(),
            service.detail(this.props.match.params.id),
        ]).then(([{wms_list}, {govorg}]) => {
            this.setState({govorg, layers: govorg.layers, wms_list})
        })
    }

    componentDidUpdate(prevProps) {

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

    handleSubmit(values, {setStatus, setSubmitting}) {

        const data = {
            ...values,
            layers: this.state.layers,
        }

        setStatus('checking')
        setSubmitting(true)

        if(this.state.govorg.id){
            data.id = this.state.govorg.id
            service.update(data).then(({success}) => {
                setTimeout(() => {
                    setStatus('saved')
                    setSubmitting(false)
                    this.props.history.push( '/back/систем/')
                }, 800)
            })
        }
        else{

            service.create(data).then(({success}) => {
                setTimeout(() => {
                    setStatus('saved')
                    setSubmitting(false)
                    this.props.history.push( '/back/систем/')
                }, 800)
            })
        }

    }

    render() {
        const {name, token} = this.state.govorg
        return (

            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <a href="#" className="btn btn-outline-primary" onClick={this.props.history.goBack}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </a>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-4">
                        <Formik
                            enableReinitialize
                            initialValues={this.state.govorg}
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
                                                className={'form-control ' + (errors.name ? 'is-invalid' : '')}
                                                name="name"
                                                placeholder="Системүүдийн нэр"
                                                id="id_name"
                                                type="text"
                                            />

                                            <ErrorMessage name="name" component="div" className="invalid-feedback"/>
                                        </div>

                                        <div></div>
                                        <div className="span3">
                                            {has_error
                                                ?
                                                    <p> </p>
                                                : status == 'saved' && !dirty &&
                                                    <p>
                                                        Амжилттай нэмэгдлээ
                                                    </p>
                                            }
                                            <div>
                                                <button type="submit" className="btn gp-bg-primary" disabled={isSubmitting || has_error}>
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
                     {this.state.wms_list.map((wms) =>
                        <div className="col-md-12 mb-4" key={wms.id}>
                                    {wms.is_active ?
                                        <div className="row">
                                            <div className="col-md-12">
                                                <i className="fa fa-check-circle" style={{color:"green"}} aria-hidden="false"></i>
                                                <a> &nbsp;<strong>{wms.name}</strong>{wms.public_url}</a>
                                            </div>
                                        </div> :
                                        <div className="row">
                                            <div className="col-md-12">
                                                 <i className="fa fa-times-circle" style={{color:"#FF4748"}}></i>
                                                 <del><a> &nbsp;<strong>{wms.name}</strong>{wms.public_url}</a></del>
                                            </div>
                                        </div>
                                    }
                            {wms.layer_list.map((layer, idx) =>
                                <div key={idx}>
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
            </div>

        )
    }
}