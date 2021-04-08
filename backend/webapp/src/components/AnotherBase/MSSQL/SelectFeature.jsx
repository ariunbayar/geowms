import React, { Component } from 'react';
import { service } from '../service';

const SelectInput = (props) => {
    return (
        <select name="" id=""
        >
            <option value=""> -- Сонгоно уу -- </option>
            {
                props.datas.map((data, idx) =>
                    <option value={data.code}>{data.name}</option>
                )
            }
        </select>
    )
}

class SelectFeature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            datas: [],
        }

        this.getThemeFeatures = this.getThemeFeatures.bind(this)
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

    render() {
        const { datas } = this.state
        return (
            <div>
                {/* {
                    datas.map((data, idx) =>
                        <SelectInput
                            datas={data.children}
                        />
                    )
                } */}
            </div>
        );
    }
}

export default SelectFeature;