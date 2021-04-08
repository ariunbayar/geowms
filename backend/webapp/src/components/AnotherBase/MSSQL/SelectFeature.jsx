import React, { Component } from 'react';
import { service } from '../service';

const SelectInput = (props) => {
    return (
        <div className={`form-group col-md-${props.length}`}>
            <label htmlFor={props.name}>{props.label}</label>
            <select name="" id={props.name}
                className={`custom-select`}
                onChange={(e) => {
                    if (e.target.value != "-1") {
                        props.sendValue(props.name, props.datas[e.target.value][props.property])
                    }
                    else {
                        props.sendValue(props.name, [])
                    }
                }}
            >
                <option value="-1"> -- Сонгоно уу -- </option>
                {
                    props.datas.map((data, idx) =>
                        <option key={idx} value={idx}>{data.name}</option>
                    )
                }
            </select>
        </div>
    )
}

class SelectFeature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            packs: [],
            features: [],
            feature_code: '',
        }

        this.getThemeFeatures = this.getThemeFeatures.bind(this)
        this.getValue = this.getValue.bind(this)
    }

    componentDidMount() {
        this.getThemeFeatures()
    }

    getThemeFeatures() {
        service
            .mssql_config
            .getThemeFeatures()
            .then(({ datas }) => {
                this.setState({ datas })
            })
    }

    getValue(name, value) {
        this.setState({ [name]: value })
        if (name == 'feature_code') {
            this.props.sendFeatureCode(value)
        }
        if (name == 'packs') {
            this.setState({ features: [] })
        }
    }

    render() {
        const { datas, packs, features, feature_code } = this.state
        console.log(features);
        return (
            <div className="form-row">
                <SelectInput
                    name="packs"
                    datas={datas}
                    sendValue={this.getValue}
                    property='children'
                    length='4'
                    label="Theme"
                />
                <SelectInput
                    name="features"
                    datas={packs}
                    sendValue={this.getValue}
                    property='children'
                    length='4'
                    label="Package"
                />
                <SelectInput
                    name="feature_code"
                    datas={features}
                    sendValue={this.getValue}
                    property='code'
                    length='4'
                    label="Feature"
                />
            </div>
        );
    }
}

export default SelectFeature;