import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import User from './User'
import { toSize } from "ol/size"

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.state = {
            user_list: [],
            user_length:null,
            currentPage:1,
            usersPerPage:8,
            }     

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        
    }

    componentDidMount() {
        const {currentPage}=this.state
        this.handleListCal(currentPage)
    }

    handleListCal(currentPage){
        const {usersPerPage}=this.state
        const lastIndex=currentPage*usersPerPage
        const firtsIndex=lastIndex-usersPerPage
        this.handleListUpdated(lastIndex,firtsIndex)
    }

    handleListUpdated(lastIndex,firtsIndex) { 
        service.getAll(lastIndex,firtsIndex).then(({user_list,len}) => {
            if(true){
             this.setState({user_list,user_length:len})
            }
         })
         
    }

    prevPage(){
        
        if(this.state.currentPage >1){
            this.setState({
                currentPage:this.state.currentPage-1
            })
            this.handleListCal(this.state.currentPage-1)
            
        }
    }

    nextPage(){

        if(this.state.currentPage<Math.ceil(this.state.user_length/this.state.usersPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1,
            })
            this.handleListCal(this.state.currentPage+1)

        }
       
    }


    render() {
        const {user_list, user_length, currentPage,usersPerPage}=this.state
        const totalPages=Math.ceil( user_length/usersPerPage)

        return (
            <div className="container shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12">

                        <table className="table table-fluid">
                        <thead>
                                <tr>
                                    <th scope="col"> Id </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">Цахим шуудан</th>
                                    <th scope="col">Админ эсэх</th>
                                    <th scope="col">Идэвхтэй эсэх</th>
                                    <th scope="col">ДАН системээр баталгаажсан эсэх</th>
                                </tr>
                            </thead>
                             
                                    <tbody>
                                        {user_length === 0 ?
                                            <tr><td>Хэрэглэгч бүртгэлгүй байна </td></tr>:
                                            user_list.map((values,index) =>
                                                <User
                                                    key={values.id}
                                                    values={values}
                                                    idx={(this.state.currentPage*8)-8+index+1}
                                                />
                                            )
                                        }
                                    </tbody>
                        </table>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="float-left">
                            <strong>Хуудас {currentPage}-{totalPages}</strong>
                        </div>
                        <div className="float-right">
                            <button
                            type=" button" 
                            className="btn btn-outline-primary" 
                            onClick={this.prevPage}
                            > &laquo; өмнөх
                            </button>
                            <button 
                            type="button"
                            className="btn btn-outline-primary "
                            onClick={this.nextPage} >
                            дараах &raquo;
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
