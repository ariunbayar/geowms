import React, { Component } from "react"
import {NavLink} from "react-router-dom"


export class OrgAdd extends Component {

    constructor(props) {
        super(props)

        this.state = {
            search_query: '',
            search_data: [{},{}],
            
        }
        this.handleUserSearch=this.handleUserSearch.bind(this)
        this.handleUserAdd=this.handleUserAdd.bind(this)

    }
    componentDidMount(){

    }
    handleUserSearch(field, e){
        this.setState({[field]: e.target.value})
    }

    handleUserAdd(id){

        alert(id)
    }

    render() {
        const {search_data, search_query} = this.state
        const org_level = this.props.match.params.level

        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    
                    <div className="text-left">
                        <NavLink className="btn gp-bg-primary" to={`/back/байгууллага/${org_level}/түвшин/`}>
                            Буцах
                        </NavLink>
                    </div>
                    <h5 className="mb-3">Хэрэглэгч хайх</h5>

                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            id="search_query"
                            onChange={(e) => this.handleUserSearch('search_query', e)}
                            value={search_query}
                        />
                    </div>
                    <div className="row">
                        <div className="list-group col-md-12" >
                        {search_data.map((users, idx) =>
                            <div className="list-group-item d-flex justify-content-between align-items-center">
                                <a >tuuguu</a>
                                <span onClick={() => this.handleUserAdd(2)}class="badge gp-bg-primary badge-pill" >Нэмэх</span>
                            </div>
                        )}

                        </div>
                    </div>
                </div>
            </div>
        )

    }

}
