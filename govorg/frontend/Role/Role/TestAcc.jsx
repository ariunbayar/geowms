import React, { Component } from "react"

export class TestSwitches extends Component {
    constructor(props) {
        super(props)
        this.state = {
            radio_switch_name: 'switch-radio'

        }
        this.setStyle = this.setStyle.bind(this)
    }

    componentDidMount() {
        const {count, index} = this.props
        const radio_div = document.getElementById(index)
        this.setStyle(radio_div, count)
    }

    setStyle(element, count) {
        const { radio_switch_name } = this.state
        var max = 0
        const elem = document.querySelector(`.${radio_switch_name}`)
        let max_pos = getComputedStyle(elem).width
        var splited = max_pos.split('p')[0]
        const child = element.children[0]
        if(count == 25) {
            element.style.backgroundColor = 'blue'
            max = splited
        }
        if(count < 25) {
            element.style.backgroundColor = 'yellow'
            max = Math.ceil(splited / 2)
        }
        if(count == 0) {
            max = 0
        }
        let pos = 0
        const frame = setInterval(() => {
            if (pos == max) {
                clearInterval(frame);
            } else {
                pos++;
                child.style.left = pos + 'px';
            }
        }, 10)
    }

    render () {
        const { name, p_idx, index, count } = this.props
        const { radio_switch_name } = this.state

        return (
            <div className="col-2">
                <div className="form-group">
                    <label htmlFor={index}>{name}</label>
                    <div className={`${radio_switch_name} col-lg-12`}>
                        <span id={index} className={`slider-point slider-point-round`} >
                            <div className="slider-pointer slider-point-round"></div>
                        </span>
                    </div>
                    {/* <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id={index} />
                        <label className="custom-control-label" htmlFor={index}>  </label>
                    </div> */}
                </div>
            </div>
        )
    }
}


export class TestAcc extends Component {

    constructor(props) {
        super(props)
        this.state = {
            perms: [
                {'name': 'харах'},
                {'name': 'нэмэх'},
                {'name': 'хасах'},
                {'name': 'цуцлах'},
                {'name': 'хянах'},
                {'name': 'батлах'},
            ]
        }
    }

    render () {
        const { perms } = this.state
        const { name, index, type, id, count } = this.props
        return (
            <div className="card-header" id={`${name}-${type}`}>
                <div className="row">
                    <div className="col-4">
                        <h5 className="mb-0">
                            <button
                                className="btn btn-link"
                                data-toggle="collapse"
                                data-target={`#acc-${name}-${type}`}
                                aria-controls={`acc-${name}-${type}`}
                                onClick={() => this.props.sendId(id, type)}
                            >
                            {name}
                            </button>
                        </h5>
                    </div>
                    <div className="col-8">
                        <div className="row">
                            {perms.map((perm, p_idx) =>
                                <TestSwitches key={p_idx}
                                    name={perm.name}
                                    p_idx={p_idx}
                                    index={`${p_idx}-perm-${name}-${index}`}
                                    count={count}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}