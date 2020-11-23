import { textHeights } from "ol/render/canvas"
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
        const { count, index, now_length } = this.props
        const radio_div = document.getElementById(index)
        this.setStyle(radio_div, count, now_length)
    }

    setStyle(element, count, now_length) {
        const { radio_switch_name } = this.state
        var max = 0
        const elem = document.querySelector(`.${radio_switch_name}`)
        let max_pos = getComputedStyle(elem).width
        var splited = max_pos.split('p')[0]
        const child = element.children[0]
        if(count == now_length) {
            element.style.backgroundColor = '#006CB6'
            max = Math.ceil(splited / 2)
        }
        if(count > now_length) {
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
        const { name, p_idx, index, count, now_length } = this.props
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
                    <small>{now_length} of {count}</small>
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
                {'name': 'харах', 'eng_name': 'PERM_VIEW', 'value': false},
                {'name': 'нэмэх', 'eng_name': 'PERM_CREATE', 'value': false},
                {'name': 'хасах', 'eng_name': 'PERM_REMOVE', 'value': false},
                {'name': 'цуцлах', 'eng_name': 'PERM_REVOKE', 'value': false},
                {'name': 'хянах', 'eng_name': 'PERM_UPDATE', 'value': false},
                {'name': 'батлах', 'eng_name': 'PERM_APPROVE', 'value': false},
            ],
            r_name: '',
            now_length: null,
        }
    }

    render () {
        const { perms, r_name, now_length } = this.state
        const { name, index, type, id, count, small, is_open, t_name, p_name, f_name } = this.props
        return (
            <div className="card-header" id={`${index}-${type}`}>
                <div className="row">
                    <div className="col-4">
                        <h5 className="mb-0 mt-4">
                            <i className={`fa ` +
                                (is_open && (type == 'theme' && (t_name == r_name)) ||
                                (type == 'package' && (p_name == r_name)) ||
                                (type == 'feature' && (f_name == r_name))
                                    ? `fa-angle-down` : `fa-angle-right`) +
                                ' gp-text-primary'}
                            ></i>
                            &nbsp;
                            <span
                                role="button"
                                className={`gp-text-primary ` + (small ? small : `text-uppercase`) + ` font-weight-bold text-break shadow-none`}
                                data-toggle="collapse"
                                data-target={`#acc-${index}-${type}`}
                                aria-controls={`acc-${index}-${type}`}
                                aria-expanded="true"
                                onClick={() => {
                                    this.setState({ r_name: name })
                                    this.props.sendId(id, type, name)
                                }}
                            >
                            {name} - {count}
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
                                    now_length={now_length}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}