import React, { Component } from "react"
import {service} from "./service"
import {TableBody} from './TableBody'
import { Pagination } from "./Pagination"
import {NavLink} from "react-router-dom"
import Loader from "@utils/Loader"


export class PortalDataTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            items: [],
            items_length: null,
            current_page: 1,
            per_page: props.per_page || 20,
            query: '',
            уншиж_байгаа_эсэх: false,
            талбарууд: props.талбарууд,
            жагсаалтын_холбоос: props.жагсаалтын_холбоос,
            хоосон_байх_үед_зурвас: props.хоосон_байх_үед_зурвас || 'Хоосон байна.',
            уншиж_байх_үед_зурвас: props.уншиж_байх_үед_зурвас || 'Уншиж байна.',
            хувьсах_талбарууд: props.хувьсах_талбарууд || [],
            нэмэлт_талбарууд: props.нэмэлт_талбарууд || [],
            нэмэх_товч: props.нэмэх_товч || '',
            хайлт: props.хайлт || "open",
            sort_name: props.sort_name || '',
            color: props.color || "dark",
            max_data: props.max_data || 'open',
            table_head_color: props.table_head_color || 'white',
        }
        this.paginate = this.paginate.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.handleSort = this.handleSort.bind(this)
    }

    handleSort(sort_name, sort_type) {
        if(sort_type){
            this.setState({[sort_name]: false, sort_name})
        }else{
            this.setState({[sort_name]: true, sort_name: '-' + sort_name})
        }
    }

    paginate (page, query, sort_name, per_page, custom_query) {
        const { жагсаалтын_холбоос } = this.state
        this.setState({ уншиж_байгаа_эсэх: true })
        return service
            .list(жагсаалтын_холбоос, page, per_page, query, sort_name, custom_query)
            .then(page => {
                this.setState({ items: page.items, items_length: page.items.length, уншиж_байгаа_эсэх: false })
                return page
            })
    }

    handleSearch(field, e) {
        if(e.target.value.length >= 1)
        {
            this.setState({ [field]: e.target.value, query: e.target.value })
        }
        else
        {
            this.setState({ [field]: e.target.value, query: e.target.value })
        }
    }

    componentDidUpdate(pp, ps){
        if(pp.refresh !== this.props.refresh){
            this.setState({ refresh: this.props.refresh })
        }
        if(pp.custom_query !== this.props.custom_query){
            this.setState({ custom_query: this.props.custom_query })
        }
    }

    render() {
        const { items, current_page, items_length, per_page,
            талбарууд, хоосон_байх_үед_зурвас, нэмэх_товч, уншиж_байх_үед_зурвас,
            уншиж_байгаа_эсэх, хувьсах_талбарууд, нэмэлт_талбарууд,
            хайлт, color, max_data, table_head_color
        } = this.state
        return (
           <div>
               {хайлт == "closed" && нэмэх_товч == '' && max_data == 'closed'
               ?
               null
               :
                <div className="row">
                    {
                        хайлт == "open" &&
                            <div className="search-bar">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch('searchQuery', e)}
                                    value={this.state.searchQuery}
                                />
                                <a><i className="icon-magnifier"></i></a>
                            </div>
                    }
                    {
                        max_data == 'open' &&
                            <div className="col">
                                <div className="row text-right">
                                    <div className="col">
                                        <strong className={`text-right mt-1 text-${color}`}>Өгөгдлийн хэмжээ:&nbsp;</strong>
                                    </div>
                                    <div className="row">
                                        <select className="form-control form-control-sm" value={per_page} onChange={(e) => this.setState({per_page: e.target.value})}>
                                            <option value="10">10</option>
                                            <option value="20">20</option>
                                            <option value="30">30</option>
                                            <option value="40">40</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                    }
                    {
                        нэмэх_товч &&
                            <div className="col">
                                <div className="float-sm-right">
                                    <NavLink className="btn gp-btn-primary waves-effect waves-light btn-sm mr-2" to={нэмэх_товч}>
                                        Нэмэх
                                    </NavLink>
                                </div>
                            </div>
                    }
                </div>
                }

                <div className="row my-2">
                    <div className="col-lg-12">
                        <div className="table-responsive table_wrapper">
                            <table className="table table_wrapper_table">
                                <thead className={`bg-primary text-${table_head_color}`}>
                                    <tr>
                                        <th scope="col" className={`bg-${color}`}>№</th>
                                        {талбарууд.map((item, index) =>
                                            <th key={index} className={`bg-${color} ${item.is_center ? 'text-center' : null}`}>
                                                {item.title}&nbsp;
                                                <a onClick={() => this.handleSort(item.field, this.state[item.field])}><i className={this.state[item.field] ? "fa fa-caret-up" : "fa fa-caret-down"} aria-hidden="true"></i></a>
                                            </th>
                                        )}
                                        {нэмэлт_талбарууд && нэмэлт_талбарууд.map((item, index) =>
                                            <th key={index}>{item.title}</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    { уншиж_байгаа_эсэх ?
                                        <Loader is_loading={уншиж_байгаа_эсэх} text={уншиж_байх_үед_зурвас}/>
                                        :
                                        (items_length === 0 ?
                                            <tr><td>{хоосон_байх_үед_зурвас}</td></tr>:
                                            items.map((login, idx) =>
                                                <TableBody
                                                    талбарууд={талбарууд}
                                                    key={idx}
                                                    idx={(current_page*per_page)-per_page+idx+1}
                                                    values={login}
                                                    хувьсах_талбарууд={хувьсах_талбарууд}
                                                    нэмэлт_талбарууд={нэмэлт_талбарууд}
                                                >
                                                </TableBody>
                                            )
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            refresh={this.state.refresh}
                            current_page={current_page}
                            custom_query={this.state.custom_query}
                            paginate={this.paginate}
                            query={this.state.query}
                            sort_name={this.state.sort_name}
                            per_page={per_page}
                            color={color}
                        />
                    </div>
                </div>
           </div>
        )

    }
}
