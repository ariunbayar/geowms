import React, { Component } from "react"
import {Charts} from './Chart'
import {service} from "../service"
import {LoginLogTable} from './LoginLogTable'


export class LoginLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            login_log_all: [],
            login_length:null,
            currentPage:1,
            loginPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.handleListCal=this.handleListCal.bind(this)        
    }
    
    componentDidMount(){
        const {currentPage}=this.state
        this.handleListCal(currentPage)

    }
    handleListCal(currentPage){
        const {loginPerPage}=this.state
        const lastIndex=currentPage*loginPerPage
        const firtsIndex=lastIndex-loginPerPage
        this.handleGetAll(lastIndex,firtsIndex)
    }

    handleGetAll(lastIndex,firtsIndex){
        service.loginAll(lastIndex,firtsIndex).then(({ login_log_all, len }) => {
            if(login_log_all){
                this.setState({login_log_all, login_length:len})
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
        if(this.state.currentPage<Math.ceil(this.state.login_length/this.state.loginPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }

    handleSearch(field, e) {
        if(e.target.value.length > 0)
        {
            this.setState({ [field]: e.target.value, search_load:true})
            service.loginSearch(e.target.value).then(({ login_log_all }) => {
                if(login_log_all){
                    this.setState({login_log_all, login_length:login_log_all.length, search_load:false})
                }
            })
        }
        else
        {
            this.setState({ [field]: e.target.value })
            const {currentPage}=this.state
            this.handleListCal(currentPage)
        }
    }

    render() {
        const { login_log_all,currentPage, loginPerPage, login_length, search_load } = this.state

        const totalPages=Math.ceil( login_length/loginPerPage)

        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded container">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>

                    <h5 className="mb-3">Хэрэглэгчийн оролт гаралтын тэмдэглэл</h5>
                    <div className="form-row text-right">
                        <div className="form-group col-md-8">
                            <input
                                type="text"
                                className="form-control"
                                id="searchQuery"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('searchQuery', e)}
                                value={this.state.searchQuery}
                            />
                        </div>
                        {search_load && 
                            <a className="spinner-border text-light" role="status">
                                <span className="sr-only">Loading...</span> 
                            </a>
                        }
                    </div>
                    <div className="row rounded">
                        <div className="col-md-12">
                            <table className="table example" id="example">
                                    <thead>
                                        <tr>
                                            <th scope="col">№</th>
                                            <th scope="col">Хэрэглэгчийн нэр</th>
                                            <th scope="col">Хэрэглэгчийн үйлдэл</th>
                                            <th scope="col">Хэрэглэгчийн дугаар</th>
                                            <th scope="col">IP Хаяг</th>
                                            <th scope="col">Нэвтэрсэн огноо</th >
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { login_length === 0 ? 
                                        <tr><td>Нэвтрэлтийн хандалд байхгүй байна </td></tr>:                                 
                                        login_log_all.map((login, idx) =>
                                            <LoginLogTable key = {idx} idx = {(currentPage*20)-20+idx+1} values={login}></LoginLogTable>
                                        )}
                                    </tbody>
                            </table>
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
                    </div>
                </div>
            </div>
        )

    }
}
