import React, { Component } from "react"
import { service } from '../../../../../../backend/webapp/src/components/InspireViews/service'

export  class Countries extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list_all:[],
            prev_event: null,
            prev_theme_event: null,
            prev_package_event: null,
            check_package_event: null,
            geom_type: '',
            datas: [
                {
                    'geo_id': 'au_62',
                    'name': 'Өвөрхангай',
                    'batlagdsan_tohioldol_too': 10,
                    'children': [
                        {
                            'geo_id': 'au_6255',
                            'name': 'Хужирт',
                            'batlagdsan_tohioldol_too': 5,
                            'children': [
                                {'geo_id': 'au_625551', 'batlagdsan_tohioldol_too': 2, 'name': '1-р баг'},
                                {'geo_id': 'au_625553', 'batlagdsan_tohioldol_too': 3, 'name': '2-р баг'}
                            ]
                        },
                        {
                            'geo_id': 'au_6234',
                            'name': 'Өлзийт',
                            'batlagdsan_tohioldol_too': 5,
                            'children': [
                                {'geo_id': 'au_623451', 'batlagdsan_tohioldol_too': 5, 'name': '1-р баг'},
                                {'geo_id': 'au_623453', 'batlagdsan_tohioldol_too': 0, 'name': '2-р баг'},
                                {'geo_id': 'au_623455', 'batlagdsan_tohioldol_too': 0, 'name': '3-р баг'},
                                {'geo_id': 'au_623457', 'batlagdsan_tohioldol_too': 0, 'name': '4-р баг'}
                            ]
                        }
                    ]
                },
                {
                    'geo_id': 'au_46',
                    'name': 'Өмнөговь',
                    'batlagdsan_tohioldol_too': 15,
                    'children': [
                        {
                            'geo_id': 'au_4607',
                            'name': 'Баян-Овоо',
                            'batlagdsan_tohioldol_too': 10,
                            'children': [
                                {'geo_id': 'au_460751', 'batlagdsan_tohioldol_too': 5, 'name': '1-р баг'},
                                {'geo_id': 'au_460753', 'batlagdsan_tohioldol_too': 5, 'name': '2-р баг'},
                                {'geo_id': 'au_460755', 'batlagdsan_tohioldol_too': 0, 'name': '3-р баг'}
                            ]
                        },
                        {
                        'geo_id': 'au_4604',
                            'name': 'Баяндалай',
                            'batlagdsan_tohioldol_too': 5,
                            'children': [
                                {'geo_id': 'au_460451', 'batlagdsan_tohioldol_too': 5, 'name': '1-р баг'},
                                {'geo_id': 'au_460453', 'batlagdsan_tohioldol_too': 0, 'name': '2-р баг'},
                                {'geo_id': 'au_460455', 'batlagdsan_tohioldol_too': 0, 'name': '3-р баг'}
                            ]
                        }
                    ],
                }
            ]
        }
        this.activeView = this.activeView.bind(this)
        this.getGeoId = this.getGeoId.bind(this)
    }

    getGeoId(){
        

        
    }

    activeView(event, name) {
        const check = this.state.datas
        if (name == 'theme') {
            check.map((feature, idx) =>
                console.log((feature.geo_id)))
        }
        else if (name == 'package') {
            check.map((features, idx) =>
                // console.log(features.children)
                features.children.map((lol, idx) =>
                console.log(lol)
                )
            )
        }
        this.setState({fields: [], id_list: [], view_name: ''})
        const id = event.id
        const prev_event = this.state.prev_event
        const prev_theme_event = this.state.prev_theme_event
        const prev_package_event = this.state.prev_package_event
        const check_package_event = this.state.check_package_event
        const id_array = id.split('-')
        const id_array_length = id_array.length
        event.className = "list-group-item collapsed active"
        if (id_array_length === 1){
            event.querySelector('i').className = "icon expand-icon fa fa-minus"
            if (prev_theme_event !== null){
                prev_event.className = "list-group-item collapsed"
                prev_theme_event.querySelector('i').className = "icon expand-icon fa fa-plus"
            }
            this.setState({prev_theme_event:  event})
        }
        if (id_array_length === 2){
            prev_theme_event.className = "list-group-item collapsed"
            if (prev_package_event !== null){
                if (prev_package_event.id.split('-')[0] === id.split('-')[0]){
                    if (prev_package_event.id === id){
                        if (event.querySelector('i').className === "icon expand-icon fa fa-minus ml-4"){
                            prev_event.className = "list-group-item collapsed"
                            event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                        }
                        else{
                            event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                        }
                    }
                    else{
                        event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                        prev_event.className = "list-group-item collapsed"
                        prev_package_event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                    }
                }
                else{
                    event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
                    if (check_package_event !== null){
                        prev_event.className = "list-group-item collapsed"
                        check_package_event.querySelector('i').className = "icon expand-icon fa fa-plus ml-4"
                    }
                    this.setState({check_package_event: prev_package_event})
                }
            }
            else{
                event.querySelector('i').className = "icon expand-icon fa fa-minus ml-4"
            }
            this.setState({prev_package_event:  event})
        }
        if (id_array_length === 3){
            prev_event.className = "list-group-item collapsed"
        }
        this.setState({prev_event: event})
    }

    render() {
        const { datas } = this.state
        return (
            <div className="row">
                <div className="col-md-12">
                    <div id='accordion1'>
                        {datas.map((theme, theme_idx) =>
                            <ul className="list-group" key={theme_idx}>
                                <li className="list-group-item collapsed"
                                    id={`${theme_idx}`}
                                    data-toggle="collapse"
                                    data-target={`#collapse-theme${theme_idx}`}
                                    aria-expanded="false"
                                    aria-controls={`collapse-theme${theme_idx}`}
                                    onClick={(e) => this.activeView(e.currentTarget, 'theme')}>
                                    <i className="icon expand-icon fa fa-plus" id={`${theme_idx}`}></i>
                                    &nbsp;&nbsp;{theme.name}
                                    <div className="col-auto float-right">{theme.batlagdsan_tohioldol_too}</div>
                                </li>
                                <div id={`collapse-theme${theme_idx}`} className="collapse" data-parent="#accordion1">
                                    <div id={`accordion10${theme_idx}`}>
                                        {theme.children.map((packages, pack_idx) =>
                                            <ul className="list-group" key={pack_idx}>
                                                <li className="list-group-item collapsed"
                                                    id={`${theme_idx}-${pack_idx}`}
                                                    data-toggle="collapse"
                                                     data-target={`#collapse-packages${theme_idx}${pack_idx}`}
                                                    aria-expanded="false"
                                                    aria-controls={`collapse-packages${theme_idx}${pack_idx}`}
                                                    onClick={(e) => this.activeView(e.currentTarget, 'package')}>
                                                    <i className="icon expand-icon fa fa-plus ml-4" id={`${theme_idx}-${pack_idx}`}></i>
                                                    &nbsp;&nbsp;{packages.name}
                                                    <div className="col-auto float-right">{packages.batlagdsan_tohioldol_too}</div>
                                                </li>
                                                <div id={`collapse-packages${theme_idx}${pack_idx}`} className="collapse" data-parent={`#accordion10${pack_idx}`}>
                                                    <div id={`accordion100${pack_idx}`}>
                                                        {packages.children.map((feature, idx) =>
                                                            <ul className="list-group" key={idx}>
                                                                <li className="list-group-item"
                                                                    id={`${theme_idx}-${pack_idx}-${idx}`}
                                                                    onClick={(e) => this.getGeoId()}
                                                                    >
                                                                    <i style={{paddingLeft: "40px"}}></i> &nbsp;
                                                                    <span className="p-0" id={`${theme_idx}-${pack_idx}-${idx}`}> {feature.name}</span>
                                                                    <div className="col-auto float-right">{feature.batlagdsan_tohioldol_too}</div>
                                                                    {feature.view &&
                                                                        <ul style={{paddingLeft: "90px"}} id={`${theme_idx}-${pack_idx}-${idx}`}>
                                                                            <li id={`features-${theme_idx}${pack_idx}${idx}`}>{feature.view['view_name']}</li>
                                                                        </ul>
                                                                    }
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </div>
                                                </div>
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        )
    }
}
