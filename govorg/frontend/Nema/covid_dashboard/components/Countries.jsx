import React, { Component } from "react"
import './scroll.css'

export  class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            datas: this.props.datas,
            secondOrder: '-1',
            thirthOrder: '-1',
            fourthOrder: '-1',
            geo_id: this.props.geo_id || '496',
            prev_geo_id: props.geo_id || '496',
        }
        this.handleOrderChange = this.handleOrderChange.bind(this)
    }

    componentDidUpdate(pP, pS) {
        if(pP.datas !== this.props.datas) {
            this.setState({ datas: this.props.datas })
        }
    }

    handleOrderChange(chooseOrder, value) {
        console.log(chooseOrder, value);
        if (value == '-1') {
            if (chooseOrder == 'secondOrder') {
                value = '496'
            } else {
                value = this.state.prev_geo_id
            }
        }
        this.setState({ [chooseOrder]: value, geo_id: value, prev_geo_id: value },() =>
            this.props.getGeoID(this.state.geo_id)
        )
    }

    render() {
        const { datas, secondOrder, thirthOrder, fourthOrder } = this.state
        return (
            <div className='row justify-content-around'>
                <label className="col-sm-12 mb-1">Бүсийн задаргаа</label>
                <select className='form-control mb-1 col-sm-4 col-xl-12' value={secondOrder} onChange={(e) => this.handleOrderChange('secondOrder', e.target.value)}>
                    <option value='-1'>--- Улсын хэмжээнд ---</option>
                    {
                        datas.map((aimag, idx) =>
                            <option key={idx} value={aimag['geo_id']} >{aimag['name']}</option>
                        )
                    }
                </select>
                <select className='form-control mb-1 col-sm-4 col-xl-12' value={thirthOrder} onChange={(e) => this.handleOrderChange('thirthOrder', e.target.value)}>
                    <option value='-1'>--- Сум/Дүүрэг сонгоно уу ---</option>
                    {
                        datas.map((aimag) =>
                            aimag['geo_id'] === secondOrder &&
                                aimag['children'].map((sum, idx) =>
                                    <option key={idx} value={sum['geo_id']} >{sum['name']}</option>
                            )
                        )
                    }
                </select>
                <select className='form-control col-sm-4 mb-1 col-xl-12' value={fourthOrder} onChange={(e) => this.handleOrderChange('fourthOrder', e.target.value)}>
                    <option value='-1'>--- Баг/Хороо сонгоно уу ---</option>
                    {
                        datas.map((aimag) =>
                            aimag['geo_id'] === secondOrder &&
                                aimag['children'].map((sum) =>
                                    sum['geo_id'] === thirthOrder &&
                                        sum['children'].map((bag, idx) =>
                                            <option key={idx} value={bag['geo_id']} >{bag['name']}</option>
                                        )
                            )
                        )
                    }
                </select>
            </div>
        )
    }
}
