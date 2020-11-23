import React, { Component } from "react"

export class PermSwitches extends Component {
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
            element.style.backgroundColor = '#006CB6'
            max = Math.ceil(splited / 2)
        }
        if(count < 25) {
            element.style.backgroundColor = '#FFD24A'
            max = Math.floor(splited / 3)
        }
        if(count == 0) {
            element.style.backgroundColor = '#ccc'
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


export class PermAcc extends Component {

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
            ],
            r_name: '',
            is_p_open: false,
        }
    }

    render () {
        const { perms, r_name, is_p_open } = this.state
        const { name, index, type, id, count, small, is_open, clicked_name } = this.props
        console.log(name, 'irj bgaa ner ', clicked_name, is_open);
        return (
            <div className="card-header" id={`${name}-${type}`}>
                <div className="row">
                    <div className="col-4">
                        <h5 className="mb-0 my-4">
                            {
                                type == 'theme' &&
                                <i className={`fa ` + (is_open && r_name == clicked_name ? `fa-angle-down` : `fa-angle-right`) + ' gp-text-primary'}></i>
                            }
                            {
                                type == 'package' &&
                                <i className={`fa ` + (is_p_open && r_name == clicked_name ? `fa-angle-down` : `fa-angle-right`) + ' gp-text-primary'}></i>
                            }
                            &nbsp;
                            <span
                                role="button"
                                className={`gp-text-primary ` +
                                    (small ? small : `text-uppercase`) +
                                    ` font-weight-bold
                                    text-break
                                `}
                                data-toggle="collapse"
                                data-target={`#acc-${name}-${type}`}
                                aria-controls={`acc-${name}-${type}`}
                                onClick={() => {
                                    this.setState({ r_name: name })
                                    is_open && r_name !== clicked_name ?
                                    this.props.sendId(id, type, name)
                                    : r_name !== clicked_name ?
                                    this.props.sendId(id, type, name, 'zuruu')
                                    :
                                    this.props.sendId(id, type, name)
                                }}
                            >
                            {name}
                            </span>
                        </h5>
                    </div>
                    <div className="col-8">
                        <div className="row">
                            {perms.map((perm, p_idx) =>
                                <PermSwitches key={p_idx}
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