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
            logPerPage:100,
            searchQuery: '',
            query_min: false

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
        const {logPerPage}=this.state
        const lastIndex=currentPage*logPerPage
        const firtsIndex=lastIndex-logPerPage
        this.handleGetAll(lastIndex,firtsIndex)
    }

    handleGetAll(lastIndex,firtsIndex){
        service.pageAll(lastIndex,firtsIndex).then(({ page_logs, len }) => {
            if(len){
                this.setState({page_logs, log_length:len})
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
        if(this.state.currentPage<Math.ceil(this.state.log_length/this.state.logPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }

    handleSearch(field, e) {
        if(e.target.value.length > 2)
        {
            this.setState({ [field]: e.target.value , query_min: true})
            service.pageSearch(e.target.value).then(({ page_logs }) => {
                if(page_logs){
                    this.setState({page_logs})
                }
            })
        }
        else
        {
            this.setState({ [field]: e.target.value })
            if(this.state.query_min){
                this.setState({ query_min:false })

                const {currentPage}=this.state
                this.handleListCal(currentPage)
        
            }
        }
    }


    render() {
        const {page_logs, log_length, currentPage,logPerPage}=this.state
        const totalPages=Math.ceil( log_length/logPerPage)
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
                    <div className="form-row text-right">
                        <div className="form-group col-md-8">
                            <label htmlFor="searchQuery">Хайх:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="searchQuery"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('searchQuery', e)}
                                value={this.state.searchQuery}
                            />
                        </div>
                    </div>
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
                                     page_logs.map((page, idx) =>
                                        <PageLogTable key = {idx} idx = {(currentPage*100)-100+idx+1} values={page}></PageLogTable>
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
