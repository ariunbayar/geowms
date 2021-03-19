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

class LineChart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            line_chart_datas: props.line_datas,
        }
        this.arrayRemove = this.arrayRemove.bind(this)
        this.arrayOnChange = this.arrayOnChange.bind(this)
        this.arrayOnChangeDatas = this.arrayOnChangeDatas.bind(this)
        this.arrayAdd = this.arrayAdd.bind(this)
    }

    arrayRemove(idx){
        const {line_chart_datas} = this.state
        line_chart_datas.splice(idx, 1);
        this.setState(line_chart_datas)
    }

    arrayAdd(){
        const {line_chart_datas} = this.state
        line_chart_datas.push({"label": 'Огноо', "datas": 1})
        this.setState(line_chart_datas)
    }

    arrayOnChange(idx, value){
        const {line_chart_datas} = this.state
        line_chart_datas[idx].label = value
        this.setState(line_chart_datas)
        this.props.setValue(line_chart_datas, this.props.name)
    }

    arrayOnChangeDatas(idx, value){
        const {line_chart_datas} = this.state
        line_chart_datas[idx].datas = value
        this.setState(line_chart_datas)
        this.props.setValue(line_chart_datas, this.props.name)
    }

    render() {
        const { mn_name } = this.props
        const { line_chart_datas } = this.state
        return (
            <div>
                <label htmlFor="">{mn_name}</label>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th colSpan="4" className="text-center align-center" scope="rowgroup">
                                Line graph утга
                            </th>
                        </tr>
                        <tr>
                            <th>№</th>
                            <th>Огноо</th>
                            <th>Тоо</th>
                            <th>Хасах</th>
                        </tr>
                    </thead>
                    <tbody>
                        {line_chart_datas.map((values, idx) =>
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                    <input
                                        onChange={(e) => this.arrayOnChange(idx, e.target.value)}
                                        type="date"
                                        className="form-control"
                                        value={values.label}
                                    ></input>
                                </td>
                                <td>
                                    <input
                                        onChange={(e) => this.arrayOnChangeDatas(idx, e.target.value)}
                                        type="number"
                                        className="form-control"
                                        value={values.datas}
                                    ></input>
                                </td>
                                <td>
                                    <a onClick={() => this.arrayRemove(idx)} className="btn btn-outline-primary ">
                                        Хасах
                                    </a>
                                </td>
                            </tr>
                        )}
                        <tr>
                            <td colSpan="4" className="text-center align-center" scope="rowgroup">
                                <a className="text-center" onClick={this.arrayAdd} className="btn btn-outline-primary rounded-circle">
                                    Нэмэх
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
                            item.name != 'line_chart_datas'
                            &&
                                <Input key={idx}
                                    type="text"
                                    value={item.value}
                                    name={item.name}
                                    setValue={this.setValue}
                                    mn_name={item.mn_name}
                                />
                        )
                    }
                    {
                        covid_configs.map((item, idx) =>
                            item.name == 'line_chart_datas'
                            &&
                                <LineChart key={idx}
                                    mn_name={item.mn_name}
                                    name={item.name}
                                    line_datas={typeof item.value == 'string' ? JSON.parse(item.value) : item.value}
                                    setValue={this.setValue}
                                />

                        )
                    }
                </div>
                {
                    covid_configs.length > 0
                    &&
                        <button className="btn btn-primary" onClick={this.setConfig}>
                            Хадгалах
                        </button>
                }
            </div>
        );
    }
}

export default CovidConfigs;
