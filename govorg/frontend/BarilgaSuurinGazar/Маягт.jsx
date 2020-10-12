import React, { Component } from "react"
import { Formik, Form, Field, ErrorMessage, validateYupSchema } from 'formik'
import Modal from "../../../src/components/Modal/DeleteModal"
import { service } from "./service"
import * as Yup from 'yup'


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

    }

    onSubmit(values, { setStatus, setSubmitting }) {
        this.setState({ values })
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

        if (this.state.id) {

            service
                .detail(this.state.oid, this.state.id)
                .then(({ values }) => {

                    this.setState({
                        is_loading: false,
                        values,
                })
            })

        } else {

            const values = {}

            this.props.fields.forEach((field) => {
                if (field.type != 'geometry') {
                    values[field.name] = ''
                }
            })

            this.setState({
                values,
                is_loading: false,
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
        const { fields } = this.props
        const schemaObj = []
        fields.map((f) => {
            if (id) {
                if (f.type !== 'geometry') {
                    if (f.type == 'integer' || f.type == 'double precision' || f.type == "bigint") {
                        schemaObj[f.name] = Yup.number().typeError('Заавал тоо байх ёстой !').required('Нөхцөл хоосон байна !');
                    }
                    if (f.type == 'character varying') {
                        schemaObj[f.name] = Yup.string().max(50, 'Хэт урт байна !').required('Нөхцөл хоосон байна !');
                    }
                }
            }
            else {
                if (f.name !== 'id' && f.type !== 'geometry') {
                    if (f.type == 'integer' || f.type == 'double precision' || f.type == "bigint") {
                        schemaObj[f.name] = Yup.number().typeError('Заавал тоо байх ёстой !').required('Нөхцөл хоосон байна !');
                    }
                    if (f.type == 'character varying') {
                        schemaObj[f.name] = Yup.string().max(50, 'Хэт урт байна !').required('Нөхцөл хоосон байна !');
                    }
                }
            }
        });
        const validationSchema = Yup.object(schemaObj);
        return (
            <div>
                <Formik
                    enableReinitialize
                    initialValues={ values }
                    onSubmit={ this.onSubmit }
                    validate={ () => ({}) }
                    validationSchema={validationSchema}
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
                                { fields.map((field, idx) => {
                                    if (field.type == 'geometry')
                                        return
                                    else if (field.name == 'id')
                                        if (id)
                                            return (
                                                <div className="form-group row" key={ idx }>
                                                    <label className="col-sm-2 col-form-label">{ field.name }</label>
                                                    <div className="col-sm-10">
                                                        <input name={ field.name } className="form-control" disabled type="text" value={ id }/>
                                                    </div>
                                                </div>
                                            )
                                        else
                                            return
                                    else
                                        return (
                                            <div className="form-group row" key={ idx }>
                                                <label className="col-sm-2 col-form-label">{ field.name }</label>
                                                <div className="col-sm-10">
                                                    <Field
                                                        name={ field.name }
                                                        className={'form-control ' +
                                                                (errors[field.name] &&
                                                                touched[field.name] ? 'is-invalid' : '')}
                                                        placeholder={ field.name } type="text"/>
                                                    <ErrorMessage name={ field.name } component="span" className="invalid-feedback"/>
                                                </div>
                                            </div>
                                        )
                                })}

                                <div>
                                    <button type="submit" className="btn" disabled={isSubmitting || has_error}>
                                        {isSubmitting && <i className="fa fa-spinner fa-pulse"></i>}
                                        {isSubmitting && 'Шалгаж байна.'}
                                        {!isSubmitting && 'Хадгалах'}
                                    </button>
                                    {has_error
                                        ?
                                        <p className="text-danger">
                                            <i className="far fa-times-circle"></i>
                                            {} Алдаатай утгыг засварлаж ахин оролдоно уу!
                                        </p>
                                        : status == 'saved' && !dirty &&
                                        <p>
                                            <i className="fas fa-check-circle"></i>
                                            {} Амжилттай хадгаллаа
                                            </p>
                                    }
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        )
    }
}