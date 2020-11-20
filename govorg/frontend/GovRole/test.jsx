import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
// import {service} from "./service"
import {TestAcc} from './TestAcc'
// import "./ins.css"

export default class ItsTest extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tid: 0,
            pid: 0,
            fid: 0,
            themes:
            [
                {
                    'themes': [
                        {
                            'id': '1',
                            'name': "utility",
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '2',
                            'name': "portal",
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '3',
                            'name': "worker",
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                    ]
                }
            ],
            packages: [
                {
                    'packages': [
                        {
                            'id': '1',
                            'name': "zahiral",
                            'parent_id': '1',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '2',
                            'name': "ahlah",
                            'parent_id': '2',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '4',
                            'name': "shinjeech",
                            'parent_id': '2',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '3',
                            'name': "coder",
                            'parent_id': '3',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                    ]
                }
            ],
            features: [
                {
                    'features': [
                        {
                            'id': '1',
                            'name': "tuvshuu",
                            'parent_id': '1',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '2',
                            'name': "Bymbaa",
                            'parent_id': '2',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                        {
                            'id': '3',
                            'name': "odko",
                            'parent_id': '3',
                            'child_ids': [
                                {'id': 1},
                                {'id': 2},
                                {'id': 3},
                                {'id': 4},
                            ],
                            'all_child': 25
                        },
                    ]
                }
            ],
            properties: {
                'properties': [
                    {
                        'id': '1',
                        'name': "pc",
                        'parent_ids': [
                            {'id': 1},
                            {'id': 2},
                            {'id': 3},
                            {'id': 4},
                        ],
                        'roles': [
                            {'harah': true},
                            {'nemeh': false},
                            {'hasah': true},
                            {'tsutslah': false},
                            {'hynah': true},
                            {'batlah': false},
                        ],
                        'all_child': 25
                    },
                    {
                        'id': '2',
                        'name': "chihewch",
                        'parent_ids': [
                            {'id': 1},
                            {'id': 2},
                            {'id': 3},
                            {'id': 4},
                        ],
                        'roles': [
                            {'harah': true},
                            {'nemeh': false},
                            {'hasah': true},
                            {'tsutslah': false},
                            {'hynah': true},
                            {'batlah': false},
                        ],
                        'all_child': 25
                    },
                    {
                        'id': '3',
                        'name': "keyboard",
                        'parent_ids': [
                            {'id': 1},
                            {'id': 2},
                            {'id': 3},
                            {'id': 4},
                        ],
                        'roles': [
                            {'harah': true},
                            {'nemeh': false},
                            {'hasah': true},
                            {'tsutslah': false},
                            {'hynah': true},
                            {'batlah': false},
                        ],
                        'all_child': 25
                    },
                ],
            },
            perms: [
                {'name': 'харах'},
                {'name': 'нэмэх'},
                {'name': 'хасах'},
                {'name': 'цуцлах'},
                {'name': 'хянах'},
                {'name': 'батлах'},
            ]
        }

        this.getId = this.getId.bind(this)
    }

    getId(id, type) {
       if(type == 'theme') this.setState({ tid: id })
       if(type == 'package') this.setState({ pid: id })
       if(type == 'feature') this.setState({ pid: id })
    }

    render() {
        const {themes, packages, features, fid, tid, pid, properties, perms } = this.state
        console.log(perms);
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div id="accordion">
                                    {themes[0].themes.map((theme, t_idx) =>
                                        <div className="card" key={t_idx}>
                                            <TestAcc
                                                id={theme.id}
                                                name={theme.name}
                                                index={t_idx}
                                                type="theme"
                                                sendId={this.getId}
                                            />
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body fixed-height-right">
                            <div className="table-responsive table_wrapper-100">
                                <table className="table table_wrapper_table_saaral table-bordered">
                                    <thead className="thead-light">
                                        <tr>
                                            <th className="col"></th>
                                            {perms.map((perm, perm_idx) =>
                                                <th className="col" className="vertical p-2" key={perm_idx}>
                                                    <span>{perm.name}</span>
                                                    <div className="custom-control custom-switch col-lg-12">
                                                        <input
                                                            type="checkbox" className="custom-control-input" id={perm.name}
                                                            // checked={true}
                                                        />
                                                        <label className="custom-control-label " htmlFor={perm.name}></label>
                                                    </div>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div id="accordion-2">
                                {packages[0].packages.map((pack, p_idx) =>
                                    pack.parent_id == tid &&
                                    <div className="card" key={p_idx}>
                                        <TestAcc key={p_idx}
                                            id={pack.id}
                                            name={pack.name}
                                            index={p_idx}
                                            type="package"
                                            sendId={this.getId}
                                        />
                                        <div id={`acc-${pack.name}`} className="collapse" aria-labelledby={pack.name + p_idx} data-parent="#accordion-2">
                                            <div className="card-body">
                                                {features[0].features.map((feature, f_idx) =>
                                                feature.parent_id == pid &&
                                                    <TestAcc key={f_idx}
                                                        id={feature.id}
                                                        name={feature.name}
                                                        index={f_idx}
                                                        type="feature"
                                                        sendId={this.getId}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}