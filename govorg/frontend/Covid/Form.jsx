import React, { Component } from 'react';

import { service } from './service';
import BackButton from "@utils/Button/BackButton"


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

    componentDidUpdate(pP) {
        if (pP.value !== this.props.value) {
            this.setState({ value: this.props.value })
        }
    }

    render() {
        const { value } = this.state
        const { name, mn_name, type } = this.props
        return (
            <div className="form-group">
                <label htmlFor={`id_${name}`}>{mn_name}</label>
                <input
                    className="form-control"
                    value={value}
                    type={type}
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
            date: '',
        }
        this.setValue = this.setValue.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.makeValueJson = this.makeValueJson.bind(this)
        this.makeValueJsonLog = this.makeValueJsonLog.bind(this)
    }

    setValue(value, name) {
        const { values } = this.state
        values[name] = value
        this.setState({ values })
    }

    componentDidMount() {
        const { is_log } = this.props
        if (!is_log) {
            this.makeValueJson(this.state.data)
        } else {
            this.makeValueJsonLog(this.state.data)
        }
    }

    makeValueJson(data) {
        const { covid_dashboard } = this.props
        data.map((item, idx) => {
            covid_dashboard.map((dash, d_idx) => {
                covid_dashboard[d_idx]['value'] = item[dash.origin_name]
            })
        })
        this.setState({ covid_dashboard: covid_dashboard })
    }

    makeValueJsonLog(data) {
        const { covid_dashboard } = this.props
        covid_dashboard.map((dash, d_idx) => {
            covid_dashboard[d_idx]['value'] = 0
        })
        this.setState({ covid_dashboard: covid_dashboard })
    }

    handleSave() {
        const { values } = this.state
        const { geo_id, is_log } = this.props
        if (!is_log) {
            service
                .saveDashboard(values, geo_id)
                .then(({ success, info }) => {
                    alert(info)
                })
                .catch(rsp => {
                    alert("Алдаа гарсан байна")
                })
        } else {
            service
                .saveDashboardLog(values, geo_id)
                .then(({ success, info }) => {
                    alert(info)
                })
                .catch(rsp => {
                    alert("Алдаа гарсан байна")
                })
        }
    }

    render() {
        const { covid_dashboard, values, date } = this.state
        const { is_log } = this.props
        return (
            <div className="card-body pt-0">
                {
                    is_log &&
                        <BackButton {...this.props} name={'Буцах'}/>
                }
                {covid_dashboard.map((item, idx) =>
                    <Input key={idx}
                        type="number"
                        value={item.value}
                        name={item.origin_name}
                        setValue={this.setValue}
                        mn_name={item.name}
                    />
                )}
                {
                    is_log &&
                        <Input
                            type="date"
                            value={date}
                            name={'updated_at'}
                            setValue={this.setValue}
                            mn_name={'Бүртгэсэн огноо'}
                        />
                }
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
