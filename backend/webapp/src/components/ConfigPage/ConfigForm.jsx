import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import {service} from './service'


export class ConfigForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: {
                id: '',
                name: '',
                value: '',
            },
            form_is_loading: false,
            name_isnull: false,
            value_isnull: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleForm = this.handleForm.bind(this);
    }

    componentDidMount() {
        const {id} = this.props.match.params
        if (id) {
            service.getDetail(id).then(({config}) => {
                this.setState({values: config})
            })
        }
    }

    handleChange(event) {
        const {name, value} = event.target

        this.setState({name_isnull: false, value_isnull: false})

        if (value.length < 255){
            this.setState({
                values: {
                    ...this.state.values,
                    [name]: value,
                }
            });
        }
    }

    handleForm(){

        const {values} = this.state
        const {id} = values

        if (!values.name || !values.value) {

            if(!values.name) {
                this.setState({name_isnull: true})
            }
            if(!values.value) {
                this.setState({value_isnull: true})
            }

        } else {

            this.setState({form_is_loading: true})

            if (id) {
                service.update(id, values).then(({success}) => {
                    success && this.props.history.push('/back/тохиргоо/')
                })
            } else {
                service.create(values).then(({success}) => {
                    success && this.props.history.push('/back/тохиргоо/')
                })
            }
        }
    }

    render() {

        const {values, form_is_loading, name_isnull, value_isnull} = this.state

        return (
            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <NavLink className="btn btn-outline-primary" exact to={"/back/тохиргоо/"}>
                            Буцах
                        </NavLink>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Нэр:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                onChange={this.handleChange}
                                value={values.name}
                            />
                            {name_isnull &&
                                <label className="text-danger">Хоосон байна. Утга оруулна уу ?</label>
                            }
                        </div>

                        <div className="form-group">
                            <label>Утга:</label>
                            <input
                                type="text"
                                className="form-control"
                                name="value"
                                onChange={this.handleChange}
                                value={values.value}
                            />
                            {value_isnull &&
                            <label className="text-danger">Хоосон байна. Утга оруулна уу ?</label>
                            }
                        </div>

                        {form_is_loading ?
                            <button className="btn gp-bg-primary" onClick={this.handleForm}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only"></span>
                                </div>
                                {} Түр хүлээнэ үү...
                            </button> :
                            <button className="btn gp-bg-primary" onClick={this.handleForm}>
                                Хадгалах
                            </button>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
