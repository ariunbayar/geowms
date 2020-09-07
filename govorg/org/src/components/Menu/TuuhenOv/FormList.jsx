import React, { Component } from "react"
import FormTable from './FormTable'
import {NavLink} from "react-router-dom"
import {service} from './service'
import {Pagination} from '../../../../../pagination/pagination'

export class FormList extends Component {

    constructor(props) {

        super(props)
        this.state = {
            tuuh_soyl: [],
            tuuh_soyl_list: null,
            searchQuery: '',
            perPage: 20,
            currentPage: 1,
            msg: [],
            alert: false,
        }

        this.paginate = this.paginate.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }

    paginate (page, query) {
        const perpage = this.state.perPage
        this.setState({ currentPage: page })
            return service
                .list(page, perpage, query)
                .then(page => {
                    this.setState({ tuuh_soyl: page.items, tuuh_soyl_list: page.items.length })
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

    handleRemove(id) {
        service.remove(id).then(({success, msg}) => {
            if (success){
                this.setState({ msg, alert: success })
                setTimeout(() => {
                    this.setState({ alert: false, msg: [] })
                }, 3000);
                this.handleListUpdated()
            }else{
                this.setState({ msg, alert: false })
                setTimeout(() => {
                    this.setState({ alert: false, msg: [] })
                }, 3000);
            }
        })
    }


    render() {
        const{ tuuh_soyl_list, searchQuery, tuuh_soyl , alert, msg} = this.state
        const error_bn = Object.keys(msg).length > 0
        return (
            <div  className="container my-4">
                <div className="row">
                    <div className={`text-left position-absolute` +
                        (error_bn ? ' d-show': ' d-none') + (alert && error_bn? ' alert alert-success': ' alert alert-danger')} role="alert">
                        <div className={alert && error_bn?"text-success":"text-danger"}>{msg}</div>
                    </div>
                    <div className="col-md-12">
                        <div className="text-right">
                            <NavLink className="btn gp-btn-primary" to={`/gov/tuuhen-ov/add/`}>
                                Нэмэх
                            </NavLink>
                        </div>
                        <input
                            type="text"
                            className="form-control col-md-4  mb-1 float-left"
                            id="searchQuery"
                            placeholder="Хайх"
                            onChange={(e) => this.handleSearch('searchQuery', e)}
                            value={searchQuery}
                        />
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col">Бүртгэлийн дугаар</th>
                                    <th scope="col">Аймаг, Нийслэл</th>
                                    <th scope="col">Сум, Дүүрэг</th>
                                    <th scope="col">Тоо ширхэг</th>
                                    <th scope="col">Бүртгэгч</th>
                                    <th scope="col">Он,сар,өдөр</th>
                                    <th scope="col">Нэмэх</th>
                                    <th scope="col">Засах</th>
                                    <th scope="col">Устгах</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    tuuh_soyl_list == 0
                                    ?
                                        "Бүртгэл байхгүй байна"
                                    :
                                        (tuuh_soyl.map((values, idx) =>
                                            <FormTable
                                                key={idx}
                                                idx = {idx}
                                                values={values}
                                                handleRemove={() => this.handleRemove(values.id)}
                                                handleMove={this.handleMove}
                                            />
                                        ))
                                }
                            </tbody>
                        </table>
                        <Pagination
                            paginate = {this.paginate}
                            searchQuery = {searchQuery}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
