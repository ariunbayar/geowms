import React, { Component } from "react"
import {Charts} from './Chart'
import {RadarChart} from './Radar'
import {service} from "../service"
import {CrudEvenLogTable} from './CrudEvenLogTable'


export class CrudEvenLog extends Component {


    constructor(props) {
        super(props)
        this.state = {
            crud_event_display: [],
            crud_length:null,
            currentPage:1,
            crudPerPage:20,
            searchQuery: ''
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
    }
    
    componentDidMount(){
        const {currentPage}=this.state
        this.handleListCal(currentPage)

    }
    handleListCal(currentPage){
        const {crudPerPage}=this.state
        const lastIndex=currentPage*crudPerPage
        const firtsIndex=lastIndex-crudPerPage
        this.handleGetAll(lastIndex,firtsIndex)
    }


    handleGetAll(lastIndex,firtsIndex){
        service.CrudEventAll(lastIndex,firtsIndex).then(({ crud_event_display ,len}) => {
            if(crud_event_display){
                this.setState({crud_event_display, crud_length:len})
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
        if(this.state.currentPage<Math.ceil(this.state.crud_length/this.state.crudPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }

    handleSearch(field, e) {
        if(e.target.value.length > 0)
        {
            this.setState({ [field]: e.target.value})
            service.crudSearch(e.target.value).then(({ crud_event_display }) => {
                if(crud_event_display){
                    this.setState({crud_event_display, log_length:crud_event_display.length})
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
        const { crud_event_display, currentPage, crudPerPage, crud_length } = this.state
        const totalPages=Math.ceil( crud_length/crudPerPage)
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row rounded">
                        <div className="col-md-6">
                            <h5 className="mb-3">Хандалтын тоогоор</h5>
                            <Charts></Charts>
                        </div>
                        <div className="col-md-6">
                            <h5 className="mb-3">Үйлдлийн төрлөөр</h5>
                            <RadarChart></RadarChart>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <hr />
                        </div>
                    </div>

                    <h5 className="mb-3">Хийгдсэн үйлдлийн мэдээлэл</h5>
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
                                        <th scope="col">Үйлдэл</th>
                                        <th scope="col">Хийгдсэн хүснэгт</th >
                                        <th scope="col">Хэрэглэгчийн нэр</th >
                                        <th scope="col">Огноо</th >
                                    </tr>
                                </thead>
                                <tbody>
                                    { crud_length === 0 ?
                                    <tr><td>Гаралтын хандалт байхгүй байна </td></tr>:
                                    crud_event_display.map((logout, idx) =>
                                        <CrudEvenLogTable key = {idx} idx = {(currentPage*20)-20+idx+1} values={logout}></CrudEvenLogTable>
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