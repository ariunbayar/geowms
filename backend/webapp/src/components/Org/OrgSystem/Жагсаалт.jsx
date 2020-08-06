import React, { Component } from "react"

import {service} from './service'
import GovorgForm from './GovorgForm'
import Govorg from './Govorg'
import {NavLink} from "react-router-dom"


export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.initial_form_values = {
        }

        this.state = {
            govorg_list: [],
            govorg_length:null,
            currentPage:1,
            govorgPerPage:20
        }

        this.handleListUpdated = this.handleListUpdated.bind(this)
        this.handleRemove = this.handleRemove.bind(this)
        this.nextPage=this.nextPage.bind(this)
        this.prevPage=this.prevPage.bind(this)
    }

    componentDidMount() {
        const org_level = this.props.match.params.level
        const id = this.props.match.params.id
        this.handleListUpdated(org_level)
    }

    handleListUpdated(org_level, org_id) {

        service.getAll().then(({govorg_list}) => {
            this.setState({govorg_list, govorg_length:govorg_list.length})
        })

    }
    handleRemove(id) {
        service.remove(id).then(({success}) => {
            if (success) this.handleListUpdated()
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
        if(this.state.currentPage<Math.ceil(this.state.govorg_length/this.state.govorgPerPage)){
            this.setState({
                currentPage:this.state.currentPage+1
            })
        }
    }
    render() {
        const org_level = this.props.match.params.level
        const org_id = this.props.match.params.id
        const {currentPage, govorgPerPage, govorg_list, govorg_length}=this.state
        const lastIndex=currentPage*govorgPerPage
        const firtsIndex=lastIndex-govorgPerPage 
        const totalPages=Math.ceil( govorg_length/govorgPerPage)
        const currentGovOrg= govorg_list.slice(firtsIndex,lastIndex)
        return (
            <div  className="container my-4">
                <div className="row">

                    <div className="col-md-12">

                        {!this.state.is_form_open &&
                            <>
                                <div className="text-left">
                                    <NavLink to={`/back/байгууллага/түвшин/${org_level}/`}>
                                        <p className="btn btn-outline-primary">
                                            <i className="fa fa-angle-double-left"></i> Буцах
                                        </p>
                                    </NavLink>
                                </div>

                                <div className="text-right">
                                    <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/${org_id}/систем/үүсгэх/`}>
                                        Нэмэх
                                    </NavLink>
                                </div>

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"> # </th>
                                            <th scope="col"> Системүүдийн нэр</th>
                                            <th scope="col"> Токен </th>
                                            <th scope="col"> Үүсгэсэн огноо </th>
                                            <th scope="col">Засах</th>
                                            <th scope="col">Устгах</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { govorg_length === 0 ?
                                             <tr><td>Систем бүртгэлгүй байна </td></tr>:                                         
                                             currentGovOrg.map((values,index) =>
                                                <Govorg
                                                    org_level={org_level}
                                                    org_id={org_id}
                                                    key={values.id}
                                                    idx={(currentPage*20)-20+index+1}
                                                    values={values}
                                                    handleRemove={() => this.handleRemove(values.id)}
                                                    handleEdit={() => this.handleEdit(values)}
                                                />
                                        )}
                                    </tbody>
                                </table>
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
                            </>
                        }

                    </div>
                </div>
            </div>
        )
    }
}
