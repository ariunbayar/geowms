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
            loginPerPage:30
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.loginAll().then(({ login_log_all }) => {
            if(login_log_all){
                this.setState({login_log_all, login_length:login_log_all.length})
            }
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
        if(this.state.currentPage<Math.ceil(this.state.login_length/this.state.loginPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }
    render() {
        const { login_log_all,currentPage, loginPerPage, login_length } = this.state
        const lastIndex=currentPage*loginPerPage
        const firtsIndex=lastIndex-loginPerPage 
        const totalPages=Math.ceil( login_length/loginPerPage)
        const currentLogin= login_log_all.slice(firtsIndex,lastIndex)
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
                                        currentLogin.map((login, idx) =>
                                            <LoginLogTable key = {idx} idx = {(currentPage*30)-30+idx+1} values={login}></LoginLogTable>
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
