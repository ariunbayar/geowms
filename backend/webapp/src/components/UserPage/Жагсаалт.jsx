import React, { Component } from "react"
import "./style.css"
import {service} from './service'
import User from './User'

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.state = {
            user_list: [],
            user_length:null,
            currentPage:1,
            usersPerPage:20

        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.SearchUser=this.SearchUser.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }

    handleListUpdated() {

        service.getAll().then(({user_list}) => {
            this.setState({user_list,user_length: user_list.length})
            
        })
        
    }

    prevPage(){
        if(this.state.currentPage >1){
            this.setState({
                currentPage:this.state.currentPage-1
            })
        }
    }
    nextPage(){
        if(this.state.currentPage<Math.ceil(this.state.user_length/this.state.usersPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }
    SearchUser(e){
        this.setState({
            [e.target.value]:e.target.value
        })
    }
    render() {
        const {currentPage, usersPerPage, user_list, user_length}=this.state
        const lastIndex=currentPage*usersPerPage
        const firtsIndex=lastIndex-usersPerPage 
        const totalPages=Math.ceil( user_length/usersPerPage)
        const currentUsers= user_list.slice(firtsIndex,lastIndex)
        const filter=user_list.filter(user=>{
            return user.name.toLowerCase().includes(search.toLowerCase())
        })
        return (
            <div className="container shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12">
                        <input 
                        type="text" 
                        placeholder="Search"
                        onChange={e=>this.SearchUser(e)}
                        {filter.map(user, idx)}/>
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
                                            currentUsers.map((values,index) =>
                                                <User
                                                    key={values.id}
                                                    values={values}
                                                    idx={(currentPage*20)-20+index+1}
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
                            onClick={this.nextPage
                            } >
                            дараах &raquo;
                            </button>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
