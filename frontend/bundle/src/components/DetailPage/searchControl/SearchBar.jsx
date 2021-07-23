import React, { Component } from "react"

import * as utils from "@helpUtils/ol"
import * as fnUtils from "@helpUtils/functions"

import {
    AdministrativeUnitSearch,
    PropertySearch,
    PointIdSearch,
    PlaceSearch,
    CoordinateGradusSearch,
} from "./components"

import { service } from "../service"
import './style.css'


const MNZOOM = 5.041301562246971
const MNCENTER = [103.525827, 46.723984]

export class SearchBarComponent extends Component {

    constructor(props) {
        super(props)

        this.state = {
            bundle_id: props.bundle_id,
            aimag: [],
            selected_tab: '',
            is_point: props.is_point,
        }

        this.resetButton = this.resetButton.bind(this)
        this.getGeom = this.getGeom.bind(this)
        this.resetSearchLayerFeatures = this.resetSearchLayerFeatures.bind(this)
    }

    componentDidMount() {
        service.getAimags()
            .then(({ info, success }) => {
                if(success){
                    this.setState({ aimag: info })
                }
                else{
                    this.setState({ error_msg: info })
                }
                setTimeout(() => {
                    this.setState({ error_msg: '' })
                }, 2222);
            })
    }

    async getGeom(geo_id, refreshLayerFn) {

        service
            .getGeom(geo_id)
            .then(({ success, data }) => {
                if (data) {
                    this.props.setFeatureOnMap(data, refreshLayerFn)
                }
                else {
                    this.modalChange(
                        'fa fa-exclamation-circle',
                        '',
                        'warning',
                        'GEOM өгөгдөл байхгүй байна',
                        '',
                        false,
                        '',
                        '',
                        null,
                        null
                    )
                }
            })

    }

    setCenterOfMap() {
        utils.setCenter(MNCENTER, MNZOOM)
    }

    resetSearchLayerFeatures() {
        this.props.map_wms_list.map(({ layers, is_display }, idx) => {
            if (is_display) {
                layers.map(({ checked, tile, wms_tile, wms_or_cache_ur }, l_idx) => {
                    if (checked) {
                        wms_or_cache_ur ? tile.setVisible(checked) : wms_tile.setVisible(checked)
                    }
                })
            }
        })
    }

    resetButton() {
        this.setState({ bairlal_one_zoom: 7.3376399772248575, bairlal_scale: 5000000 })
        this.setCenterOfMap()
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        const modal = {
            modal_icon: modal_icon,
            modal_bg: modal_bg,
            icon_color: icon_color,
            title: title,
            text: text,
            has_button: has_button,
            actionNameBack: actionNameBack,
            actionNameDelete: actionNameDelete,
            modalAction: modalAction,
            modalClose: modalClose
        }
        global.MODAL(modal)
    }

    selectTab(selected_tab) {
        const old_selected_tab = this.state.selected_tab
        if (old_selected_tab == selected_tab) {
            selected_tab = ''
        }

        // хайсан зүйлсээ reset хийж байгаа хэсэг
        utils.clearFeatures(this.props.vector_layer)
        this.resetSearchLayerFeatures()
        this.resetButton()
        this.props.funcs.setVisibleMarker(false)
        this.props.funcs.closePopUp()

        this.setState({ selected_tab })
    }

    render() {
        const { bundle_id, selected_tab, is_point } = this.state

        const search_tabs = [
            {
                'title': "Нэрэлбэрээр хайх",
                'component': (
                    <PropertySearch
                        getGeom={this.getGeom}
                        bundle_id={bundle_id}
                    />
                ),
                'order': 0,
            },
            {
                'title': "Аймгаар хайх",
                'component': (
                    <AdministrativeUnitSearch
                        setCenterOfMap={() => this.setCenterOfMap()}
                        resetButton={this.resetButton}
                        aimag={this.state.aimag}
                        map_wms_list={this.props.map_wms_list}
                        getGeom={this.getGeom}
                        vector_layer={this.props.vector_layer}
                        funcs={this.props.funcs}
                        resetSearchLayerFeatures={this.resetSearchLayerFeatures}
                    />
                ),
                'order': 1,
            },
            {
                'title': "Байрлалаар хайх",
                'component': (
                    <PlaceSearch
                        resetButton={this.resetButton}
                        setFeatureOnMap={this.props.setFeatureOnMap}
                        vector_layer={this.props.vector_layer}
                        map_wms_list={this.props.map_wms_list}
                        setCenterOfMap={() => this.setCenterOfMap()}
                        funcs={this.props.funcs}
                        resetSearchLayerFeatures={this.resetSearchLayerFeatures}
                    />
                ),
                'order': 3,
            },
            {
                'title': "Өргөрөг уртраг",
                'component': (
                    <CoordinateGradusSearch
                        funcs={this.props.funcs}
                    />
                ),
                'order': 4,
            },
        ]

        if (is_point) {
            search_tabs.push(
                {
                    'title': "Цэгийн дугаараар хайх",
                    'component': (
                        <PointIdSearch />
                    ),
                    'order': 2,
                },
            )
        }

        fnUtils.sortArrayOfObj(search_tabs, 'order')

        return (
            <div className="mt-3">
                {
                    search_tabs.map((tab, idx) => {
                        const is_selected = tab.title == selected_tab
                        const title = tab.title
                        return (
                            <div key={idx} className={`mb-2 ${is_selected ? 'rounded shadow-sm px-3 py-2 mt-2 bg-white rounded' : ''}`}>
                                <div
                                    className={`d-flex`}
                                    role="button"
                                    onClick={() => this.selectTab(title)}
                                >
                                    <div className="">
                                        <i className={`fa fa-${is_selected ? "minus" : "plus"} gp-font-plus`}></i>
                                    </div>
                                    <div>
                                        <b>{title}</b>
                                    </div>
                                </div>
                                {
                                    is_selected
                                    &&
                                        <div className="mt-2">
                                            {tab.component}
                                        </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
