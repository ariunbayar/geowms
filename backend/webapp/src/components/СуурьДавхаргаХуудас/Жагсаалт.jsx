import React, { Component } from "react"
import {service} from './service'
import {Item} from './Item'
import {ItemCreate} from './ItemCreate'
import Loader from "@utils/Loader"
import './style.css'


export class Жагсаалт extends Component {

    constructor(props) {

        super(props)

        this.state = {
            items: [],
            wms_list: [],
            is_loading: false,
            firt_item: {},
            firt_item_idx: null,
        }
        this.handleSwap = this.handleSwap.bind(this)
        this.onDrag = this.onDrag.bind(this)
        this.onDrop = this.onDrop.bind(this)
        this.onDragOver = this.onDragOver.bind(this)
    }

    componentDidMount() {
        this.setState({is_loading: true})
        service.getAll().then(({items, wms_list}) => {
            this.setState({items, wms_list, is_loading: false})
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

    handleSwap(swap_one, swap_two) {
        service.swap(swap_one, swap_two)
    }

    onDrag(event, item, idx){
        event.preventDefault();
        this.setState({
            firt_item: item,
            firt_item_idx: idx
        });
    }

    onDragOver(event, todo, idx){
        event.preventDefault();
    }

    onDrop(event, item, idx){
        event.preventDefault();
        const {items, firt_item, firt_item_idx} = this.state
        let array = items
        array[idx] = firt_item
        array[firt_item_idx] = item
        this.handleSwap(firt_item.id, item.id)
        this.setState({items: array})

    }

    render() {
        const {is_loading} = this.state
        const item_controls = this.state.items.map((item, idx) =>
            <Item
                className="col-sm-6"
                values={item}
                key={idx}
                index={idx}
                onDrag={this.onDrag}
                onDragOver={this.onDragOver}
                onDrop={this.onDrop}
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
                <Loader is_loading={is_loading}/>
                {rows.map((items, idx) =>
                    <div className="row mb-4" key={idx}>
                        {items}
                    </div>
                )}
            </div>
        )
    }
}
