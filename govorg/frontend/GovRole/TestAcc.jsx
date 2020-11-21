import React, { Component } from "react"

export class TestSwitches extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render () {
        const { name, p_idx, index } = this.props
        return (
            <div className="col-2">
                <div className="form-group">
                    <label>{name}</label>
                    <div className="custom-control custom-switch">
                        <input type="checkbox" className="custom-control-input" id={index} />
                        <label className="custom-control-label" htmlFor={index}>  </label>
                    </div>
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
        const { name, index, type, id } = this.props
        return (
            <div className="card-header" id={`${name}-${index}`}>
                <div className="row">
                    <div className="col-4">
                        <h5 className="mb-0">
                            <button
                                className="btn btn-link"
                                data-toggle="collapse"
                                data-target={`#acc-${name}`}
                                aria-controls={`acc-${name}`}
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
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}