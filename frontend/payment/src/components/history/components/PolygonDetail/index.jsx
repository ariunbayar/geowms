import React, { Component } from 'react';

class index extends Component {
    render() {

        const { items, layers, payment_id } = this.props

        return (
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th className="text-center" colSpan="2" style={{fontSize: '20px'}}>
                            <i className="fa fa-location-arrow mr-2" aria-hidden="true">
                            </i>Давхаргын мэдээлэл
                        </th>
                    </tr>
                    <tr>
                        <th>
                            <i className="fa fa-map mr-2" aria-hidden="true"></i>Давхаргын нэр
                        </th>
                        <th>
                            <i className="fa fa-money mr-2" aria-hidden="true"></i>Давхаргын үнэ
                        </th>
                    </tr>
                        {
                            layers.map((value, key) =>
                                <tr key={key}>
                                    <td>
                                        <label>{value.name}</label>
                                    </td>
                                    <td>
                                        <label>{value.amount}₮</label>
                                    </td>
                                </tr>
                            )
                        }
                    <tr>
                        <td><i className="fa fa-calendar-o mr-2" aria-hidden="true"></i>Огноо:</td>
                        <td>{items.created_at}</td>
                    </tr>
                    {
                        items.is_success && items.export_file !== null
                        ?
                            <tr>
                                <td><i className="fa fa-download mr-2" aria-hidden="true"></i>Татах:</td>
                                <td>
                                    <a className="text-info" href={`/payment/download-zip/${payment_id}/`}>
                                        Энд дарж татаж авна уу!
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