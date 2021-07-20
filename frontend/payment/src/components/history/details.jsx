import React, { Component } from "react"
import { NavLink } from "react-router-dom"

import Loader from '@utils/Loader'

import PointDetail from './components/PointDetail'
import PolygonDetail from './components/PolygonDetail'
import TransactionState from './components/TransactionState'
import QpayGen from './components/QpayGen'

import { service } from "../service"

export class Details extends Component {

    constructor(props) {
        super(props)

        this.state = {
            items: {},
            points: [],
            polygon: [],
            layers: [],
            is_loading: true,
            payment_id: this.props.match.params.id,
        }
        this.getDetails = this.getDetails.bind(this)
    }

    componentDidMount() {
        this.getDetails()
    }

    getDetails() {
        const id = this.state.payment_id
        service
            .getDetails(id)
            .then(({ success, items, points, polygon, layers, info }) => {
                if(success) {
                    items.map(( items ) =>
                        this.setState({items})
                    )
                    this.setState({ points, polygon, layers, is_loading: false })
                }
                else {
                    this.setState({ is_loading: false })
                    global.NOTIF('warning', info, 'exclamation')
                }
            })
            .catch(error => {
                global.NOTIF('danger', 'Алдаа гарсан байна', 'times')
            })
    }

    render() {
        const { items, points, polygon, layers, payment_id, is_loading } = this.state
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 py-0 my-3">
                        <NavLink to="/payment/history/" className="btn mt-2 gp-outline-primary">
                            Буцах
                        </NavLink>
                        <br></br>

                        <Loader is_loading={is_loading} />

                        <div id="container">
                            <h4 className="text-center">
                                {
                                    polygon && polygon.length > 0
                                    ?
                                        'Хэсэгчлэн худалдан авалт'
                                    :
                                        'Лавлах'
                                }
                            </h4>
                            <br></br>
                            {
                                points
                                ?
                                    <PointDetail
                                        items={items}
                                        points={points}
                                        payment_id={payment_id}
                                    />
                                :
                                    null
                            }
                            {
                                items !== {} && polygon && polygon.length > 0
                                ?
                                    <PolygonDetail
                                        items={items}
                                        layers={layers}
                                        payment_id={payment_id}
                                    />
                                :
                                    null
                            }
                        </div>
                        {
                            !is_loading && (polygon && polygon.length > 0 || points && points.length > 0) &&
                            <div className="row py-3">
                                <TransactionState
                                    items={items}
                                />
                                <QpayGen
                                    items={items}
                                    payment_id={payment_id}
                                    history={this.props.history.push}
                                    getDetails={this.getDetails}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
