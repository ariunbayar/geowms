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
            searchQuery: '',
            query_min: false,
            search_load: false,

            }     

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.handleListCal=this.handleListCal.bind(this)
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
            if(len){
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
    handleSearch(field, e) {
        if(e.target.value.length > 0)
        {
            this.setState({ [field]: e.target.value, search_load:true})
            service.userSearch(e.target.value).then(({ user_list }) => {
                if(user_list){
                    this.setState({user_list, user_length:user_list.length, search_load:false})
                }
            })
        }
        else
        {
            this.setState({ [field]: e.target.value })
            const {currentPage}=this.state.currentPage
            this.handleListCal(currentPage)
        }
    }
    render() {
        const {user_list, user_length, currentPage,usersPerPage}=this.state
        const totalPages=Math.ceil( user_length/usersPerPage)

        return (
            <div className="container shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                <div className="col-md-4  mb-1" >                 
                               <input
                                type="text"
                                className="form-control"
                                id="searchQuery"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('searchQuery', e)}
                                value={this.state.searchQuery}
                            />
                    </div>
                    <div className="col-md-12">

                        <table className="table table-fluid">
                            <thead>
                                <tr>
                                    <th scope="col"> № </th>
                                    <th scope="col"> Нэр </th>
                                    <th scope="col">Цахим шуудан</th>
                                    <th scope="col">Хэрэглэгчийн эрх</th>
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