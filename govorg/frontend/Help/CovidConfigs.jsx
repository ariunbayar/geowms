import React, { Component } from 'react';
import { service } from './service'

class Input extends Component {

    constructor(props) {
        super(props)
        this.state = {
            value: props.value
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange(value, name) {
        this.setState({ value })
        this.props.setValue(value, name)
    }

    render() {
        const { value } = this.state
        const { name } = this.props
        return (
            <div className="form-group">
                <label htmlFor={`id_${name}`}>{name}</label>
                <input
                    className="form-control"
                    value={value}
                    id={`id_${name}`}
                    name={name}
                    onChange={(e) => this.handleOnChange(e.target.value, name)}
                />
            </div>
        )
    }
}


class CovidConfigs extends Component {

    constructor(props) {
        super(props)
        this.state = {
            values: []
        }
        this.setValue = this.setValue.bind(this)
        this.setConfig = this.setConfig.bind(this)
    }

    componentDidMount() {
        const { covid_configs } = this.props
        this.setState({ values: covid_configs })
    }

    setConfig() {
        service
            .setConfig(this.state.values)
            .then(({ success, info }) => {
                if(success) {
                    alert(info)
                }
                else {
                    alert(info)
                }
            })
            .catch((error) => {
                alert(" Алдаа гарсан байна ")
            })
    }

    setValue(value, name) {
        let obj = Object()
        obj[name] = value
        const { values } = this.state
        values.map((item, idx) => {
            if (item.name == name) {
                values[idx]['value'] = value
            }
        })
        this.setState({ values })
    }

    render() {
        const { covid_configs } = this.props
        return (
            <div className='card'>
                <div className="card-body">
                    {
                        covid_configs.map((item, idx) =>
                            <Input key={idx}
                                type="text"
                                value={item.value}
                                name={item.name}
                                setValue={this.setValue}
                            />
                        )
                    }
                </div>
                <button className="btn btn-primary" onClick={this.setConfig}>
                    Хадгалах
                </button>
            </div>
        );
    }
}

export default CovidConfigs;
