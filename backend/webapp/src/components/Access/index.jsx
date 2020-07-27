import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"



export class Access extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="main-content">
                <div className="container page-container my-4">
                    <h5 className="mb-3">Гүйлгээний хуулга</h5>
                    <div id="example_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
                        <table id="example" className="table table-striped table-bordered dataTable no-footer"                            role="grid" aria-describedby="example_info">
                            <thead>
                                <tr role="row">
                                    <th className="sorting_asc" 
                                        aria-sort="ascending"
                                        aria-label="Гүйлгээний дугаар: цагаан толгойн эсрэг дарааллаар эрэмбэлэх"
                                        >Гүйлгээний дугаар</th>
                                    <th className="sorting" 
                                        aria-label="Дүн: цагаан толгойн дарааллаар эрэмбэлэх" >Дүн</th>
                                    <th className="sorting" 
                                        aria-label="Огноо: цагаан толгойн дарааллаар эрэмбэлэх" >Огноо</th>
                                    <th className="sorting" 
                                        aria-label="Статус: цагаан толгойн дарааллаар эрэмбэлэх" >Статус
                                    </th>
                                    <th className="sorting" 
                                        aria-label="Үр дүн: цагаан толгойн дарааллаар эрэмбэлэх" >Үр дүн
                                    </th>
                                    <th className="sorting" 
                                        aria-label="Зөвшөөрлийн дугаар: цагаан толгойн дарааллаар эрэмбэлэх"
                                        >Зөвшөөрлийн дугаар</th>
                                    <th className="sorting" 
                                        aria-label="Карт дугаар: цагаан толгойн дарааллаар эрэмбэлэх" >Карт
                                        дугаар</th>
                                    <th className="sorting" 
                                        aria-label="Карт эзэмшигч: цагаан толгойн дарааллаар эрэмбэлэх" >
                                        Карт эзэмшигч</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">4c26270ecdfc2</td>
                                    <td> 1.00</td>
                                    <td>20200530 11:22:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>712327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">4c26270ecdfc2</td>
                                    <td> 1.00</td>
                                    <td>20200530 11:22:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>712327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">4c26270ecdfc2</td>
                                    <td> 1.00</td>
                                    <td>20200530 11:22:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>712327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">afbb7f3a2cc1e</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:20:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>715321</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">afbb7f3a2cc1e</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:20:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>715321</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">afbb7f3a2cc1e</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:20:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>715321</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">d6a32c6a01b6c</td>
                                    <td> 1.00</td>
                                    <td>20200530 12:32:00</td>
                                    <td>Амжилтгүй</td>
                                    <td>Authentication Failed</td>
                                    <td>706339</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">d6a32c6a01b6c</td>
                                    <td> 1.00</td>
                                    <td>20200530 12:32:00</td>
                                    <td>Амжилтгүй</td>
                                    <td>Authentication Failed</td>
                                    <td>706339</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="odd">
                                    <td className="sorting_1">d6a32c6a01b6c</td>
                                    <td> 1.00</td>
                                    <td>20200530 12:32:00</td>
                                    <td>Амжилтгүй</td>
                                    <td>Authentication Failed</td>
                                    <td>706339</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" className="even">
                                    <td className="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        )

    }

}
