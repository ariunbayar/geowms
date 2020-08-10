import React, { Component } from "react"
import {OrgFormTable} from './OrgFormTable'
import {NavLink} from "react-router-dom"
import {service} from "./service"

export class OrgForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            orgs: [],
            org_length:null,
            currentPage:1,
            orgPerPage:20,
            searchQuery: '',
            query_min: false,
            search_load: false,
        }
        this.handleGetAll=this.handleGetAll.bind(this)
        this.handleUserDelete=this.handleUserDelete.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
        this.handleListCal=this.handleListCal.bind(this)
        this.handleSearch=this.handleSearch.bind(this)
    }

    componentDidMount(){  
        const {currentPage}=this.state
        this.handleListCal(currentPage)
    }

    handleListCal(currentPage){
        const org_level=this.props.match.params.level
        const {orgPerPage}=this.state
        const lastIndex=currentPage*orgPerPage
        const firtsIndex=lastIndex-orgPerPage
        const value={ "firstIndex":firtsIndex, "lastIndex": lastIndex}
        this.handleGetAll(org_level,value)
    }

    handleGetAll(org_level,value){
        service.getAll(org_level,value).then(({ orgs,len }) => {
            if (orgs) {
                this.setState({ orgs , org_length:len})
    
            }
        })
    }
    componentDidUpdate(prevProps) {
        if (this.props.match.params.level !== prevProps.match.params.level) {
            const org_level = this.props.match.params.level
            const currentPage=this.state
            this.handleListCal(currentPage)

        }
    }
    handleUserDelete(id){
        const org_level = this.props.match.params.level
        service.org_remove(org_level,id).then(({ success }) => {
            if (success) {
                const currentPage=this.state.currentPage
                this.handleListCal(currentPage)
                
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
        if(this.state.currentPage<Math.ceil(this.state.org_length/this.state.orgPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
            this.handleListCal(this.state.currentPage+1)
        }
    }

    handleSearch(field, e) {
        const level=this.props.match.params.level
        if(e.target.value.length > 0)
        {   
            this.setState({ [field]: e.target.value, search_load:true})
            service.orgSearch(level,e.target.value).then(({ orgs }) => {
                if(orgs){
                    this.setState({orgs, org_length:orgs.length, search_load:false})
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
        const {orgs,orgPerPage,currentPage,org_length} = this.state
        const org_level = this.props.match.params.level
        const totalPages=Math.ceil( org_length/orgPerPage)
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="text-right">
                        <NavLink className="btn gp-bg-primary  float-right" to={`/back/байгууллага/түвшин/${org_level}/нэмэх/`}>
                            Нэмэх
                        </NavLink>
                        <input
                                type="text"
                                className="form-control col-md-4  mb-1 float-left"
                                id="searchQuery"
                                placeholder="Хайх"
                                onChange={(e) => this.handleSearch('searchQuery', e)}
                                value={this.state.searchQuery}
                            />

                    </div>
                    <div className="mb-3 mt-3">

                        <table className="table example" id="example">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Байгууллага нэр</th>
                                    <th scope="col">Түвшин</th>
                                    <th scope="col"></th >
                                    <th scope="col"></th >
                                </tr>
                            </thead>
                            <tbody>

                                { org_length ===0 ?
                                    <tr><td>Байгууллага бүртгэлгүй байна</td></tr>:

                                    orgs.map((org, idx) =>
                                        <OrgFormTable
                                            key={idx}
                                            idx={(currentPage*20)-20+idx+1}
                                            org_level={org_level}
                                            org={org}
                                            handleUserDelete={() => this.handleUserDelete(org.id)}
                                            
                                        >
                                        </OrgFormTable>

                                )}
                            </tbody>
                        </table>
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
