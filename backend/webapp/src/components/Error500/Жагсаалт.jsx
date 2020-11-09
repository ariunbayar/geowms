import React, { Component } from 'react'
import { Pagination } from "../../../../../src/components/Pagination/index"
import {service} from './service'

export class Жагсаалт extends Component {

    constructor(props) {

        super(props)
        this.state = {
            error500_list: [],
            error500_length:null,
            currentPage:1,
            usersPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
    }

    paginate (page, query, sort_name) {
        const perpage = this.state.usersPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query, sort_name)
                .then(page => {
                    this.setState({error500_list: page.items , error500_length:page.items.length})
                    return page
                })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(this.state.currentPage, e.target.value)
        }
    }

    render() {
        const { error500_list, error500_length, usersPerPage } = this.state
        return (
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="float-right search-bar mr-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="searchQuery"
                                        placeholder="Хайх"
                                        onChange={(e) => this.handleSearch('searchQuery', e)}
                                        value={this.state.searchQuery}
                                    />
                                    <a><i className="icon-magnifier"></i></a>
                                </div>
                            </div>
                            <div className="row pt-4">
                                {error500_length === 0 ?
                                    <h5>Хэрэглэгч бүртгэлгүй байна </h5>
                                    :
                                    error500_list.map((values, index) =>
                                        <div className="col-lg-6" id="accordion1" key={index}>
                                            <a href="#" className="list-group-item-action"data-toggle="collapse" data-target={`#collapse-${index}`} aria-expanded="false" aria-controls={`#collapse-${index}`} >
                                                <div className="card mb-2">
                                                    <div className="card-header" style={{borderBottomWidth:'0px'}}>
                                                        <button className="btn btn-link shadow-none collapsed text-dark" data-toggle="collapse" data-target={`#collapse-${index}`} aria-expanded="false" aria-controls={`#collapse-${index}`}>
                                                            {values.request_method} - {values.created_at} - {values.request_url}
                                                        </button>
                                                    </div>
                                                    <div id={`collapse-${index}`} className="collapse" data-parent="#accordion1">
                                                        <div className="card-body">
                                                            <h4>Headers</h4>
                                                            <pre><code>{values.request_headers}</code></pre>
                                                            <h4>Exception</h4>
                                                            <pre><code>{values.description}</code></pre>
                                                            <h4>POST arguments</h4>
                                                            <pre><code>{values.request_data}</code></pre>
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="pl-4 pt-4">
                                <Pagination
                                    sort_name = {this.state.sort_name}
                                    paginate = { this.paginate }
                                    searchQuery = { this.state.searchQuery }
                                />
                            </div>
                        </div>
                    </div>
        )
    }
}
