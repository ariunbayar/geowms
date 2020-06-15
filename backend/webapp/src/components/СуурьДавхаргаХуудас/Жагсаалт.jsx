import React, { Component } from "react"
import {service} from './service'
import {Item} from './Item'
import {ItemCreate} from './ItemCreate'

import './style.css'


export class Жагсаалт extends Component {

    constructor(props) {

        super(props)

        this.state = {
            items: [],
        }

    }

    componentDidMount() {

        service.getAll().then(({items}) => {
            this.setState({items})
        })

    }

    groupArray(items, num_items) {
        return items.reduce((acc, item, idx) => {
            const n = ~~(idx / num_items)
            if (!acc[n])
                acc[n] = []
            acc[n].push(item)
            return acc
        }, [])
    }

    render() {

        const item_controls = this.state.items.map((item, idx) =>
            <Item
                className="col-sm-6"
                values={item}
                key={idx}
            />
        ).concat(
            <ItemCreate
                className="col-sm-6"
                key={this.state.items.length}
            />
        )

        const rows = this.groupArray(item_controls, 2)

        return (
            <div className="container my-4">
                {rows.map((items, idx) =>
                    <div className="row mb-4" key={idx}>
                        {items}
                    </div>
                )}
            </div>
        )
    }
}
