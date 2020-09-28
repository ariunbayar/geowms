import React, {Component} from "react"
import { Field, ErrorMessage } from 'formik'


export class TextField extends Component {
    render() {

        const {label, className, name, placeholder, is_invalid} = this.props
        const inputProps = {}

        if (this.props.handleChange)
            inputProps.onBlur = this.props.handleChange

        return (
            <div className={"form-group " + (className ? className : '')}>

                <label htmlFor={`id_${name}`}>
                    {label}
                </label>

                <Field
                    className={'form-control ' + (is_invalid ? 'is-invalid' : '')}
                    name={name}
                    placeholder={placeholder}
                    id={`id_${name}`}
                    type="text"
                    {...inputProps}
                />

                <ErrorMessage name={name} component="div" className="invalid-feedback"/>
            </div>
        )
    }
}
