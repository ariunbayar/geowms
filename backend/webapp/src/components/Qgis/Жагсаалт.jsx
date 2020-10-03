import React, { Component } from "react"
import {service} from './service'
import { toSize } from "ol/size"

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.state = {
            items: '',
        }

        this.handleData = this.handleData.bind(this)
    }

    componentDidMount(){
        service.getAll().then(({items}) => {
            this.handleData(items)
        })
    }

    handleData(items){
        this.setState({items})
    }

    render() {
        if (!this.state.items)
            return ''

        const {items} = this.state
        return (
           <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="my-4">
                                <div className="p-3">
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">№</th>
                                                    <th scope="col">schemaname</th>
                                                    <th scope="col">tablename</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items === 0 ?
                                                    <tr><td>Хоосон байна </td></tr>:
                                                    items.map((values,index) =>
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{values.schemaname}</td>
                                                            <td>{values.tablename}</td>
                                                        </tr>
                                                    )
                                                }
                                            </tbody>
                                        </table>
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