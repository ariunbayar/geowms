import React, { Component } from 'react'
import { service } from './service'

export default class EmailUpdate extends Component {
    constructor(props){
        super(props)
    }


    componentDidMount(){
        service
            .updateEmail()
            .then()
    }


    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className ="form-group">
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Password</label>
                        <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </div>
        )
    }
}
