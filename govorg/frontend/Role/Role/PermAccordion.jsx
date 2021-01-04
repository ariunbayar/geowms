import { textHeights } from "ol/render/canvas"
import React, { Component } from "react"

export class PermSwitches extends Component {
    constructor(props) {
        super(props)
        this.state = {
            radio_switch_class_name: 'switch-radio'

        }
        this.setStyle = this.setStyle.bind(this)
    }

    componentDidMount() {
        const { total_length, index, now_length } = this.props
        const radio_div = document.getElementById(index)
        this.setStyle(radio_div, total_length, now_length)
    }

    setStyle(element, total_length, now_length) {
        const { radio_switch_class_name } = this.state
        var max = 0
        const width = document.getElementsByClassName(`${radio_switch_class_name}`)[0].offsetWidth
        if(total_length == now_length) {
            element.style.backgroundColor = '#006CB6'
            max = Math.ceil(width / 2)
        }
        if(total_length > now_length) {
            element.style.backgroundColor = '#FFD24A'
            max = Math.floor(width / 3)
        }
        if(total_length == 0) {
            element.style.backgroundColor = '#ccc'
            max = 0
        }
        let pos = 0
        const child_pointer = element.children[0]
        const frame = setInterval(() => {
            if (pos == max) {
                clearInterval(frame);
            } else {
                pos++;
                child_pointer.style.left = pos + 'px';
            }
        }, 10)
    }

    render () {
        const { name, p_idx, index, total_length, now_length } = this.props
        const { radio_switch_class_name } = this.state

        return (
            <div className="col-2 pr-0 pl-0">
                <div className="form-group text-center">
                    <label className="col-lg-12" htmlFor={index} style={{fontSize:"8px"}}>{name}</label>
                    <div className={`${radio_switch_class_name} col-lg-12`}>
                        <span id={index} className={`slider-point slider-point-round`} >
                            <div className="slider-pointer slider-point-round"></div>
                        </span>
                    </div>
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
                {'name': 'засах', 'eng_name': 'PERM_UPDATE', 'value': false},
                {'name': 'цуцлах', 'eng_name': 'PERM_REVOKE', 'value': false},
                {'name': 'батлах', 'eng_name': 'PERM_APPROVE', 'value': false},
            ],
            r_name: '',
        }
    }

    render () {
        const { perms, r_name } = this.state
        const { name, index, type, id, total_length, small, is_open, t_name, p_name, f_name, now_length } = this.props
        return (
            <div className={type == "theme" ? "card-header bg-light " : type == "feature" ? " " : "card-header"} id={`${index}-${type}`}>
                <div className="row">
                    <div className="col-3">
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
                                className={`gp-text-primary ` + (small ? small : `text-uppercase`) + ` font-weight-bold text-break shadow-none collapsed`}
                                data-toggle="collapse"
                                data-target={`#acc-${index}-${type}`}
                                aria-controls={`acc-${index}-${type}`}
                                aria-expanded="true"
                                onClick={() => {
                                    this.setState({ r_name: name })
                                    this.props.sendId(id, type, name)
                                }}
                            >
                            {name}
                            </span>
                        </h5>
                    </div>
                    <div className="col-9">
                        <div className="row">
                            {perms.map((perm, p_idx) =>
                                <PermSwitches key={p_idx}
                                    name={perm.name}
                                    p_idx={p_idx}
                                    index={`${p_idx}-perm-${name}-${index}`}
                                    total_length={total_length}
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
