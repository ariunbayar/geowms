import React, { Component } from "react"
import {Switch, Route, Link, NavLink} from "react-router-dom"
import {service} from '../service'
import {validationSchema} from './validationSchema'
import {Formik, Field, Form, ErrorMessage} from 'formik'

export class Forms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                id: 0,
                dugaar: '',
                date: '',
                aimagname: '',
                sumname: '',
                too_shirheg: '',
                burtgegch: '',
            }

        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInput = this.handleInput.bind(this)
    }

    
    componentDidMount(){
        const id = this.props.match.params.id
        service.about(id).then(({tuuh_soyl}) => {
            if(tuuh_soyl){
                tuuh_soyl.map((tuuh) => 
                    this.setState({
                        values:{
                            dugaar: tuuh['dugaar'],date: tuuh['date'],
                            aimagname: tuuh['aimagname'],
                            sumname: tuuh['sumname'], 
                            too_shirheg: tuuh['too_shirheg'], 
                            burtgegch: tuuh['burtgegch'],
                            id :id 
                        }
                    })
                )
            }
        })

    }
    handleInput(field, e) {
        this.setState({ [field]: e.target.value })
    }
    
    handleSubmit(values, { setStatus, setSubmitting }) {
        setStatus('checking')
        setSubmitting(true)
        this.setState({values})
        const id = this.props.match.params.id

        if(id){
            const form_datas = this.state.values

            service.update(form_datas).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        setStatus('saved')
                        this.props.history.push( `/back/froms/tuuhen-ov/`)
                    }, 1000)
                }
            })
        }
        else{
            alert("create")
            const form_datas = this.state.values

            service.create(form_datas).then(({success}) => {
                if (success) {
                    setTimeout(() => {
                        setStatus('saved')
                        this.props.history.push( `/back/froms/tuuhen-ov/`)
                    }, 1000)
                }
            })
        }
    }
    
    render() {
        return (
            <Formik
                enableReinitialize
                initialValues={this.state.values}
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

                    <div >
                        <div className="col-md-12 mb-4 my-4">
                            <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                                <i className="fa fa-angle-double-left"></i> Буцах
                            </a>
                        </div>
                        <div className="row container  my-4">
                            <h4>2015 ОНЫ ТҮҮХ, СОЁЛЫН ҮЛ ХӨДЛӨХ ДУРСГАЛЫН ҮЗЛЭГ, ТООЛЛОГЫН ХЭЭРИЙН БҮРТГЭЛИЙН МАЯГТ №1</h4>
                        </div>
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th style={{width: "20%"}} scope="row">Дурсгалт газрын бүртгэлийн дугаар</th>
                                    <td colSpan="2" scope="rowgroup"  >
                                        <Field
                                            className={'form-control ' + (errors.dugaar ? 'is-invalid' : '')}
                                            name='dugaar'
                                            id="id_dugaar"
                                            type="text"
                                        />
                                        <ErrorMessage name="dugaar" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width: "20%"}} scope="row">Он,сар,өдөр</th>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.date ? 'is-invalid' : '')}
                                            name='date'
                                            id="id_date"
                                            type="date"
                                        />
                                        <ErrorMessage name="date" component="div" className="invalid-feedback"/>
                                    </td>
                                    <th style={{width: "20%"}}>Бүртгэл хийсэн он сар, өдрийг бичнэ.</th>
                                </tr>
                                <tr>
                                    <th scope="row">Аймаг, Нийслэл</th>
                                    <td scope="row">
                                        <Field
                                            className={'form-control ' + (errors.aimagname ? 'is-invalid' : '')}
                                            name='aimagname'
                                            id="id_aimagname"
                                            type="text"
                                        />
                                        <ErrorMessage name="aimagname" component="div" className="invalid-feedback"/>
                                    </td>
                                    <th rowSpan="2" scope="rowgroup">Тухайн дурсгал оршиж буй аймаг, сумын нэрийг бичнэ.</th>
                                </tr>
                                <tr>
                                    <th scope="row">Сум, Дүүрэг</th>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.sumname ? 'is-invalid' : '')}
                                            name='sumname'
                                            id="id_sumname"
                                            type="text"
                                        />
                                        <ErrorMessage name="sumname" component="div" className="invalid-feedback"/>
                                    </td>
                                </tr>

                                <tr>
                                    <th scope="row">Хамрах хүруу тоо ширхэг</th>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.too_shirheg ? 'is-invalid' : '')}
                                            name='too_shirheg'
                                            id="id_too_shirheg"
                                            type="number"
                                        />
                                        <ErrorMessage name="too_shirheg" component="div" className="invalid-feedback"/>
                                    </td>
                                    <th>Тоо ширхэг.</th>
                                </tr>
                                <tr>
                                    <th scope="row">Бүртгэгч</th>
                                    <td>
                                        <Field
                                            className={'form-control ' + (errors.burtgegch ? 'is-invalid' : '')}
                                            name='burtgegch'
                                            id="id_burtgegch"
                                            type="text"
                                        />
                                        <ErrorMessage name="burtgegch" component="div" className="invalid-feedback"/>
                                    </td>
                                    <th>Бүргэлийг оруулсан хүн.</th>
                                </tr>
                            </tbody>
                        </table>
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
                                <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                    {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                    {!isSubmitting && 'Нэмэх' }
                                </button>
                            </div>
                        </div>
                    </div>
                    </Form>
                    )
                }}
            </Formik>  
        )

    }

}
