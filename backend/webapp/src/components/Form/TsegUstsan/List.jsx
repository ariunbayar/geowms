import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import ListTable from "./ListTable"
import {service} from './service'

export class List extends Component {


    constructor(props) {

        super(props)

        this.state = {
            list: [],

            }
            this.handlelistall = this.handlelistall.bind(this)
            this.handleTsegSuccess = this.handleTsegSuccess.bind(this)
            this.handleRemove = this.handleRemove.bind(this)
    }

    componentDidMount() {
        this.handlelistall()
    }

    handlelistall(){
        service.tsegUstsanAll().then(({tseg_ustsan_all, success }) => {
            if (success) {
                this.setState({
                    list:tseg_ustsan_all
                })
            }
        })
    }

    handleTsegSuccess(id){
        service.tseg_success(id).then(({ success }) => {
            if (success) {
                this.handlelistall()
            }
        })
    }

    handleRemove(id){
        service.tseg_remove(id).then(({ success }) => {
            if (success) {
                this.handlelistall()
            }
            else {
                alert("Aldaa")
            }
        })
    }

    render() {
        return (
            <div className="container ">
                <div className="row">
                    <div className="col-md-12">
                          <NavLink className="btn gp-btn-primary float-right" to={"/back/froms/tseg-ustsan/add/"}>
                            Нэмэх
                        </NavLink>
                        <table className="table table-fluid">
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
                                this.state.list.map((tseg, idx) =>
                                    <ListTable
                                        key={idx}
                                        idx={idx}
                                        values={tseg}
                                        handleTsegSuccess={() => this.handleTsegSuccess(tseg.id)}
                                        handleRemove={() => this.handleRemove(tseg.id)}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}