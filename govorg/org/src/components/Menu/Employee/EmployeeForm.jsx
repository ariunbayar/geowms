
import React, { Component } from "react"
import {EmployeeTable} from './EmployeeTable'
import { service } from "../../service"
import { Pagination } from "../../../../../pagination/pagination"


export default class Employee extends Component {

    constructor(props) {
        super(props)
        this.state={
            employee:[],
            currentPage:1,
            orgPerPage:2,
        }
        this.paginate = this.paginate.bind(this)
    }

  paginate (page) {
    const perpage = this.state.orgPerPage
    this.setState({ currentPage: page })
        return service
            .paginatedList(page, perpage)
            .then(page => {
                this.setState({employee: page.items })
                return page
            })
  }

    render() {
        return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 pl-5 m-5">
                    <table className="table table-bordered">
                         <thead>
                            <tr>
                                <th scope="col">№</th>
                                <th scope="col">#</th>
                                <th scope="col">Овог</th>
                                <th scope="col">Нэр</th >
                                <th scope="col">Хэрэглэгчийн нэр</th >
                                <th scope="col">Имэйл</th >
                                <th scope="col">Регистр</th >
                                <th scope="col">Хүйс</th >
                                <th scope="col">Албан тушаал</th >
                                <th scope="col">Үүсгэсэн огноо</th >
                            </tr>
                        </thead>
                        <tbody>
                           { this.state.employee.map((p, idx) =>
                            <EmployeeTable
                                key={idx}
                                idx={(this.state.currentPage*2)-2+idx+1}
                                values={p}
                            />
                            )}
                        </tbody>
                       </table>
                       <Pagination
                        paginate = { this.paginate }
                         />
                    </div>
                  </div>
            </div>
        )
    }
}
