import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import User from './User'
import { toSize } from "ol/size"
import { Pagination } from "../pagination/pagination"

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.state = {
            user_list: [],
            user_length:null,
            currentPage:1,
            usersPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,
            }     
        this.paginate = this.paginate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.searchValue = React.createRef();
        this.isLoad = this.isLoad.bind(this)
    }

    componentDidMount(){
        this.searchValue.current.focus();
    }

    paginate (page, query) {
        const perpage = this.state.usersPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query)
                .then(page => {
                    this.setState({user_list: page.items, search_load: false})
                    this.isLoad()
                    return page
                })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value, search_load: true})
            this.paginate(this.state.currentPage, e.target.value)
        }
        else
        {
            this.setState({ [field]: e.target.value, search_load: true })
            this.paginate(this.state.currentPage, e.target.value)
        }
    }

    isLoad(){
        const{ search_load } = this.state
        if (!search_load) {
            this.searchValue.current.focus();
        }
    }

    render() {
        const { user_list, user_length, search_load } = this.state
        return (
            <div className="container shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-4  mb-1" >                 
                        <input
                            type="text"
                            className="form-control"
                            disabled = {( search_load ? true : false )}
                            id="searchQuery"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                            ref = {this.searchValue}
                        />
                    </div>
                    <div className="col-md-12">
                        <table className="table table-fluid">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">Цахим шуудан</th>
                                    <th scope="col">Хэрэглэгчийн эрх</th>
                                    <th scope="col">Идэвхтэй эсэх</th>
                                    <th scope="col">ДАН системээр баталгаажсан эсэх</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user_length === 0 ?
                                    <tr><td>Хэрэглэгч бүртгэлгүй байна </td></tr>:
                                    user_list.map((values,index) =>
                                        <User
                                            key={values.id}
                                            values={values}
                                            idx={(this.state.currentPage*20)-20+index+1}
                                        />
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination
                    paginate = { this.paginate }
                    searchQuery = { this.state.searchQuery }
                />
            </div>
        )
    }
}