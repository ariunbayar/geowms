import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import ListTable from "./ListTable"
import {service} from './service'
import {Pagination} from '../../../../components/pagination/pagination'
import Modal from "@utils/Modal/Modal"


export class List extends Component {


    constructor(props) {

        super(props)

        this.state = {
            currentPage: 1,
            TsegPerPage: 20,
            searchQuery: '',
            list: [],
            list_length: null,
            modal_status: 'closed',
            modal_icon: '',
            icon_color: '',
            title: '',
        }
        this.paginate = this.paginate.bind(this)
        this.handleTsegSuccess = this.handleTsegSuccess.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.TsegPerPage
        this.setState({ currentPage: page })
            return service
                .paginatedList(page, perpage, query)
                .then(page => {
                    this.setState({ list: page.items, list_length: page.items.length})
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

    handleTsegSuccess(id){
        service.tseg_success(id).then(({ success }) => {
            if (success) {
                this.modalChange(
                    'fa fa-check-circle',
                    'success',
                    'Амжилттай баталгаажлаа'
                )
            }
            else{
                this.modalChange(
                    'fa fa-times-circle',
                    'danger',
                    'Баталгаажуулахад алдаа гарлаа'
                )
            }
            this.paginate(1,"")
        })
    }

    handleRemove(id){
        service.tseg_remove(id).then(({ success }) => {
            if (success) {
                this.modalChange(
                    'fa fa-check-circle',
                    'success',
                    'Амжилттай утсгалаа'
                )
                this.paginate(1,"")
            }
            else {
                this.modalChange(
                    'fa fa-times-circle',
                    'danger',
                    'Утгахад алдаа гарлаа'
                )
            }
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
        return (
            <div className="card">
                <div  className="card-body">
                    <div className="col-md-12">
                        <NavLink className="btn gp-btn-primary float-right my-2" to={"/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/add/"}>
                            Нэмэх
                        </NavLink>
                        <input
                            type="text"
                            className="form-control col-md-4 float-left"
                            id="searchQuery"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={this.state.searchQuery}
                        />
                        <div className="table-responsive">
                            <table className="table table-fluid my-4">
                                <thead>
                                    <tr>
                                        <th scope="col"> № </th>
                                        <th scope="col"> Email </th>
                                        <th scope="col">Байгууллага</th>
                                        <th scope="col">Албан тушаал</th>
                                        <th scope="col">Цэгийн дугаар</th>
                                        <th>Засах</th>
                                        <th>Баталгаажуулах</th>
                                        <th>Устгах</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    this.state.list_length == 0
                                    ?
                                        <tr><td>"Бүртгэл байхгүй байна"</td></tr>
                                    :
                                    (this.state.list.map((tseg, idx) =>
                                        <ListTable
                                            key={idx}
                                            idx={idx}
                                            values={tseg}
                                            handleTsegSuccess={() => this.handleTsegSuccess(tseg.id)}
                                            handleRemove={() => this.handleRemove(tseg.id)}
                                        />
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            paginate = {this.paginate}
                            searchQuery = {this.state.searchQuery}
                        />
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
                </div>
            </div>
        )
    }
}
