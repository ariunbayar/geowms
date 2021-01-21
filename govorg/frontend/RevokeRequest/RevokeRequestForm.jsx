
import React, { Component } from "react"
import {service} from './service'
import {RevokeRequestTable} from './RevokeRequestTable'
import { Pagination } from "../components/pagination/pagination"

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
        }
        this.setLoading = this.setLoading.bind(this)
        this.paginate = this.paginate.bind(this);
        this.handleState = this.handleState.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.search_state !== this.state.search_state)
        {
            this.setState({ search_state: this.state.search_state })
        }
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
                        <div className="table-responsive">
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
                                        <tr><td className="text-justify">Бүртгэл байхгүй байна</td></tr>:
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
                        </div>
                        <Pagination
                            paginate={this.paginate}
                            search_query={this.state.search_query}
                            sort_name={this.state.sort_name}
                            search_state={search_state}
                        />
                    </div>
                </div>
        )
    }
}