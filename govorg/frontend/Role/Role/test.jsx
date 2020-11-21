import React, { Component } from "react"
import {Switch, Route} from "react-router-dom"
// import {service} from "./service"
import {TestAcc} from './TestAcc'
import "./ins.css"

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
                            'all_child': 20
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
                            'all_child': 25,
                            'features': [
                                {
                                    'id': '1',
                                    'name': "Tuvshuu",
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
                                    'id': '3',
                                    'name': "Amaraa",
                                    'parent_id': '1',
                                    'child_ids': [
                                        {'id': 1},
                                        {'id': 2},
                                        {'id': 3},
                                        {'id': 4},
                                    ],
                                    'all_child': 25
                                },
                            ]
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
                            'all_child': 25,
                            'features': [
                                {
                                    'id': '1',
                                    'name': "Baigali",
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
                                    'id': '2',
                                    'name': "Tuugii",
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
                                    'name': "Ariunbayar",
                                    'parent_id': '2',
                                    'child_ids': [
                                        {'id': 1},
                                        {'id': 2},
                                        {'id': 3},
                                        {'id': 4},
                                    ],
                                    'all_child': 25
                                },
                            ]
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
                            'all_child': 25,
                            'features': [
                                {
                                    'id': '1',
                                    'name': "uugnaa",
                                    'parent_id': '4',
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
                                    'name': "taiwnaa",
                                    'parent_id': '4',
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
                                    'name': "nandia",
                                    'parent_id': '4',
                                    'child_ids': [
                                        {'id': 1},
                                        {'id': 2},
                                        {'id': 3},
                                        {'id': 4},
                                    ],
                                    'all_child': 25
                                },
                            ]
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
                            'all_child': 25,
                            'features': [
                                {
                                    'id': '1',
                                    'name': "tuvshuu",
                                    'parent_id': '3',
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
                                    'parent_id': '3',
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
                                    'all_child': 20
                                },
                            ]
                        },
                    ]
                }
            ],
            properties: {
                'properties': [
                    {
                        'id': '1',
                        'name': "pc",
                        'parent_id': '1',
                        'roles': [
                            {'perm_view': true},
                            {'perm_create': false},
                            {'perm_remove': true},
                            {'perm_revoke': false},
                            {'perm_update': true},
                            {'perm_approve': false},
                        ],
                        'all_child': 25
                    },
                    {
                        'id': '2',
                        'name': "chihewch",
                        'parent_id': '2',
                        'roles': [
                            {'perm_view': true},
                            {'perm_create': true},
                            {'perm_remove': false},
                            {'perm_revoke': true},
                            {'perm_update': true},
                            {'perm_approve': true},
                        ],
                        'all_child': 25
                    },
                    {
                        'id': '3',
                        'name': "keyboard",
                        'parent_id': '3',
                        'roles': [
                            {'perm_view': false},
                            {'perm_create': false},
                            {'perm_remove': false},
                            {'perm_revoke': false},
                            {'perm_update': true},
                            {'perm_approve': false},
                        ],
                        'all_child': 24
                    },
                ],
            },
            perms: [
                {'name': 'харах', 'eng_name': 'perm_view'},
                {'name': 'нэмэх', 'eng_name': 'perm_create'},
                {'name': 'хасах', 'eng_name': 'perm_remove'},
                {'name': 'цуцлах', 'eng_name': 'perm_revoke'},
                {'name': 'хянах', 'eng_name': 'perm_update'},
                {'name': 'батлах', 'eng_name': 'perm_approve'},
            ]
        }

        this.getId = this.getId.bind(this)
    }

    getId(id, type) {
       if(type == 'theme') this.setState({ tid: id })
       if(type == 'package') this.setState({ pid: id })
       if(type == 'feature') this.setState({ fid: id })
    }

    render() {
        const {themes, packages, features, fid, tid, pid, properties, perms } = this.state
        return (
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="accordion" id="accordion">
                                    {themes[0].themes.map((theme, t_idx) =>
                                        <div className="card" key={t_idx}>
                                            <TestAcc
                                                id={theme.id}
                                                name={theme.name}
                                                index={t_idx}
                                                type="theme"
                                                sendId={this.getId}
                                                count={theme.all_child}
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
                                                        />
                                                        <label className="custom-control-label " htmlFor={perm.name}></label>
                                                    </div>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {properties.properties.map((property, pro_idx) =>
                                            property.parent_id == fid &&
                                            <tr key={pro_idx}>
                                                <th>
                                                    {property.name}
                                                </th>
                                                {perms.map((perm, perm_idx) =>
                                                property.roles.map((role, r_idx) =>
                                                Object.keys(role).map((key, k_idx) =>
                                                    key == perm.eng_name &&
                                                    <TestChecks key={perm_idx}
                                                        id={property.id}
                                                        index={perm_idx}
                                                        value={role[key]}
                                                        name={property.name}
                                                        perm_name={perm.eng_name}
                                                    />
                                                )))}
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <div className="accordion" id="accordion-2">
                                {packages[0].packages.map((pack, p_idx) =>
                                    pack.parent_id == tid &&
                                    <div className="card" key={p_idx}>
                                        <TestAcc key={p_idx}
                                            id={pack.id}
                                            name={pack.name}
                                            index={p_idx}
                                            type="package"
                                            sendId={this.getId}
                                            count={pack.all_child}
                                        />
                                        <div id={`acc-${pack.name}-package`} className="collapse" aria-labelledby='accordion-2' data-parent="#accordion-2">
                                            <div className="card-body">
                                                <div className="accordion" id="accordion-3">
                                                    {pack.features.map((feature, f_idx) =>
                                                    feature.parent_id == pid &&
                                                        <TestAcc key={f_idx}
                                                            id={feature.id}
                                                            name={feature.name}
                                                            index={f_idx}
                                                            type="feature"
                                                            sendId={this.getId}
                                                            count={pack.all_child}
                                                        />
                                                    )}
                                                </div>
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

export class TestChecks extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: this.props.value
        }
        this.handleOnChange = this.handleOnChange.bind(this)
    }

    handleOnChange (checked) {
        // this.setState({ checked })
    }

    render () {
        const { name, index, id, perm_name } = this.props
        const { checked } = this.state
        return (
            <td className="icheck-primary">
                <input
                    type="checkbox"
                    id={`${name}-${index}`}
                    name={`${name}-${index}`}
                    checked={checked}
                    onChange={(e) => this.handleOnChange(e.target.checked)}
                />
                <label htmlFor={`${name}-${index}`}></label>
            </td>
        )
    }
}