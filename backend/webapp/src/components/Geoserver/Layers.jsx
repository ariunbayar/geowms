import React, { Component } from "react"
import { service } from './service'


export class Layers extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount(){
        service.layers().then(({success, data}) => {
            if(success){
                this.setState({data: data['layers']['layer']})
            }
        })
    }

    render() {
        const {data} = this.state
        return (
            <div className="card">
                <div className="card-body table-responsive">
                    <h4 className="text-center">Geoserver layers</h4>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Нэр</th>
                                <th>Линк</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((layers, idx) =>
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{layers['name']}</td>
                                <td>{layers['href']}</td>
                            </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )

    }

}
