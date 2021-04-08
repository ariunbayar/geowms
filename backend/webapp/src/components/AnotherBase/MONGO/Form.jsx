import React, { Component } from 'react';
import { service } from '../service';

import PropertyMatch from './PropertyMatch';

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            table_names: [
            ],
            selected_value: '',
            feature_value: '',
            features: [],
            field_names: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.getTableNames = this.getTableNames.bind(this)
    }

    componentDidMount(){
        const {id} = this.state
        this.getTableNames(id)
    }

    getTableNames(id){
        service.mongo_config.tables(id).then(({success, table_names, features}) => {
            if(success) this.setState({table_names, features})
        })
    }

    getTableFields(name){
        const {id} = this.state
        service.mongo_config.fieldNames(id, name).then(({success, field_names}) => {
            if(success) this.setState({field_names})
        })
    }

    handleChange(name, e) {
        const selected_value = e.target.value
        this.setState({ [name]: selected_value })
        if(name == 'selected_value') this.getTableFields(selected_value)
    }

    render() {
        const { table_names, selected_value, features, feature_value, field_names } = this.state
        return (
            <div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="table_name">Хүснэгтийн нэр</label>
                        <select
                            className="custom-select"
                            id="table_name"
                            onChange={(e) => this.handleChange('selected_value', e)}
                            value={selected_value}
                        >
                            <option value=""> -- Хүснэгтийн нэр сонгоно уу -- </option>
                            {
                                table_names.map((item, idx) =>
                                    <option key={idx} value={item}>{item}</option>
                                )
                            }
                        </select>
                        <label htmlFor="table_name mt-1">Feature нэр</label>
                        <select
                            className="custom-select"
                            id="table_name"
                            onChange={(e) => this.handleChange('feature_value', e)}
                            value={feature_value}
                        >
                            <option value=""> -- feature нэр сонгоно уу -- </option>
                            {
                                features.map((item, idx) =>
                                    <option key={idx} value={item.code}>{item.name}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
                {/* <PropertyMatch
                    selected_value={selected_value}
                /> */}
            </div>
        );
    }
}

export default Form;