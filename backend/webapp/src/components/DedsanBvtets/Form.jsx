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
            values: {},
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.getFields = this.getFields.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        console.log(values)
        // service
        //     .update(values, this.state.pid, this.state.fid)
        //     .then(({ success }) => {
        //         if (success) {
        //             this.setState({is_loading:true})

        //         }
        //     })
    }

    componentDidUpdate(pP){
    }

    componentDidMount() {
        this.getFields('theme')
    }

    getFields(name){
        service.getFields(name).then(({ fields }) => {
           if(fields)
           {
               console.log(fields)
               this.setState({values: fields, is_loading:false})
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
                {this.props.gid &&<h4 className="text-center">Geom дугаар-{this.props.gid}</h4>}
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
                                                <div role="group" aria-labelledby="my-radio-group">
                                                    <label>
                                                    <Field type="radio" name={`form_values.${index}.data`} value="true" />
                                                        True
                                                    </label>&nbsp;
                                                    <label>
                                                    <Field type="radio" name={`form_values.${index}.data`} value="false" />
                                                        False
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