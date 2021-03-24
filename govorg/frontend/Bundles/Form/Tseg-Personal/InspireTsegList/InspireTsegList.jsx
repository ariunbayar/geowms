import React, { Component } from 'react';
import { service } from '../../service'

class InspireTsegList extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
        this.getInspireList = this.getInspireList.bind(this)
    }

    componentDidMount() {
        this.getInspireList()
    }

    getInspireList() {
        service
            .getInspireList()
            .then(rsp => {
                console.log(rsp);
            })
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    
                </div>
            </div>
        );
    }
}

export default InspireTsegList;