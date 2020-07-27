import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"



export class Huulga extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                        <table id="example" className="table table-striped table-bordered dataTable no-footer" 
                        role="grid" aria-describedby="example_info">
                            <thead>
                                <tr role="row">
                                    <th className="sorting_asc" 
                                        aria-sort="ascending"
                                        aria-label="Гүйлгээний дугаар: цагаан толгойн эсрэг дарааллаар эрэмбэлэх"
                                        >Гүйлгээний дугаар</th>
                                    <th className="sorting" 
                                        aria-label="Дүн: цагаан толгойн дарааллаар эрэмбэлэх">Дүн</th>
                                    <th className="sorting" 
                                        aria-label="Огноо: цагаан толгойн дарааллаар эрэмбэлэх">Огноо</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">4c26270ecdfc2</td>
                                    <td>1.00</td>
                                    <td>2020-05-30 11:22:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">4c26270ecdfc2</td>
                                    <td>1.00</td>
                                    <td>2020-05-31 11:22:00</td>

                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">a286447abaf3i</td>
                                    <td>1.00</td>
                                    <td>2020-05-31 12:12:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">afbb7f3a2cc1e</td>
                                    <td>1.00</td>
                                    <td>2020-05-30 10:20:00</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">afbb7f3a2cc1e</td>
                                    <td>1.00</td>
                                    <td>2020-05-30 10:20:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">d6a32c6a01b6c</td>
                                    <td>1.00</td>
                                    <td>2020-05-30 10:12:00</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">d6a32c6a01b6c</td>
                                    <td>1.00</td>
                                    <td>2020-05-31 10:12:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td>1.00</td>
                                    <td>2020-05-30 10:12:00</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-05-30 11:41:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-05-31 11:41:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-05-31 11:41:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-07-03 11:41:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-07-02 11:41:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-07-01 11:41:00</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">fde812dbd88e</td>
                                    <td>1.00</td>
                                    <td>2020-07-01 11:41:00</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        )

    }

}
