import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"



export class Log extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div class="main-content">
                <div class="container page-container my-4">
                    <h5 class="mb-3">Гүйлгээний хуулга</h5>
                    <div id="example_wrapper" class="dataTables_wrapper dt-bootstrap4 no-footer">
                        <table id="example" class="table table-striped table-bordered dataTable no-footer" style="width:100%"
                            role="grid" aria-describedby="example_info">
                            <thead>
                                <tr role="row">
                                    <th class="sorting_asc" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-sort="ascending"
                                        aria-label="Гүйлгээний дугаар: цагаан толгойн эсрэг дарааллаар эрэмбэлэх"
                                        style="width: 101px;">Гүйлгээний дугаар</th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Дүн: цагаан толгойн дарааллаар эрэмбэлэх" style="width: 24px;">Дүн</th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Огноо: цагаан толгойн дарааллаар эрэмбэлэх" style="width: 72px;">Огноо</th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Статус: цагаан толгойн дарааллаар эрэмбэлэх" style="width: 43px;">Статус
                                    </th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Үр дүн: цагаан толгойн дарааллаар эрэмбэлэх" style="width: 82px;">Үр дүн
                                    </th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Зөвшөөрлийн дугаар: цагаан толгойн дарааллаар эрэмбэлэх"
                                        style="width: 114px;">Зөвшөөрлийн дугаар</th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Карт дугаар: цагаан толгойн дарааллаар эрэмбэлэх" style="width: 73px;">Карт
                                        дугаар</th>
                                    <th class="sorting" tabindex="0" aria-controls="example" rowspan="1" colspan="1"
                                        aria-label="Карт эзэмшигч: цагаан толгойн дарааллаар эрэмбэлэх" style="width: 82px;">
                                        Карт эзэмшигч</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr role="row" class="odd">
                                    <td class="sorting_1">4c26270ecdfc2</td>
                                    <td> 1.00</td>
                                    <td>20200530 11:22:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>712327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">4c26270ecdfc2</td>
                                    <td> 1.00</td>
                                    <td>20200530 11:22:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>712327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="odd">
                                    <td class="sorting_1">4c26270ecdfc2</td>
                                    <td> 1.00</td>
                                    <td>20200530 11:22:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>712327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">afbb7f3a2cc1e</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:20:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>715321</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="odd">
                                    <td class="sorting_1">afbb7f3a2cc1e</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:20:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>715321</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">afbb7f3a2cc1e</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:20:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>715321</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="odd">
                                    <td class="sorting_1">d6a32c6a01b6c</td>
                                    <td> 1.00</td>
                                    <td>20200530 12:32:00</td>
                                    <td>Амжилтгүй</td>
                                    <td>Authentication Failed</td>
                                    <td>706339</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">d6a32c6a01b6c</td>
                                    <td> 1.00</td>
                                    <td>20200530 12:32:00</td>
                                    <td>Амжилтгүй</td>
                                    <td>Authentication Failed</td>
                                    <td>706339</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="odd">
                                    <td class="sorting_1">d6a32c6a01b6c</td>
                                    <td> 1.00</td>
                                    <td>20200530 12:32:00</td>
                                    <td>Амжилтгүй</td>
                                    <td>Authentication Failed</td>
                                    <td>706339</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">e286447abaf3i</td>
                                    <td> 1.00</td>
                                    <td>20200530 10:12:00</td>
                                    <td>Амжилттай</td>
                                    <td>Approved</td>
                                    <td>615327</td>
                                    <td>9496 **** **** 2515</td>
                                    <td>amarsanaa</td>
                                </tr>
                                <tr role="row" class="even">
                                    <td class="sorting_1">e286447abaf3i</td>
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
