import React, { Component } from "react"
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

            oid: this.props.match.params.oid,
            id: this.props.match.params.id,

            values: {},

        }

        this.onSubmit = this.onSubmit.bind(this)
        this.validationSchema = validationSchema.bind(this)

    }

    onSubmit(values, { setStatus, setSubmitting }) {
        this.setState({ values })
        console.log(values)

        setStatus('checking')
        setSubmitting(true)
        if(this.state.id){
            service
                .update(this.state.oid, values, this.state.id)
                .then(({ success }) => {
                    if (success) {
                        setStatus('saved')
                        setSubmitting(false)
                    }
                })
        }
        else{
            service
                .save(this.state.oid, values)
                .then(({ success }) => {
                    if (success) {
                        setStatus('saved')
                        setSubmitting(false)
                    }
                })
        }
    }

    componentDidMount() {
        const gid = this.props.match.params.gid
        if(gid){
            service
            .detail(gid)
            .then(({success, datas}) => {
                if(success){
                    console.log(datas)
                    this.setState({
                        values:datas,
                        is_loading: false
                    })
                }
         })
        }
    }

    render() {

        if (this.state.is_loading) {
            return (
                <p className="text-center"> <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i> <br/> Түр хүлээнэ үү... </p>
            )
        }

        const { values, id } = this.state
        const values_fields = values
        // const { fields } = this.props
        return (
            <div>
                <Formik
                    initialValues={{ friends: values }}
                    onSubmit={values =>
                        setTimeout(() => {
                        console.log(JSON.stringify(values, null, 2));
                        }, 500)
                    }
                    render={({ values }) => (
                        <Form>
                        <FieldArray
                            name="friends"
                            render={arrayHelpers => (
                            <div>
                                {values.friends && values.friends.length > 0 ? (
                                values.friends.map((friend, index) => (
                                    <div key={index} className="row my-3">
                                        <div className="col-md-2">
                                            <label className="col-form-label">{friend.property_code}</label>
                                        </div>
                                        {friend.value_type != 'option' ?
                                            <div className="col-md-9">
                                                <Field 
                                                    name={`friends.${index}.data`} 
                                                    className='form-control' 
                                                    placeholder={ friend.property_name}
                                                    type={friend.value_type} 
                                                    />
                                                <small>{friend.property_definition}</small>
                                            </div>
                                            :
                                            friend.value_type_id == '"single-select"' ?
                                            <div className="col-md-9">
                                            <Field  
                                                name={`friends.${index}.data`} 
                                                as="select"
                                                className='form-control' 
                                                >
                                                    {friend.data_list ? 
                                                    friend.data_list.map((data, idy) =>
                                                    
                                                    <option key = {idy} value={data.code_list_id}>{data.code_list_name}</option>
                                                    )
                                                    :
                                                    null
                                                    }
                                                </Field>
                                            <small>{friend.property_definition}</small>
                                        </div> 
                                        :
                                            <div className="col-md-9">
                                            <Field  
                                                name={`friends.${index}.data`} 
                                                as="select"
                                                className='form-control' 
                                                >
                                                    <option>...</option>
                                                </Field>
                                            <small>{friend.property_definition}</small>
                                            </div>
                                        }
                                    </div>
                                ))
                                ) : (
                                <button type="button" onClick={() => arrayHelpers.push('')}>
                                    {/* show this when user has removed all friends from the list */}
                                    Add a friend
                                </button>
                                )}
                                <div>
                                <button type="submit">Submit</button>
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