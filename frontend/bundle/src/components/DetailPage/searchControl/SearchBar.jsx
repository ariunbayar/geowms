import React, { Component } from "react"

import Modal from "@utils/Modal/Modal"
import * as utils from "@helpUtils/ol"

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
            modal_status: 'closed',
            aimag: [],
            selected_tab: '',
        }

        this.resetButton = this.resetButton.bind(this)
        this.getGeom = this.getGeom.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
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

        // try {
        const { success, data } = await service.getGeom(geo_id)
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
        return data
        // }
        // catch {
            // alert("Алдаа гарсан байна")
            // return
        // }
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

    handleModalOpen() {
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    modalChange(modal_icon, modal_bg, icon_color, title, text, has_button, actionNameBack, actionNameDelete, modalAction, modalClose) {
        this.setState(
            {
                modal_icon,
                modal_bg,
                icon_color,
                title,
                text,
                has_button,
                actionNameBack,
                actionNameDelete,
                modalAction,
                modalClose,
            },
            () => this.handleModalOpen()
        )
    }

    selectTab(selected_tab) {
        const old_selected_tab = this.state.selected_tab
        if (old_selected_tab == selected_tab) {
            selected_tab = ''
        }
        this.setState({ selected_tab })
    }

    render() {
        const { bundle_id, selected_tab } = this.state

        const search_tabs = [
            {
                'title': "Нэрэлбэрээр хайх",
                'component': (
                    <PropertySearch
                        getGeom={this.getGeom}
                        bundle_id={bundle_id}
                    />
                ),
            },
            {
                'title': "Аймгаар хайх",
                'component': (
                    <AdministrativeUnitSearch
                        setCenterOfMap={() => this.setCenterOfMap()}
                        resetButton={this.resetButton}
                        aimag={this.state.aimag}
                        map_wms_list={this.props.map_wms_list}
                        resetSearchLayerFeatures={this.resetSearchLayerFeatures}
                        getGeom={this.getGeom}
                        vector_layer={this.props.vector_layer}
                        funcs={this.props.funcs}
                    />
                )
            },
            {
                'title': "Цэгийн дугаараар хайх",
                'component': (
                    <PointIdSearch />
                ),
            },
            {
                'title': "Байрлалаар хайх",
                'component': (
                    <PlaceSearch
                        resetButton={this.resetButton}
                        setFeatureOnMap={this.props.setFeatureOnMap}
                    />
                ),
            },
            {
                'title': "Өргөрөг уртраг",
                'component': (
                    <CoordinateGradusSearch />
                ),
            },
        ]

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
                <Modal
                    modal_status={ this.state.modal_status }
                    modal_icon={ this.state.modal_icon }
                    modal_bg={ this.state.modal_bg }
                    icon_color={ this.state.icon_color }
                    title={ this.state.title }
                    text={ this.state.text }
                    has_button={ this.state.has_button }
                    actionNameBack={ this.state.actionNameBack }
                    actionNameDelete={ this.state.actionNameDelete }
                    modalAction={ this.state.modalAction }
                    modalClose={ this.state.modalClose }
                />
            </div>
        )
    }
}
