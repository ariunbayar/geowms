import React, { Component } from "react"
import {NavLink} from "react-router-dom"

import FormTable from './FormTable'
import {service} from '../../service'
import {Pagination} from '../../../../components/pagination/pagination'
import Modal from "@utils/Modal/Modal"

export class FormList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            tseg_personal: [],
            length:null,
            currentPage:1,
            PerPage:50,
            searchQuery: '',
            query_min: false,
            error: false,
            error_msg: [],

            modal_status: 'closed',
            modal_icon: 'fa fa-check-circle',
            icon_color: 'success',
            title: '',
            text: '',
            has_button: false,
        }

        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.PerPage
        this.setState({ currentPage: page })
            return service
                .tsegPersonalList(page, perpage, query)
                .then(page => {
                    this.setState({ tseg_personal: page.items, length: page.items.length })
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

    handleRemove(id, t_type) {
        service.tsegPersonalRemove(id, t_type).then(({success}) => {
            if (success) {
                this.modalChange('fa fa-check-circle', "success", 'Амжилттай устлаа', '', false)
                this.paginate(1, this.state.searchQuery)
            }
            else
            {
                this.modalChange('fa fa-times-circle', "danger", 'Устгахад алдаа гарлаа', '', false)
            }
        })
    }

    handleSuccess(point_type, objectid, point_class, t_type) {
        service.tsegPersonalSuccess(point_type, objectid, point_class, t_type).then(({success, msg}) => {
            if(success){
                this.modalChange('fa fa-check-circle', "success", 'Амжилттай баталгаажлаа', '', false)
                this.paginate(1, this.state.searchQuery)
            }
            else
            {
                this.modalChange('fa fa-times-circle', "danger", 'Баталгаажлахад алдаа гарлаа', '', false)
            }
        })
    }

    modalChange(modal_icon, icon_color, title, text, has_button) {
        this.setState({
            modal_icon: modal_icon,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
        })
        this.handleModalOpen()
    }

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    render() {
        const { error, error_msg } = this.state
        const error_bn = Object.keys(error_msg).length > 0
        return (
            <div  className="card">
                <div  className="card-body">
                    <div className="row">
                        <div className="col-md-12 ">
                            <NavLink className="btn gp-btn-primary float-right" to={"/gov/forms/tseg-info/tsegpersonal/tseg-personal/add/"}>
                                Нэмэх
                            </NavLink>
                            <div className="form-row text-right">
                            <div className="form-group col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="searchQuery"
                                        placeholder="Хайх"
                                        onChange={(e) => this.handleSearch('searchQuery', e)}
                                        value={this.state.searchQuery}
                                    />
                                </div>
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"> № </th>
                                            <th scope="col">Цэгийн нэр</th>
                                            <th scope="col">Цэгийн дугаар</th>
                                            <th scope="col">Төвийн төрөл</th>
                                            <th scope="col">Анги/Зэрэг</th>
                                            <th scope="col">Аймаг</th>
                                            <th scope="col">Сум</th>
                                            <th scope="col">Засах</th>
                                            <th scope="col">Устгах</th>
                                            <th scope="col">Баталгаажуулах</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.tseg_personal.map((values, idx) =>
                                            <FormTable
                                                key={idx}
                                                idx = {idx}
                                                values={values}
                                                handleRemove={() => this.handleRemove(values.id, values.t_type)}
                                                handleMove={this.handleMove}
                                                handleSuccess={() => this.handleSuccess(values.point_type, values.id, values.point_class ,values.t_type)}
                                            />
                                        )}
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
                                has_button={this.state.has_button}
                                text={this.state.text}
                                modalAction={this.props.onClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
