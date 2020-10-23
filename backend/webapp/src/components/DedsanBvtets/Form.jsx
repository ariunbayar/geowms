import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import { service } from "./service"

export default class Forms extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_loading: true,
            pid: props.pid,
            fid: props.fid,
            model_id: null,
            model_name: null,
            values: {},
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.getFields = this.getFields.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        console.log(values)
        const {model_name} = this.state
        service.save(values, model_name).then(({ success, info }) => {
            if (success) {
                alert(info)
                this.setState({is_loading:true})
            }
        })
    }

    componentDidUpdate(pP){
        if(pP.model_name !== this.props.model_name)
        {
            const {model_id, model_name} = this.props
            this.setState({model_id, model_name})
            if(model_name) this.getFields(model_name)

        }
    }

    componentDidMount() {
        const {model_id, model_name} = this.props
        this.setState({model_id, model_name})
        if(model_name) this.getFields(model_name)
    }

    getFields(model_name){
        service.getFields(model_name).then(({ fields }) => {
           if(fields)
           {
                console.log(fields)
                this.setState({values: fields, is_loading:false})
           }
           else
           {
                console.log('get fields gg')
           }
        })
    }

    render() {

        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }

        const { values, id } = this.state
        return (
            <div className='overflow-auto card-body'>
                {this.props.model_name &&<h4 className="text-center">Model-{this.props.model_name}-{this.props.model_id}</h4>}
                <hr></hr>
                <Formik
                    enableReinitialize
                    initialValues={{ form_values: values }}
                    onSubmit={ this.onSubmit}
                    render={({ values }) => (
                        <Form>
                        <FieldArray
                            name="form_values"
                            render={arrayHelpers => (
                            <div>
                                {values.form_values && values.form_values.length > 0 ? (
                                values.form_values.map((friend, index) => (
                                    <div key={index} className="row my-3">
                                        <div className="col-md-3">
                                            <label className="col-form-label">{friend.field_name}</label>
                                        </div>
                                            <div className="col-md-9">
                                                {friend.field_type == 'radio' ?
                                                <div role="group" className="form-check" aria-labelledby="my-radio-group">
                                                    <label>
                                                        <Field
                                                            type="radio"
                                                            className="form-check-input"
                                                            name={`form_values.${index}.data`}
                                                            value="true"
                                                        />
                                                            <b className="text-center">True</b>
                                                    </label>
                                                        <br/>
                                                    <label>
                                                        <Field
                                                            type="radio"
                                                            className="form-check-input"
                                                            name={`form_values.${index}.data`}
                                                            value="false"
                                                        />
                                                            <b className="text-center">False</b>
                                                    </label>
                                                </div>
                                                :
                                                <Field
                                                    name={`form_values.${index}.data`}
                                                    className='form-control'
                                                    placeholder={ friend.field_name}
                                                    type={friend.field_type}
                                                />
                                                }
                                            </div>
                                    </div>
                                ))
                                ) : ( null
                                )}
                                <div>
                                <button type="submit" className="btn btn-block gp-btn-primary">Submit</button>
                                </div>
                            </div>
                            )}
                        />
                        </Form>
                    )}
                    />
            </div>
        )
    }
}