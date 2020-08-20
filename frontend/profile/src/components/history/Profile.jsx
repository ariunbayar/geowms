import React, {Component} from "react";
import {BrowserRouter, Switch, Route, NavLink} from "react-router-dom";
import History from './historyForm'
export  class Profile extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
        
      <BrowserRouter>
            <div className="container my-4 shadow-lg p-3 mb-5  rounded">
                <div className="row container">
                    
                    <div className="col-md-12">
                        <ul className="list-group list-group-horizontal col-md-12">
                             <NavLink className=" col-md-3" to={`/profile/all/`}>ХУДАЛДАН АВАЛТ</NavLink>  
                        </ul>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Switch>
                        <Route path={"/profile/all/"}  component={History} />      
                        </Switch>
                    </div>
                </div>
            </div>

      </BrowserRouter>
    );
  }
}