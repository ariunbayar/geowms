
import React, { Component } from "react";
import { Pagination } from "../Components/pagination/pagination"
import { service } from "./service"
import System from './System'


export class Form extends Component {

    constructor(props) {
        super(props)
        this.state = {
            systems: [],
            searchQuery: '',
            currentPage: 1,
            systemPerPage: 20,
            govorg_length:null,
        }
        this.paginate = this.paginate.bind(this);

    }

    componentDidMount() {
        const perpage = this.state.systemPerPage
        const query = this.state.searchQuery
        Promise.all([
            service.paginatedList(this.state.currentPage, perpage, query),
            service.detail(this.state.currentPage),
        ])

    }

    paginate(page, query) {
        const perpage = this.state.systemPerPage
        this.setState({ currentPage: page })
        return service
            .paginatedList(page, perpage, query)
            .then(page => {
            this.setState({ systems: page.items, govorg_length: page.items.length });
            return page
        })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value })
            this.paginate(1, e.target.value)
        }
    }

    render() {
        const {currentPage, systemPerPage, systems, govorg_length}=this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 pl-5 m-5">
                        <input
                            type="text"
                            className="form-control flaot-left col-md-4  mb-1"
                            id="searchQuery"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                        />
                        <table className="table table-bordered">
                           <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Нэр</th>
                                    <th scope="col">Токен</th>
                                    <th scope="col">Огноо</th>
                                </tr>
                            </thead>
                            <tbody>
                                { govorg_length === 0 ?
                                    <tr><td>Систем бүртгэлгүй байна </td></tr>:
                                    systems.map((values,index) =>
                                    <System
                                        key={values.id}
                                        idx={(currentPage*systemPerPage)-systemPerPage+index+1}
                                        values={values}
                                    />
                                )}
                            </tbody>
                        </table>
                        <Pagination paginate={this.paginate}
                            searchQuery = { this.state.searchQuery }
                        />
                    </div>
                </div>
            </div>
        );
    }
}