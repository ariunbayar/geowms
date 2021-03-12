import React, { Component } from "react"
import {service} from './service'
import {NavLink} from "react-router-dom"
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader"
import GroupList from './list'
import { GSPaginate } from "./geo_pagination"

export class List extends Component {

    constructor(props) {

        super(props)
        this.state = {
            group_list: [],
            search_query: '',
            currentPage: 1,
            groupPerPage: 20,
            is_loading: false,
            currentGroups: [],

            modal_status: "closed",
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleGroupDelete = this.handleGroupDelete.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.paginate = this.paginate.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {
        this.setState({is_loading: true})
        service.getgrouplist().then(({group_list}) => {
            this.setState({
                group_list,
                is_loading: false})
        })
    }

    handleSearch(e) {
        if (e.target.value.length != "" ) {
            this.setState({search_query: e.target.value})
        }
        else {
            this.setState({search_query: ''})
            this.handleListUpdated()
        }
    }

    paginate(currentGroups, currentPage, search_query) {
        this.setState({currentPage, currentGroups, search_query})
    }

    handleGroupDelete(name){
        service.remove_layer_group(name).then(({success, info}) =>{
            if (success) {
                this.modalChange(
                    'fa fa-check-circle',
                    'success',
                    info
                )
            } else {
                this.modalChange(
                    'fa fa-times-circle',
                    'danger',
                    info
                )
            }
            this.handleListUpdated()
        })
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, icon_color, title) {
        this.setState({
            modal_icon,
            icon_color,
            title,
        })
        this.handleModalOpen()
    }

    render() {
        const {
            group_list, currentGroups, search_query,
            groupPerPage, currentPage, is_loading,
        } = this.state
        return (
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="row">
                    <Loader is_loading={is_loading}/>
                        <div className="col-md-6">
                            <div className="float-sm-left search-bar">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="search_query small-input"
                                    placeholder="Хайх"
                                    onChange={(e) => this.handleSearch(e)}
                                    value={search_query}
                                />
                                <a><i className="icon-magnifier"></i></a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="float-sm-right">
                                <NavLink
                                    className="btn gp-btn-primary waves-effect waves-light btn-sm"
                                    to="/back/layer-groups/нэмэх/">
                                    Нэмэх
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="table-responsive table_wrapper ml-2">
                        <table className="table table_wrapper_table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">TileCaching</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                { currentGroups.length ===0 ?
                                        <tr><td>geoserver дээр group бүртгэлгүй байна</td></tr>:

                                        currentGroups.map((value, idx) =>
                                                <GroupList
                                                    idx={(currentPage*groupPerPage)-groupPerPage+idx+1}
                                                    value={value}
                                                    handleRemove={() => this.handleGroupDelete(value)}
                                                />
                                    )}
                            </tbody>
                        </table>
                    </div>
                    <GSPaginate
                        paginate={ this.paginate }
                        item_list={ group_list }
                        search_query={ search_query }
                        per_page={ groupPerPage }
                        page={ currentPage }
                    />
                </div>
                <Modal
                    modal_status={this.state.modal_status}
                    modal_icon={this.state.modal_icon}
                    icon_color={this.state.icon_color}
                    title={this.state.title}
                    text=''
                    has_button={false}
                    modalAction={null}
                />
        </div>
        )
    }
}
