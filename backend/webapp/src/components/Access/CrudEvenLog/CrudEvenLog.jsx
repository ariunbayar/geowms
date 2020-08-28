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
            searchQuery: '',
            searchIsLoad: false,
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
        this.handleSearchNextPage=this.handleSearchNextPage.bind(this)
    }

    componentDidMount(){
        const {currentPage}=this.state
        this.handleListCal(currentPage)

    }
    handleListCal(currentPage){

        const {searchIsLoad} = this.state
        const {crudPerPage}=this.state
        const lastIndex=currentPage*crudPerPage
        const firtsIndex=lastIndex-crudPerPage
        if(searchIsLoad){
        this.handleSearchNextPage(lastIndex,firtsIndex)

        }
        else{
        this.handleGetAll(lastIndex,firtsIndex)

        }
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

    handleSearchNextPage(lastIndex,firtsIndex) {
        const {searchQuery} = this.state

        service.crudSearch(searchQuery, lastIndex, firtsIndex).then(({ crud_event_display, len }) => {
            if(crud_event_display){
                this.setState({crud_event_display, crud_length:len})
            }
        })
    }

    handleSearch(field, e) {

        if(e.target.value.length > 1)
        {

            this.setState({ currentPage: 1, crudPerPage:20})
            const {currentPage, crudPerPage} = this.state
            this.setState({ [field]: e.target.value, searchIsLoad: true})
            service.crudSearch(e.target.value, crudPerPage, currentPage).then(({ crud_event_display, len }) => {
                if(crud_event_display){
                    this.setState({crud_event_display, crud_length:len})
                }
            })
        }

        else
        {
            this.setState({ [field]: e.target.value , searchIsLoad: false, currentPage: 1, crudPerPage:20})

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
                                className="btn gp-outline-primary"
                                onClick={this.prevPage}
                                >&laquo;өмнөх
                                </button> {}
                                <button
                                type="button"
                                className="btn gp-outline-primary "
                                onClick={this.nextPage
                                }>
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
