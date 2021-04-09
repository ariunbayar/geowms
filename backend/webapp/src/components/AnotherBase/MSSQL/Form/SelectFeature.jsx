import React, { Component } from 'react';
import { service } from '../../service';

const SelectInput = (props) => {
    return (
        <div className={`form-group col-md-${props.length}`}>
            <label htmlFor={props.name}>{props.label}</label>
            <select name="" id={props.name}
                className={`custom-select`}
                disabled={props.disabled}
                onChange={(e) => {
                    if (e.target.value != "-1") {
                        props.sendValue(props.name, props.datas[e.target.value][props.property], e.target.value)
                    }
                    else {
                        props.sendValue(props.name, [])
                    }
                }}
                value={props.value}
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
            ano_db_table: props.ano_db_table,
            theme_idx: '',
            pack_idx: '',
            feat_idx: '',
            table_id: props.match.params.table_id,
        }

        this.getThemeFeatures = this.getThemeFeatures.bind(this)
        this.getValue = this.getValue.bind(this)
        this.setSelectValue = this.setSelectValue.bind(this)
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

    getValue(name, value, idx) {
        this.setState({ [name]: value })
        if (name == 'feature_code') {
            this.setState({ feat_idx: idx })
            this.props.sendFeatureCode(value)
        }
        if (name == 'packs') {
            this.setState({ features: [], theme_idx: idx })
        }
        if (name == 'features') {
            this.setState({ pack_idx: idx })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ano_db_table != this.props.ano_db_table) {
            this.setState({ ano_db_table: this.props.ano_db_table })
            if (Object.keys(this.props.ano_db_table).length > 0) {
                this.setSelectValue(this.props.ano_db_table);
            }
        }
    }

    setSelectValue(ano_db_table) {
        let theme_idx
        let pack_idx
        let feat_idx
        const { datas } = this.state
        datas.map((theme, t_idx) => {
            theme['children'].map((pack, p_idx) => {
                pack['children'].map((feat, f_idx) => {
                    if (feat['code'] == ano_db_table['feature_code']) {
                        theme_idx = t_idx
                        pack_idx = p_idx
                        feat_idx = f_idx
                    }
                })
            })
        })
        this.setState({ theme_idx, pack_idx, feat_idx, packs: datas[theme_idx]['children'], features: datas[theme_idx]['children'][pack_idx]['children'] })
    }

    render() {
        const { datas, packs, features, feature_code, theme_idx, pack_idx, feat_idx, table_id } = this.state
        return (
            <div className="form-row">
                <SelectInput
                    name="packs"
                    datas={datas}
                    sendValue={this.getValue}
                    property='children'
                    length='4'
                    label="Theme"
                    value={theme_idx}
                    disabled={table_id ? true : false}
                />
                <SelectInput
                    name="features"
                    datas={packs}
                    sendValue={this.getValue}
                    property='children'
                    length='4'
                    label="Package"
                    value={pack_idx}
                    disabled={table_id ? true : false}
                />
                <SelectInput
                    name="feature_code"
                    datas={features}
                    sendValue={this.getValue}
                    property='code'
                    length='4'
                    label="Feature"
                    value={feat_idx}
                    disabled={table_id ? true : false}
                />
            </div>
        );
    }
}

export default SelectFeature;