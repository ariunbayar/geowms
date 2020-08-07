import React, { Component } from "react"
import {PageLogTable} from './PageLogTable'
import {Charts} from './Chart'
import {PieChart} from './PieChart'
import {service} from "../service"

export class PageLog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            page_logs: [],
            log_length:null,
            currentPage:1,
            logPerPage:30

        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
    }
    
    componentDidMount(){
        this.handleGetAll()

    }

    handleGetAll(){
        service.pageAll().then(({ page_logs }) => {
            if(page_logs){
                this.setState({page_logs, log_length:page_logs.length})
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
        if(this.state.currentPage<Math.ceil(this.state.log_length/this.state.logPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }
    render() {
        const { page_logs,currentPage, logPerPage, log_length } = this.state
        const lastIndex=currentPage*logPerPage
        const firtsIndex=lastIndex-logPerPage 
        const totalPages=Math.ceil( log_length/logPerPage)
        const currentLogs= page_logs.slice(firtsIndex,lastIndex)
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын төхөөрөмжийн тоогоор</h5>
                            <PieChart></PieChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>

                    <h5 className="mb-3">Нэвтэрч орсон мэдээлэл</h5>
                    <div className="row rounded">
                        <div className="col-md-12">
                            <table className="table example" id="example">
                                <thead>
                                    <tr>
                                        <th scope="col">№</th>
                                        <th scope="col">Хаяг</th>
                                        <th scope="col">Metod</th>
                                        <th scope="col">IP Хаяг</th >
                                        <th scope="col">Хэрэглэгчийн дугаар</th >
                                        <th scope="col">Огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    {log_length === 0 ?
                                     <tr><td>Хандалт байхгүй байна </td></tr>:
                                    currentLogs.map((page, idx) =>
                                        <PageLogTable key = {idx} idx = {(currentPage*30)-30+idx+1} values={page}></PageLogTable>
                                    )}
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
            </div>
        )

    }

}
