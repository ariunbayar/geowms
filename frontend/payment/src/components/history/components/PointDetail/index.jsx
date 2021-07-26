import React, { Component } from 'react';

class index extends Component {
    render() {

        const { items, points, payment_id } = this.props

        return (
            <table className="table table-bordered">
                <tbody>
                    <tr className="text-center">
                        <th
                            colSpan={items.is_success ? "7" : "6"}
                            scope="rowgroup"
                        >
                            <h4>
                                <i className="fa fa-location-arrow mr-2" aria-hidden="true"></i>
                                Цэгийн мэдээлэл
                            </h4>
                        </th>
                    </tr>
                    <tr className="text-center">
                        <th style={{width: "5%"}}>
                            Д/д
                        </th>
                        <th>
                            Цэгийн нэр
                        </th>
                        <th style={{width: "20%"}}>
                            Аймаг
                        </th>
                        <th>
                            Сум
                        </th>
                        <th>
                            Өндөр
                        </th>
                        <th>
                            <i className="fa fa-money mr-2" aria-hidden="true"></i>
                            Төлбөр
                        </th>
                        {
                            items.is_success
                            ?
                                <th>
                                    Файл
                                </th>
                            : null
                        }
                    </tr>
                    {
                        points.length > 0
                        ?
                            points.map((value, key) =>
                                <tr className="text-center" key={key}>
                                    <th>
                                        {key + 1}
                                    </th>
                                    <td>
                                        {value['Pointid']}
                                    </td>
                                    <td scope="">
                                        {value['aimag']}
                                    </td>
                                    <td scope="">
                                        {value['sum']}
                                    </td>
                                    <td scope="">
                                        {value['ellipsoidheight'] || "Хоосон"}
                                    </td>
                                    <td>
                                        {value.amount}₮
                                    </td>
                                    {
                                        items.is_success
                                        ?
                                            <td scope="">
                                                {value['Pointname'] && items.export_file &&
                                                    <a className="text-info" href={`/payment/download-pdf/${payment_id}/${value['Pointname']}/`}>
                                                        файл
                                                    </a>
                                                }
                                            </td>
                                        :
                                        null
                                    }
                                </tr>
                            )
                        :
                            <tr className="text-center">
                                <th colSpan={items.is_success ? "7" : "6"}>
                                    Мэдээлэл байхгүй байна
                                </th>
                            </tr>
                    }
                    <tr className="text-center">
                        <th colSpan="2"><i className="fa fa-calendar-o mr-2" aria-hidden="true"></i>Үүссэн огноо:</th>
                        <td colSpan={items.is_success ? "5" : "4"}>{items.created_at}</td>
                    </tr>
                    {
                        items.is_success && items.export_file
                        ?
                            <tr className="text-center">
                                <th colSpan="2">
                                    Лавлагаа
                                </th>
                                <td colSpan={items.is_success ? "5" : "4"}>
                                    <a className="text-info" href={`/payment/download-zip/${payment_id}/`}>
                                        Лавлагааг татах
                                    </a>
                                </td>
                            </tr>
                        :
                        null
                    }
                </tbody>
            </table>
        );
    }
}

export default index;