import React, { Component, Fragment } from "react";

import { PortalDataTable } from '@utils/DataTable/index'
import { service } from "../Request/service";
import { makeStateColor, makeKindColor } from '../helpers/service'

export class List extends Component {

    constructor(props) {
        super(props)
        this.state = {
            талбарууд: [
                {'field': 'name', "title": 'Захиалагч байгууллага'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
                {'field': 'kind', "title": 'Өөрчлөлт', 'has_action': true},
                {'field': 'created_at', "title": 'Үүсгэсэн'},
                {'field': 'updated_at', "title": 'Шинэчилсэн'},
            ],
            жагсаалтын_холбоос: '/llc/backend/llc-request-list/',
            хувьсах_талбарууд: [
                {"field": "state", "action": (values) => makeStateColor(values) , "action_type": true},
                {"field": "kind", "action": (values) => makeKindColor(values), "action_type": true},
            ],
            нэмэлт_талбарууд: [
                    {
                        "title": 'дэлгэрэнгүй',
                        "text": '',
                        "icon": 'fa fa-eye text-primary',
                        "action": (values) => this.handleUpdateAction(values),
                    }
            ],
            state: '',
            kind: '',
            refresh: false,
            choices: [],
        }
        this.refreshData = this.refreshData.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleUpdateAction = this.handleUpdateAction.bind(this)
    }

    componentDidMount(){
        service.getSearchItems().then(({ success, search_field }) =>{
            if (success){
                this.setState({ choices: search_field })
            }
        })

    }

    handleUpdateAction(values) {
        this.props.history.push(`/llc/history/${values.id}/дэлгэрэнгүй/`)
    }

    refreshData() {
        this.setState({ refresh: !this.state.refresh })
    }

    handleSearch(e) {
        let custom_query = Object()
        var value = parseInt(e.target.value)

        var table_data = e.target.selectedIndex
        var optionElement = e.target.childNodes[table_data]
        var selected_data_name =  optionElement.getAttribute('name')

        if (selected_data_name == 'state') {
            if (e.target.value) custom_query['state'] = value
            if (this.state.kind) custom_query['kind'] = this.state.kind
        }
        else {
            if (value) custom_query['kind'] = value
            if (this.state.state) custom_query['state'] = this.state.state
        }

        this.setState({ custom_query, [selected_data_name]: value })
    }

    render() {
        const { талбарууд, жагсаалтын_холбоос, хувьсах_талбарууд, нэмэлт_талбарууд, refresh, choices } = this.state
        return (
            <Fragment>
                <div className="card">
                    <div className="card-body">
                        <div className="col-md-12 row mb-4">
                            <div className="col-md-6">
                                <label htmlFor="">Төлөв</label>
                                <select
                                    className="form-control form-control-xs"
                                    onChange={(e) => this.handleSearch(e)}
                                >
                                    <option value="">--- Төлөвөөр хайх ---</option>
                                    {
                                        choices?.state
                                        ?
                                            choices['state'].map((choice, idx) =>
                                                <option key={idx} name='state' value={choice[0]}>{choice[1]}</option>
                                            )
                                        :
                                            null
                                    }
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="">Өөрчлөлт</label>
                                <select className="form-control form-control-sm disabled"
                                    onChange={(e) => this.handleSearch(e)}
                                >
                                    <option value="">--- Өөрчлөлтөөр хайх ---</option>
                                    {
                                        choices?.kind
                                        ?
                                            choices['kind'].map((choice, idx) =>
                                                <option
                                                    key={idx}
                                                    name='kind'
                                                    value={choice[0]}
                                                >
                                                    {choice[1]}
                                                </option>
                                            )
                                        :
                                        null
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <PortalDataTable
                                refresh={refresh}
                                color={'primary'}
                                талбарууд={талбарууд}
                                жагсаалтын_холбоос={жагсаалтын_холбоос}
                                per_page={20}
                                хувьсах_талбарууд={хувьсах_талбарууд}
                                нэмэлт_талбарууд={нэмэлт_талбарууд}
                                custom_query={this.state.custom_query}
                                хайлт="closed"
                                max_data="closed"
                            />
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}
