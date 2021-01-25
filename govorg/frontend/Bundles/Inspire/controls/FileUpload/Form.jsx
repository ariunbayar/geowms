import React, { Component } from 'react'
import { service } from '../../service'
import {Field, ErrorMessage, Formik} from 'formik'

export class FormDetail extends Component {
    constructor(props){
        super(props)
        this.state = {
            btn_is_laod: false,
        }
    }

    componentDidMount(){
        const {errors} = this.props
    }

    render() {
        const { values } = this.props
        this.list = []
        return (
            <Formik
                initialValues={ values }
                enableReinitialize
            >
                {({
                    errors,
                    values,
                }) => {
                    return(
                        <div className="form-row">
                            <div className="form-group col-lg-12">
                                <label htmlFor="first_name">Тушаалын дугаар:</label>
                                <Field
                                    className={'form-control ' + (errors.order_no ? 'is-invalid' : '')}
                                    name='order_no'
                                    id="order_no"
                                    type="text"
                                    placeholder="Тушаалын дугаар"
                                />
                                <ErrorMessage name="order_no" component="div" className="text-danger"/>
                            </div>
                            <div className="form-group col-lg-12">
                                <label htmlFor="first_name">Тушаал гарсан огноо:</label>
                                <Field
                                    className={'form-control ' + (errors.order_at ? 'is-invalid' : '')}
                                    name='order_at'
                                    id="order_at"
                                    type="date"
                                    placeholder="Тушаал гарсан огноо"
                                />
                                <ErrorMessage name="order_at" component="div" className="text-danger"/>
                            </div>
                            <button
                                    className="btn gp-btn-primary"
                                    onClick={() => this.props.handleSubmit(values)}
                                >Файл илгээх
                            </button>
                        </div>
                    )
                }}
            </Formik>
        )
    }
}