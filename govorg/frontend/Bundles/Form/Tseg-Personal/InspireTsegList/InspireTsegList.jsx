import React, { Component } from 'react';
import {NavLink} from "react-router-dom"

import { service } from '../../service'

import { Pagination } from "@utils/Pagination"
import { GPIcon } from '@utils/Tools'

class InspireTsegList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            length: null,
            current_page: 1,
            per_page: 20,
            query: '',
            query_min: false,
            search_load: false,
        }
        this.handleSearch = this.handleSearch.bind(this)
        this.paginate = this.paginate.bind(this)
    }

    paginate (page, query, sort_name) {
        const { per_page } = this.state
        this.setState({ current_page: page })
            return service
                .getInspireList(page, per_page, query, sort_name)
                .then(page => {
                    this.setState({items: page.items, length: page.items.length})
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
        const { items, legnth } = this.state
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="float-right search-bar mr-3">
                            <input
                                type="text"
                                className="form-control"
                                id="query"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('query', e)}
                                value={this.state.query}
                            />
                            <a><i className="icon-magnifier"></i></a>
                        </div>
                    </div>
                    <div className="row ml-1">
                        <div className="col-lg-12">
                            <div className="row pt-4 table-responsive">
                                <table className="table">
                                    <thead className="bg-primary text-light">
                                        <tr>
                                            <th>
                                                №
                                            </th>
                                            <th>
                                                Цэгийн нэр
                                            </th>
                                            <th>
                                                Цэгийн дугаар
                                            </th>
                                            <th>
                                                Ангилал
                                            </th>
                                            <th>
                                                Төрөл
                                            </th>
                                            <th>
                                                Засах
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {legnth === 0 ?
                                            <tr>
                                                <th>
                                                    Бүртгэл байхгүй байна
                                                </th>
                                            </tr>
                                            :
                                            items.map((values, index) =>
                                                <Rows key={index}
                                                    idx={index+1}
                                                    values={values}
                                                />
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="pl-4 pt-4">
                        <Pagination
                            sort_name={this.state.sort_name}
                            paginate={this.paginate}
                            searchQuery={this.state.query}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default InspireTsegList;


class Rows extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const {
            point_name,
            point_id,
            suljeenii_torol,
            center_typ,
            geo_id,
        } = this.props.values
        const { idx } = this.props
        return (
            <tr>
                <th>
                    {idx}
                </th>
                <td>
                    <NavLink
                        to={`/gov/forms/tseg-info/tsegpersonal/inspire-tseg/${geo_id}/detail/`}
                    >
                        {point_name}
                    </NavLink>
                </td>
                <td>
                    {point_id}
                </td>
                <td>
                    {suljeenii_torol}
                </td>
                <td>
                    {center_typ}
                </td>
                <td>
                    <a href={`/gov/forms/tseg-info/tsegpersonal/inspire-tseg/${geo_id}/засах/`}>
                        <GPIcon icon={`fa fa-pencil-square-o`} color={`text-success`} hover_color={'white'}></GPIcon>
                    </a>
                </td>
            </tr>
        );
    }
}