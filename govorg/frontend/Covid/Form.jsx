import React, { Component } from 'react';

import { service } from './service';

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
        const { name, mn_name } = this.props
        return (
            <div className="form-group">
                <label htmlFor={`id_${name}`}>{mn_name}</label>
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

class Form extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: props.data,
            covid_dashboard: props.covid_dashboard,
            values: {},
            is_loading: true,
        }
        this.setValue = this.setValue.bind(this)
        this.handleSave = this.handleSave.bind(this)
    }

    setValue(value, name) {
        const { values } = this.state
        values[name] = value
        this.setState({ values })
    }

    componentDidMount() {
    //     this.setValueToObj('au_496')
    }

    handleSave() {
        const { values } = this.state
        const { geo_id } = this.props
        service
            .saveDashboard(values, geo_id)
            .then(rsp => {
                console.log(rsp);
            })
    }

    render() {
        const { covid_dashboard, values } = this.state
        console.log(values);
        return (
            <div className="card-body pt-0">
                <hr />
                {covid_dashboard.map((item, idx) =>
                    <Input key={idx}
                        type="number"
                        value={item.value}
                        name={item.origin_name}
                        setValue={this.setValue}
                        mn_name={item.name}
                    />
                )}
                <button
                    className="btn btn-block gp-btn-primary"
                    onClick={this.handleSave}
                >
                    Хадгалах
                </button>
            </div>
        );
    }
}

export default Form;
