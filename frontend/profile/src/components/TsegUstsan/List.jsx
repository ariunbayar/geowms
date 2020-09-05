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
            this.handleTsegDelete = this.handleTsegDelete.bind(this) 
    }   

    componentDidMount() {
        this.handlelistall()
    }
    
    handlelistall(){
        console.log("ALLL")
        service.tsegUstsanAll().then(({tseg_ustsan_all, success }) => {
            if (success) {
                this.setState({
                    list:tseg_ustsan_all
                })
            }
        })
    
    }

    handleTsegDelete(id){
        service.tseg_remove(id).then(({ success }) => {
            if (success) {
                this.handlelistall()
            }
        })
    }

    render() {
        return (
            <div className="container ">
                <div className="row">
                    <div className="col-md-12">
                          <NavLink className="btn gp-btn-primary float-right" to={"/profile/tseg-ustsan/add/"}>
                            Нэмэх
                        </NavLink>
                        <table className="table table-fluid">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Email </th>
                                    <th scope="col">Байгууллага</th>
                                    <th scope="col">Албан тушаал</th>
                                    <th scope="col">Утас</th>
                                    <th>Засах</th>
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
                                        handleTsegDelete={() => this.handleTsegDelete(tseg.id)}
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