import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {LogOutLogTable} from './LogOutLogTable'


export class LogOutLog extends Component {


    constructor(props) {
        super(props)
        this.state = {
            logout_log_all: [],
            logout_length:null,
            currentPage:1,
            logoutPerPage:30
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.logoutAll().then(({ logout_log_all }) => {
            if(logout_log_all){
                this.setState({logout_log_all, logout_length:logout_log_all.length})
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
        if(this.state.currentPage<Math.ceil(this.state.logout_length/this.state.logoutPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }
    render() {
        const { logout_log_all, currentPage, logoutPerPage, logout_length } = this.state
        const lastIndex=currentPage*logoutPerPage
        const firtsIndex=lastIndex-logoutPerPage 
        const totalPages=Math.ceil( logout_length/logoutPerPage)
        const currentLogout= logout_log_all.slice(firtsIndex,lastIndex)
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
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

                    <h5 className="mb-3">Гарсан мэдээлэл</h5>
                    <div className="row rounded">
                        <div className="col-md-12">
                        <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хэрэглэгчийн нэр</th>
                                        <th scope="col">Хэрэглэгчийн дугаар</th>
                                        <th scope="col">IP Хаяг</th>
                                        <th scope="col">Гарсан огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    { logout_length === 0 ?
                                    <tr><td>Гаралтын хандалт байхгүй байна </td></tr>:
                                    currentLogout.map((logout, idx) =>
                                        <LogOutLogTable key = {idx} idx = {(currentPage*30)-30+idx+1} values={logout}></LogOutLogTable>
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
