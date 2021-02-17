import React, { Component, Fragment } from "react"
import { service } from "../Employee/service"

class NewInput extends Component{
    constructor(props){
        super(props)
        this.input_data = {}
        this.state = {
            input_value: '',
        }
    }

    handleOnChange(input_value) {
        const { idx, ix, field, length, origin_name } = this.props
        this.setState({ input_value })
        this.props.getValues(input_value, idx, origin_name)
    }

    render() {
        const { idx, ix, field, length, choices, value, disabled, type, is_detail } = this.props
        const { input_value } = this.state
        return (
            <div className="form-group animated slideInLeft">
                <dt>{field}</dt>
                {
                    is_detail
                    ?
                        <dd>{value}</dd>
                    :
                        type == 'date' && choices == null
                        ?
                            <input
                                type={type}
                                maxLength={length}
                                className="form-control"
                                disabled={disabled}
                                value={input_value}
                                onChange={(e) => this.handleOnChange(e.target.value)}
                            />
                        :
                        length > 1900 && choices == null
                        ?
                            <textarea
                                className="form-control"
                                rows="3"
                                onChange={(e) => this.handleOnChange(e.target.value)}
                                maxLength={length}
                                disabled={disabled}
                                placeholder={value}
                                value={value}
                            >
                            </textarea>
                        : length < 1900 && choices == null ?
                            <input
                                type='text'
                                maxLength={length}
                                className="form-control"
                                disabled={disabled}
                                value={value}
                                onChange={(e) => this.handleOnChange(e.target.value)}
                                placeholder={field + ` оруулна уу`}
                            />
                        : choices !== null ?
                            <select className="form-control"
                                disabled={disabled}
                                onChange={(e) => this.handleOnChange(e.target.value)}>
                                <option key={idx} value=''>--- Сонгоно уу ---</option>
                                {choices.map((choice, idx) =>
                                    <option key={idx} value={choice[0]}>{choice[1]}</option>
                                )}
                            </select>
                        : null
                    }
            </div>
        )
    }
}

export class Form extends Component {

    constructor(props) {
        super(props)

        this.state = {
            fields: [],
            values: {},
        }
        this.getField = this.getField.bind(this)
        this.getValues = this.getValues.bind(this)
    }

    componentDidMount() {
        this.getField()
    }

    getField() {
        service
            .getFieldTailbar()
            .then(({ success, fields}) => {
                this.setState({ fields })
            })
    }

    getValues(value, idx, origin_name) {
        const { values } = this.state
        values[origin_name] = value
        this.setState({ values })
    }

    render() {
        const { fields, values } = this.state
        const { is_empty } = this.props
        return (
            <div>
                <h5 className="text-center">Эргүүлэгт гарсан мэдээлэл</h5>
                {fields.map((field, idx) => {
                    let is_disabled = is_empty ? true : field.disabled
                      return <NewInput key={idx}
                                field={field.name}
                                length={field.length}
                                disabled={is_disabled}
                                idx={idx}
                                origin_name={field.origin_name}
                                getValues={this.getValues}
                                value={field.value}
                                choices={field.choices}
                                type={field.type}
                            />
                    }
                )}
                <div>
                    <button
                        className="btn btn-primary btn-block"
                        disabled={is_empty}
                        onClick={() => this.props.saveErguulTailbar(values)}>
                        Хадгалах
                    </button>
                </div>
            </div>
        )
    }
}
