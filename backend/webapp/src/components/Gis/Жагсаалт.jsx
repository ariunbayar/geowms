import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import { service } from './service'

export class Жагсаалт extends Component {


    constructor(props) {

        super(props)

        this.state = {
            items: [],
            size_max: 1,
        }

        this.readableFileSize = this.readableFileSize.bind(this)
    }

    componentDidMount(){
        service.getAll().then(({ items }) => {
            const size_max = items.reduce((max, item) => Math.max(item.size, max), 0)
            this.setState({ items, size_max })
        })
    }

    readableFileSize(bytes) {
       if(bytes == 0) return '0 Bytes';
       var k = 1000,
           dm = 2,
           sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
           i = Math.floor(Math.log(bytes) / Math.log(k));
       return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    render() {
        if (!this.state.items)
            return ''

        const { items, size_max } = this.state

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
                                                    <th scope="col"></th>
                                                    <th scope="col">table/view</th>
                                                    <th scope="col">size</th>
                                                    <th scope="col">rows</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {items.map(({ schemaname, tablename, oid, kind, size, rows}, idx) =>
                                                    <tr key={ idx }>
                                                        <td>
                                                            <NavLink to={`/back/gis/detail/${schemaname}/${tablename}/`} className="badge badge-secondary m-1">
                                                                { 'OID:' + oid }
                                                            </NavLink>
                                                        </td>
                                                        <td>
                                                            { kind == 'table' && <i className="fa fa-table" title="Table"></i>}
                                                            { kind == 'view' && <i className="fa fa-eye" title="View"></i>}
                                                            {} { `${schemaname}.${tablename}` }
                                                        </td>
                                                        <td>
                                                            <progress max={ size_max } value={size}/>
                                                            {} { this.readableFileSize(size) }
                                                        </td>
                                                        <td>
                                                            { rows }
                                                        </td>
                                                    </tr>
                                                )}
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
