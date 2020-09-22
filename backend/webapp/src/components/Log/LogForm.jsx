import React, { Component } from "react"
import {LogFormTable} from './LogFormTable'
import {service} from './service'
import { Pagination } from "../../../../../src/components/Pagination/index"

export class LogForm extends Component {

    constructor(props) {
        super(props)
        this.state = {
            payment_all:[],
            pay_legth:null,
            currentPage:1,
            payPerPage:100,
            searchQuery:''
        }
        this.paginate = this.paginate.bind(this)
    }

    paginate (page) {
        const perpage = this.state.payPerPage
        this.setState({ currentPage: page })
            return service
                .payList(page, perpage)
                .then(page => {
                    this.setState({ payment_all: page.items, pay_legth: page.items.length })
                    return page
                })
    }

    render() {
        const {payment_all, pay_legth} = this.state
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer shadow-lg p-3 mb-5 bg-white rounded">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                        <table className="table example" id="example">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Хэрэглэгч</th>
                                    <th scope="col">Амжилттай/Амжилтгүй</th>
                                    <th scope="col">Нийт дүн</th>
                                    <th scope="col">Тодорхойлолт</th>
                                    <th scope="col">Код</th>
                                    <th scope="col">Мэдэгдэл</th>
                                    <th scope="col">Дата ID</th>
                                    <th scope="col">Банкны дугаар</th>
                                    <th scope="col">Гео дугаар</th>
                                    <th scope="col">Огноо</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pay_legth === 0 ?
                                <tr><center>Мэдээлэл байхгүй байна</center></tr>:
                                payment_all.map((pay, idx) =>
                                    <LogFormTable
                                        key = {idx}
                                        idx = {idx}
                                        values={pay}>
                                    </LogFormTable>
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            paginate = {this.paginate}
                            searchQuery = {this.state.searchQuery}
                        />
                    </div>
                </div>
            </div>
        )
    }
}