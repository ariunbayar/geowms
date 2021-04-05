import React, { Component } from 'react';
import {NavLink} from "react-router-dom"

import { service } from '../../service'

import { Pagination } from "@utils/Pagination"
import { GPIcon } from '@utils/Tools'
import Modal from "@utils/Modal/Modal"

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
            point_types: [],
            point_classes: [],
            point_role_list: props.point_role_list,
        }
        this.paginate = this.paginate.bind(this)
        this.getFields = this.getFields.bind(this)
    }

    componentDidMount() {
        this.getFields()
    }

    getFields() {
        service
            .getFieldValue()
            .then(({ point_types, point_classes }) => {
                this.setState({ point_types, point_classes })
            })
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

    render() {
        const { items, legnth, point_types, point_classes, point_role_list} = this.state
        return (
            <div className="card">
                <div className="card-body">
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
                                                    point_types={point_types}
                                                    point_classes={point_classes}
                                                    point_role_list={point_role_list}
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
            point_role_list: props.point_role_list
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
        const { idx, point_types, point_classes, point_role_list} = this.props

        let suljee
        let angi
        if (suljeenii_torol) {
            point_types.map((item, idx) => {
                if (item.code_list_id == suljeenii_torol) {
                    suljee = item.code_list_name
                }
            })
        }

        if (center_typ) {
            point_classes.map((item, idx) => {
                if (item.code_list_id == center_typ) {
                    angi = item.code_list_name
                }
            })
        }

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
                    {suljee}
                </td>
                <td>
                    {angi}
                </td>
                <td>
                {
                    (point_role_list && point_role_list.PERM_UPDATE) &&
                    <a href={`/gov/forms/tseg-info/tsegpersonal/inspire-tseg/${geo_id}/засах/`}>
                        <GPIcon icon={`fa fa-pencil-square-o`} color={`text-success`} hover_color={'white'}></GPIcon>
                    </a>
                }
                </td>
            </tr>
        );
    }
}