import React, { Component, Fragment } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema , FieldArray} from 'formik'
import Modal from "../../../src/components/Modal/DeleteModal"
import { Typify } from "../Components/helpers/typify"
import { service } from "./service"
import { validationSchema } from './validationSchema'

export default class Маягт extends Component {

    constructor(props) {
        super(props)

        this.state = {
            is_loading: true,
            pid: props.pid,
            fid: props.fid,
            values: {},
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleUpdate = this.handleUpdate.bind(this)
        this.validationSchema = validationSchema.bind(this)
    }

    onSubmit(values, { setStatus, setSubmitting }) {
        console.log(values)
        const gid = this.props.gid

        service
            .update(values, this.state.pid, this.state.fid)
            .then(({ success }) => {
                if (success) {
                    this.setState({is_loading:true})
                    this.handleUpdate(gid)

                }
            })
    }

    handleUpdate(gid){
        service.detail(gid).then(({success, datas}) => {
            if(success){
                console.log(datas)
                this.setState({
                    values:datas,
                    is_loading: false
                })
            }
        })
    }
    componentDidUpdate(pP){
        if(pP.togle_islaod !== this.props.togle_islaod)
        {
            const gid = this.props.gid
            if(!this.props.togle_islaod && gid)
            {
                this.handleUpdate(gid)
                this.setState({is_loading:true})
            }
        }
        if(pP.gid !== this.props.gid)
        {
            const gid = this.props.gid
            if(!this.props.togle_islaod && gid)
            {
                this.handleUpdate(gid)
                this.setState({is_loading:true})
            }
        }
    }

    componentDidMount() {
        const gid = this.props.gid
        if(gid){
            if(!this.props.togle_islaod)
            {
                this.handleUpdate(gid)
                this.setState({is_loading:true})
            }
        }
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
                                            <label className="col-form-label">{friend.property_code}</label>
                                        </div>
                                        {friend.value_type == 'option' ?
                                            <div className="col-md-9">
                                                <Fragment>
                                                    <Field name={`form_values.${index}.data`} as="select" className="form-control">
                                                        <option>...</option>
                                                        {friend.data_list &&
                                                            friend.data_list.map((data, idy) =>
                                                            <option key = {idy} value={data.code_list_id}>{data.code_list_name}</option>
                                                            )
                                                        }
                                                    </Field>
                                                </Fragment>
                                                <small>{friend.property_definition}</small>
                                            </div>
                                            :
                                            <div className="col-md-9">
                                                {friend.value_type_id == 'boolean' ?
                                                <Field
                                                name={`form_values.${index}.data`}
                                                as="select"
                                                className='form-control'
                                                >
                                                    <option value="true">True</option>
                                                    <option value="false">False</option>
                                                </Field>
                                                :
                                                <Field
                                                    name={`form_values.${index}.data`}
                                                    className='form-control'
                                                    placeholder={ friend.property_name}
                                                    type={friend.value_type}
                                                    />
                                                }
                                                <small>{friend.property_definition}</small>
                                            </div>
                                        }
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