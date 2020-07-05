import React, { Component } from "react"
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {service} from "./service"
import {validationSchema} from './validationSchema'


export default class GovorgForm extends Component {

    constructor(props) {

        super(props)

        this.state = {
            name: '',
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSave = this.handleSave.bind(this)

    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {

    }

    handleChange(field, e) {
        this.setState({[field]: e.target.value})
    }

    handleSave() {
        this.props.handleSave(this.state)
    }

    render() {
        return (
            <div className="shadow-lg p-3 mb-5 bg-white rounded">

                <div className="form-group">
                    <label htmlFor="id_name"> Байгууллагын нэр: </label>
                    <input
                        type="text"
                        className="form-control"
                        id="id_name"
                        placeholder="байгууллагын нэр"
                        onChange={(e) => this.handleChange('name', e)}
                        value={this.state.name}
                    />
                </div>

                <div className="form-group">
                    <button className="btn btn-block gp-bg-primary" onClick={this.handleSave} >
                        Хадгал
                    </button>
                </div>

                <div className="form-group">
                    <button className="btn btn-block gp-outline-primary" onClick={this.props.handleCancel} >
                        <i className="fa fa-chevron-left" aria-hidden="true"></i>
                        &nbsp; Буцах
                    </button>
                </div>


                <dl>
                </dl>
            </div>
        )
    }
}

