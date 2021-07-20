import React, { Component } from "react"

export default class SelectOption extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data_list: [
                {
                    'id': 1,
                    'name': 'Дата хооронд',
                    'eng_name': 'between'
                },
                {
                    'id': 2,
                    'name': 'Эхлэх эхний утгаар',
                    'eng_name': 'since one of data'
                },
                {
                    'id': 3,
                    'name': 'Төгсөх сүүлийн утгаар',
                    'eng_name': 'until one of data'
                },
                {
                    'id': 1,
                    'name': 'Оруулах өгөгдлийн тоо хэмжээ',
                    'eng_name': 'limit'
                },
            ]
        }
    }

    render() {
        const { data_list } = this.state
        return (
            <div className="row">
                <label className="text-center col-md-12">шүүлтүүрийн төрлүүдийг сонгоно уу !!!</label>
                <div className='mx-4'>
                    <ul>
                        {
                            data_list.map((data, key) =>
                                <li key={key}>
                                    <input type="checkbox" id="scales" name="scales" />
                                    <label for="scales">{data.name} ({data.eng_name})</label>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        )
    }
}
