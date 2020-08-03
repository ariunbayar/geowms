import React, { Component } from "react"
import {NavLink} from "react-router-dom"
import {service} from "./service"


export class OrgAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            org_name: '',
            edit:false
        }
        this.handleUserSearch = this.handleUserSearch.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleGetAll=this.handleGetAll.bind(this)
    }

    componentDidMount(){
        const org_level=this.props.match.params.level
        const id=this.props.match.params.id
        this.handleGetAll(org_level,id)
    }

    handleUserSearch(field, e){
        this.setState({[field]: e.target.value})
    }

    handleSave(){
        const org_level = this.props.match.params.level
        const org_id=this.props.match.params.id
        const org_name = this.state.org_name
        const values={"org_name":org_name,"id": org_id}
        service.org_add(org_level,values).then(({ success }) => {
            if (success) {
                this.props.history.push( `/back/байгууллага/түвшин/${org_level}/`)
            }
        })
    }

    handleGetAll(org_level,id){
        if(id){
            service.OrgAll(org_level,id).then(({ orgs }) => {
                if (orgs) {
                    orgs.map(org=>this.setState({
                        org_name:org.name
                    }))
                }
                this.setState({
                    edit:true
                })
            })
        }
    }

    render() {
        const {org_name,edit} = this.state
        const org_level=this.props.match.params.level
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="text-left">
                                <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/түвшин/${org_level}/`}>
                                    Буцах
                                </NavLink>
                            </div>
                            <br/>
                             {edit ? <h5 className="mb-3">Байгууллагын мэдээлэл засах</h5> : <h5 className="mb-3">Байгууллага нэмэх</h5> }
                            <div className="form-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="org_name"
                                    onChange={(e) => this.handleUserSearch('org_name', e)}
                                    value={org_name}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-2">
                            <div className="form-group">
                                <button className="btn btn-block gp-bg-primary" onClick={this.handleSave} >
                                    Хадгал
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
