
import React, { Component } from "react"
import {service} from './service'
import {RevokeRequestTable} from './RevokeRequestTable'
import { Pagination } from "../components/pagination/pagination"
import { PortalDataTable } from '@utils/DataTable/index'
import MakeOronZai from './../OrgRequest/makeOronZai'
import OpenMapModal from './../OrgRequest/openMapModal'



const make_org_employee = ({values}) => {
    return values.org + '/' + values.employee
}

export const make_state_color = (state) => {
    let color
    if (state == "ШИНЭ") color = 'text-warning'
    else if (state == "ТАТГАЛЗСАН") color = 'text-danger'
    else if (state == "ЗӨВШӨӨРСӨН") color = 'text-success'
    else if (state == "ХЯНАХ") color = 'text-success'
    return color
}

export default class RevokeRequestForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            is_loading: false,
            search_query: '',
            current_page: 1,
            revoke_per_page: 20,
            list_length: null,
            search_state: '',
            state: null,
            kind: null,
            search_geom: null,
            theme_id: null,
            package_id: null,
            feature_id: null,
            is_loading: false,
            refresh: false,
            талбарууд: [
                {'field': 'theme_name', "title": 'Орон зайн өгөгдөл', 'has_action': true},
                {'field': 'org', "title": 'Байгууллага / мэргэжилтэн', 'has_action': true},
                {'field': 'order_no', "title": 'Тушаалын дугаар'},
                {'field': 'order_at', "title": 'Тушаал гарсан огноо'},
                {'field': 'created_at', "title": 'Огноо'},
                {'field': 'state', "title": 'Төлөв', 'has_action': true},
            ],
            жагсаалтын_холбоос: '/gov/api/revoke_request/',
            хувьсах_талбарууд: [
                {"field": "org", "component": make_org_employee},
                {
                    "field": "theme_name",
                    "component": MakeOronZai,
                    'props': {
                        'refreshData': () => this.refreshData(),
                    }
                },
                {"field": "state", "action": (values) => make_state_color(values) , "action_type": true},
            ],
            нэмэлт_талбарууд: [{
                "title": '',
                'component': OpenMapModal,
                'props': {
                    'button_name' : 'Үзэх',
                    'hide_btn' : true,
                    'refreshData': () => this.refreshData(),
                },
            }],
        }
        this.setLoading = this.setLoading.bind(this)
        this.paginate = this.paginate.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.refreshData = this.refreshData.bind(this)
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.search_state !== this.state.search_state)
        {
            this.setState({ search_state: this.state.search_state })
        }
    }

    refreshData(){
        this.setState({ refresh: !this.state.refresh })
    }

    setLoading() {
        this.setState({ is_loading: true })
    }

    paginate(page, query, state) {
        this.setLoading()
        const { revoke_per_page } = this.state
        this.setState({ current_page: page })
        return service
            .paginatedList(page, revoke_per_page, query, state)
            .then(page => {
                this.setState({ items: page.items, list_length: page.items.length, choices: page.choices, is_loading: false });
                return page
            })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value, this.state.search_state)
        }
        else {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value, this.state.search_state)
        }
    }

    handleState(search_state) {
        this.setState({ search_state })
        const { search_query} = this.state
        this.paginate(1, search_query, search_state)
    }

    render() {
        const { is_loading, items, choices, search_state, current_page, revoke_per_page } = this.state
        const { жагсаалтын_холбоос, талбарууд, хувьсах_талбарууд, нэмэлт_талбарууд, refresh } = this.state
        return (
            <div className="card">
                <div className="card-body">
                        <div className="col-md-12 row">
                            <div className="col-md-6">
                                <label htmlFor="">Хайх</label>
                                <input
                                    type="text"
                                    className="form-control form-control-xs"
                                    id="search_query"
                                    placeholder="Хайх утгаа оруулна уу"
                                    onChange={(e) => this.handleSearch('search_query', e)}
                                    value={this.state.search_query}
                                />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="">Төлөв</label>
                                <select className="form-control form-control-xs"
                                    onChange={(e) => this.handleState(e.target.value)}>
                                    <option value="">--- Төлөвөөр хайх ---</option>
                                    {
                                        choices && choices.length > 0
                                        ?
                                        choices[0].map((choice, idx) =>
                                            <option key={idx} value={choice[0]}>{choice[1]}</option>
                                        )
                                        :
                                        null
                                    }
                                </select>
                            </div>
                        </div>
                        <br></br>
                        {/* <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Орон зайн өгөгдөл</th>
                                        <th scope="col">Байгууллага / мэргэжилтэн</th>
                                        <th scope="col">Тушаалын дугаар</th >
                                        <th scope="col">Тушаал гарсан огноо</th >
                                        <th scope="col">Үүссэн огноо</th>
                                        <th scope="col">Төлөв</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        is_loading
                                        ?
                                        <tr>
                                            <td colSpan="7">
                                                <div className="d-flex justify-content-center">
                                                    <div className="spinner-border gp-text-primary" role="status"></div>
                                                </div>
                                            </td>
                                        </tr>
                                        :
                                        this.state.list_length == 0 ?
                                        <tr><td className="text-justify">Бүртгэл байхгүй байна</td></tr>:''
                                        items.map((req, idx) =>
                                            <RevokeRequestTable
                                                key={idx}
                                                idx={(current_page * revoke_per_page) - revoke_per_page + idx + 1}
                                                values={req}
                                                paginate={this.paginate}
                                                setLoading={this.setLoading}
                                            />
                                        )
                                    }
                                </tbody>
                            </table>
                        </div> */}
                        {/* <Pagination
                            paginate={this.paginate}
                            search_query={this.state.search_query}
                            sort_name={this.state.sort_name}
                            search_state={search_state}
                        /> */}
                         <div className="col-md-12">
                        <PortalDataTable
                            refresh={refresh}
                            color={'primary'}
                            талбарууд={талбарууд}
                            жагсаалтын_холбоос={жагсаалтын_холбоос}
                            per_page={20}
                            уншиж_байх_үед_зурвас={"Хүсэлтүүд уншиж байна"}
                            хувьсах_талбарууд={хувьсах_талбарууд}
                            нэмэлт_талбарууд={нэмэлт_талбарууд}
                            max_data={'open'}
                            хайлт={'closed'}
                            sort_name={'-created_at'}
                            custom_query={this.state.custom_query}
                        />
                        </div>
                    </div>
                </div>
        )
    }
}
