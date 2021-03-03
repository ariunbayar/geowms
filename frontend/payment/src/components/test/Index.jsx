import { controllers } from "chart.js"
import React, { Component } from "react"

export default class Bar extends Component {

    constructor(props) {
        super(props)
        this.too = 0
        this.state = {
            is_resize: false,
            inputs: [],
        }

        this.dragEnd = this.dragEnd.bind(this)
        this.addInputs = this.addInputs.bind(this)
        this.dragStart = this.dragStart.bind(this)
    }

    dragEnd(e) {
        console.log(e);
        console.log(e.movementX, 'movementX');
        console.log(e.movementY, 'movementY');
        console.log(e.clientX, 'clientX');
        console.log(e.clientY, 'clientY');
        console.log(e.pageX, 'pageX');
        console.log(e.pageY, 'pageY');
        e.target.style.left = 0 + 'px'
        e.target.style.top = 10 + 'px'
    }

    dragStart(e) {
        console.log(e)
    }

    calcPercent(max, per=5) {
        max = (max * per) / 100
        return max
    }

    getNumberFromPx(style) {
        if (style && style.includes('px')) {
            let splited = style.split("px")
            style = splited[0]
        }
        else {
            style = 0
        }

        return style
    }

    addInputs() {
        this.state.inputs.push(<input className="form-control" />)
        this.setState({ inputs: this.state.inputs })
    }

    render() {
        const { inputs } = this.state
        return (
            <div style={{height: '1000px'}}>
                <div className="row">
                    <div
                        className='
                            col-md-8
                            d-flex justify-content-center
                            border border-dark
                        '
                    >
                        <div
                            className="position-relative"
                        >
                            <img
                                src={'/media/gp_layer_building_view.jpeg'}
                                style={
                                    {
                                        border: '2px solid black'
                                    }
                                }
                            />
                            <div
                                draggable='true'
                                style={{
                                    height: '200px', width: '200px', backgroundColor: 'red'
                                }}
                                className="position-absolute"
                                onDragEnd={this.dragEnd}
                                onDragStart={this.dragStart}
                            >
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 border border-dark">
                        <div>
                            <label className="m-0"> Text: </label>
                            <button className="btn-block" onClick={this.addInputs}>
                                +
                            </button>
                            <table>
                                <tbody>
                                    {
                                        inputs.map((input, idx) =>
                                            <tr key={idx}>
                                                <th>{idx + 1}</th>
                                                <td>{input}</td>
                                                <td role='button' onClick={() => console.log('remove', idx)}>X</td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
