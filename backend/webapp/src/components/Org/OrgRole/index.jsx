import React, { Component } from "react"
import {service} from '../../BundlePage/service'
export class OrgRole extends Component {

  
    constructor(props) {

        super(props)

        this.state = {
            bundle_list:[],
            view:false,
            create:false,
            remove:false,
            revoke:false,
            review:false,
            approve:false,
            pass_view:false,    
            bundleId:null,
            list:[],
            changedName:''

        }
        this.handleListUpdated=this.handleListUpdated.bind(this)
        this.handleSaveChanges=this.handleSaveChanges.bind(this)
    }

    componentDidMount() {
        this.handleListUpdated()
    }
    handleListUpdated() {
        service.getAll().then(({bundle_list}) => {
            this.setState({bundle_list})
        })
       
      }

    handleOnChange(e,id){
        const listArray=this.state.list
        this.setState({
            [e.target.name]:e.target.checked,
            bundleId:id,
            changedName:e.target.name
        })
        console.log(id)
        if(this.state.veiw){
            this.setState({
             pass_view:false
            })
        }
        else{
            this.setState({
                pass_view:true
               })
        }

    }
handleSaveChanges(){
    console.log("blabla")
}

    render() {
        return (
            <div className="container my-4">
                <div className="row">
                    <div className="col-md-12">
                    <div className="container mb-3 mt-3">
                        <table className="table table-bordered">
                        <thead>
                            <tr>
                            <th scope="col"> Байгуулагын нэр</th>
                            <th scope="col">харах</th>
                            <th scope="col">нэмэх</th>
                            <th scope="col">хасах</th>
                            <th scope="col">цуцлах</th>
                            <th scope="col">хянах</th>
                            <th scope="col">батлах</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.bundle_list.map(bundles => 
                            <tr key={bundles.id}> 
                                <td>{bundles.name}</td>
                                <td> <input type="checkbox" name="veiw" checked={this.state.veiw} onChange={(e)=>this.handleOnChange(e,bundles.id)}/></td>
                                <td> <input type="checkbox" name="create" checked={this.state.create} onChange={(e)=>this.handleOnChange(e,bundles.id)}/></td>
                                <td> <input type="checkbox" name="remove" checked={this.state.remove} onChange={(e)=>this.handleOnChange(e,bundles.id)}/></td>
                                <td> <input type="checkbox" name="revoke" checked={this.state.revoke} onChange={(e)=>this.handleOnChange(e,bundles.id)}/></td>
                                <td> <input type="checkbox" name="review" checked={this.state.review} onChange={(e)=>this.handleOnChange(e,bundles.id)}/></td>
                                <td> <input type="checkbox" name="approve" checked={this.state.approve} onChange={(e)=>this.handleOnChange(e,bundles.id)}/></td>
                            </tr>
 
                        )}
                        </tbody>
                        </table>
                             <button className="btn gp-bg-primary" onClick={this.handleSaveChanges}>Хадгалах</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
