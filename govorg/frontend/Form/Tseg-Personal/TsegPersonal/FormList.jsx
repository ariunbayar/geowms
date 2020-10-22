import React, { Component } from "react"
import FormTable from './FormTable'
import {NavLink} from "react-router-dom"
import {service} from '../../service'
import {Pagination} from '../../../Components/pagination/pagination'
import ModalAlert from '../../../Components/helpers/ModalAlert'

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
            modal_alert_status: 'closed',
            timer: null,
            modal_text: '',
            modal_icon: ''
        }

        this.paginate = this.paginate.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.modalClose = this.modalClose.bind(this)
        this.modalCloseTime = this.modalCloseTime.bind(this)
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
                this.setState({modal_alert_status: 'open', modal_text: 'устгалаа', modal_icon: 'success'})
                this.paginate(1, this.state.searchQuery)
                this.modalCloseTime()
            }
        })
    }

    handleSuccess(point_type, objectid, point_class, t_type) {
        service.tsegPersonalSuccess(point_type, objectid, point_class, t_type).then(({success, msg}) => {
            if(success){
                this.setState({modal_alert_status: 'open', error: !success, error_msg: msg, modal_text: 'Амжилттай баталгаажлаа', modal_icon: 'success'})
                this.paginate(1, this.state.searchQuery)
                this.modalCloseTime('success')
            }
            else
            {
                this.setState({modal_alert_status: 'open', error: false, error_msg: [], modal_text: 'Баталгаажлахад алдаа гарлаа', modal_icon: 'danger'})
                this.modalCloseTime('danger')
            }
        })
    }

    modalCloseTime(value){
        if(value == 'success'){
            this.state.timer = setTimeout(() => {
                this.setState({modal_alert_status: "closed"})
            }, 2000)
        }
        else{
            this.state.timer = setTimeout(() => {
                this.setState({modal_alert_status: "closed"})
            }, 2000)
        }
    }

    modalClose(){
        clearTimeout(this.state.timer)
        this.setState({modal_alert_status: "closed"})
    }

    render() {
        const { perm_view, perm_create, perm_remove, perm_revoke, perm_review, perm_approve } = this.props.perms
        const { error, error_msg } = this.state
        const error_bn = Object.keys(error_msg).length > 0
        return (
            <div  className="card">
                <div  className="card-body">
                    <div className="row">
                        <div className="col-md-12 ">
                            {
                                error && error_bn
                                ?
                                <div className="text-left">
                                    <div className="text-danger">{error_msg}</div>
                                </div>
                                :
                                <div className="text-left">
                                    <div className="text-success">{error_msg}</div>
                                </div>
                            }
                            {perm_create ?
                                <NavLink className="btn gp-btn-primary float-right" to={"/gov/froms/tseg-info/tsegpersonal/tseg-personal/add/"}>
                                    Нэмэх
                                </NavLink>
                            : null}
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
                                            { perm_remove && perm_create && perm_view ? <th scope="col">Засах</th> : null}
                                            { perm_remove ? <th scope="col">Устгах</th> : null}
                                            { perm_approve ? <th scope="col">Баталгаажуулах</th> : null}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.tseg_personal.map((values, idx) =>
                                            <FormTable
                                                key={idx}
                                                idx = {idx}
                                                values={values}
                                                perms={this.props.perms}
                                                handleRemove={() => this.handleRemove(values.id, values.t_type)}
                                                handleMove={this.handleMove}
                                                handleSuccess = {() => this.handleSuccess(values.point_type, values.id, values.point_class ,values.t_type)}
                                            />
                                        )}
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
                                title={this.state.modal_text}
                                model_type_icon = {this.state.modal_icon}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}