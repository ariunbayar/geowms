import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import ListTable from "./ListTable"
import {service} from './service'
import {Pagination} from '../../../../components/pagination/pagination'
import ModalAlert from "@utils/Modal/ModalAlert"


export class List extends Component {


    constructor(props) {

        super(props)

        this.state = {
            currentPage: 1,
            TsegPerPage: 20,
            searchQuery: '',
            list: [],
            list_length: null,
            modal_alert_status: 'closed',
            timer: null,
            modal_text: '',
            modal_icon: '',
            point_role_list: props.point_role_list,
        }
        this.paginate = this.paginate.bind(this)
        this.handleTsegSuccess = this.handleTsegSuccess.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
    }

    componentDidUpdate(pP, pS) {
        if(pP.point_role_list != this.props.point_role_list) {
            this.setState({point_role_list})
        }
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
        service.tseg_success(id).then(({ success, msg}) => {
            if (success) {
                this.setState({modal_alert_status: 'open', modal_text: msg, modal_icon: 'success'})
                this.paginate(1,"")
                this.modalCloseTime()
            }
            else{
                this.setState({modal_alert_status: 'open', modal_text: msg, modal_icon: 'danger'})
                this.paginate(1,"")
                this.modalCloseTime()
            }
        })
    }

    handleRemove(id){
        service.tseg_remove(id).then(({ success, info}) => {
            if (success) {
                this.setState({modal_alert_status: 'open', modal_text: info,  modal_icon: 'success'})
                this.paginate(1,"")
                this.modalCloseTime()
            }
            else {
                this.setState({modal_alert_status: 'open', modal_text: info,  modal_icon: 'danger'})
                this.modalCloseTime()
            }
        })
    }

    modalCloseTime(){
        this.state.timer = setTimeout(() => {
            this.setState({modal_alert_status: "closed"})
        }, 2000)
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
    }

    render() {
        const { point_role_list } = this.state
        return (
            <div className="card">
                <div  className="card-body">
                    <div className="col-md-12">
                        {
                            <NavLink className="btn gp-btn-primary float-right my-2" to={"/gov/forms/tseg-info/tsegpersonal/tseg-ustsan/add/"}>
                                Нэмэх
                            </NavLink>
                        }
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
                                            point_role_list={point_role_list}
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
                        <ModalAlert
                            modalAction={() => this.modalClose()}
                            status={this.state.modal_alert_status}
                            title={`${this.state.modal_text}`}
                            model_type_icon = {`${this.state.modal_icon}`}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
