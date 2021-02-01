import React, { Component } from "react"

import OpenMapModal from './openMapModal'

export default class MakeOronZai extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show_group: false,
            values: props.values,
            fields:[
                {'mn_name': 'Геом дугаар', 'eng_name': 'old_geo_id'},
                {'mn_name': 'Төлөв', 'eng_name': 'state'},
                {'mn_name': 'Өөрчлөлт', 'eng_name': 'kind'},
            ],
            collection_of_value: [],
            is_all_checked: false
        }
        this.showGroup = this.showGroup.bind(this)
        this.collectAllValue = this.collectAllValue.bind(this)
    }

    showGroup() {
        const { values } = this.state
        if (values.group) {
            this.setState({ show_group: !this.state.show_group })
        }
    }

    collectAllValue(e, values) {
        const { collection_of_value } = this.state
        if (e.target.checked) {
            values.map((value, idx) => {
                collection_of_value.push(value)
            })
            this.setState({ collection_of_value, is_all_checked: true })
        }
        else {
            this.setState({ collection_of_value: [], is_all_checked: false })
        }
    }

    collectValue(e, value) {
        const { collection_of_value } = this.state
        if (e.target.checked) {
            collection_of_value.push(value)
        }
        else {
            collection_of_value.map((c_value, idx) => {
                if (value.id == c_value.id) {
                    collection_of_value.splice(idx, 1)
                }
            })
        }
        this.setState({ collection_of_value })
    }

    render() {
        const { show_group, fields, values, collection_of_value, is_all_checked } = this.state
        const { group, theme_name, package_name, feature_name } = values
        return (
            <div>
                <span className={group ? "btn " : ''} onClick={this.showGroup}>
                    {theme_name} / {package_name} / {feature_name}
                </span>
                {show_group && <br />}
                {
                    show_group
                    ?
                        <table>
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => this.collectAllValue(e, group)}
                                        />
                                    </th>
                                    <th>№</th>
                                    {fields.map((field, idx) =>
                                        <th key={idx}>
                                            {field.mn_name}
                                        </th>
                                    )}
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {group.map((value, g_idx) =>
                                    <tr key={g_idx} htmlFor={g_idx}>
                                        {
                                            value.state === 'ШИНЭ' || value.state === 'ХЯНАХ'
                                            ?
                                                <td>
                                                    <CheckBoxInput
                                                        collectValue={(e, value) => this.collectValue(e, value)}
                                                        value={value}
                                                        is_all_checked={is_all_checked}
                                                        idx={g_idx}
                                                    />
                                                </td>
                                            :
                                                <td></td>
                                        }
                                        <th>{g_idx + 1}</th>
                                        {fields.map((field, idx) =>
                                            field.eng_name == 'state'
                                            ?
                                                <td key={idx}
                                                    className={
                                                        value[field.eng_name] == 'ШИНЭ' ? 'text-primary' :
                                                        value[field.eng_name] == 'ТАТГАЛЗСАН' ? 'text-danger' :
                                                        value[field.eng_name] == 'ЗӨВШӨӨРСӨН' ? 'text-success':
                                                        value[field.eng_name] == 'ХЯНАХ' ? 'text-success': null
                                                    }
                                                >
                                                    {value[field.eng_name]}
                                                </td>
                                            :
                                            field.eng_name == 'kind'
                                            ?
                                                <td key={idx}
                                                    className={
                                                        value[field.eng_name] == 'ҮҮССЭН' ? 'text-success' :
                                                        value[field.eng_name] == 'ЗАССАН' ? 'text-primary' :
                                                        value[field.eng_name] == 'ЦУЦЛАСАН' ? 'text-danger':
                                                        value[field.eng_name] == 'УСТГАСАН' ? 'text-danger':
                                                        value[field.eng_name] == 'ШУУД' ? 'text-danger': null
                                                    }
                                                >
                                                    {value[field.eng_name]}
                                                </td>
                                            :
                                                <td key={idx}>
                                                   <label htmlFor={g_idx} className="form-check-label">
                                                       {value[field.eng_name]}
                                                    </label>
                                                </td>
                                        )}
                                        <td>
                                            <OpenMapModal
                                                values={value}
                                                refreshData={this.props.refreshData}
                                                timeCloseModal={this.props.timeCloseModal}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    :
                        null
                }
                {
                    collection_of_value.length > 1
                    ?
                        <OpenMapModal
                            values={collection_of_value}
                            button_name={'Олноор шийдвэрлэх'}
                            refreshData={this.props.refreshData}
                            timeCloseModal={this.props.timeCloseModal}
                        />
                    :
                        null
                }
            </div>
        )
    }
}


class CheckBoxInput extends Component {

    constructor(props) {
        super(props)
        this.state = {
            is_checked: false
        }
        this.isChecked = this.isChecked.bind(this)
    }

    isChecked(e) {
        const { value } = this.props
        this.setState({ is_checked: e.target.checked })
        this.props.collectValue(e, value)
    }

    componentDidUpdate(pP) {
        if(pP.is_all_checked !== this.props.is_all_checked) {
            this.setState({ is_checked: this.props.is_all_checked })
        }
    }

    render() {
        const { is_checked } = this.state
        const { idx } = this.props
        return (
            <input id={idx}
                type="checkbox"
                checked={is_checked}
                onChange={(e) => this.isChecked(e)}
            />
        )
    }
}
