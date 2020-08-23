import React, { Component, Fragment } from 'react'
import {Formik, Field, Form, ErrorMessage} from 'formik'
import {validationSchema} from './validationSchema'

import {service} from './service'
import {TextField} from '../../helpers/forms'

import 'ol/ol.css'

import {Map, View} from 'ol'
import Tile from 'ol/layer/Tile'
import TileImage from 'ol/source/TileImage'

import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';


export class Үүсгэх extends Component {

    constructor(props) {
        super(props)

        this.state = {
            snapshot_timeout: null,
            snapshot: null,
            values: {
                name: '',
                url: '',
                tilename: 'xyz',
            },
            wms_list: [],
        }
        this.map = null

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleURLChangeXYZ = this.handleURLChangeXYZ.bind(this)
        this.handleURLChangeWMS = this.handleURLChangeWMS.bind(this)
        this.handleTileChange = this.handleTileChange.bind(this)
        this.scheduleSnapshot = this.scheduleSnapshot.bind(this)
        this.takeSnapshot = this.takeSnapshot.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            this.initMap()
        }, 1000)

        service.getAll().then(({wms_list}) => {
            this.setState({wms_list})
        })
    }

    handleSubmit(values, { setStatus, setSubmitting }) {

        const data = {
            ...values,
            thumbnail: this.state.snapshot.match(/,(.*$)/)[1],
        }

        setStatus('checking')
        setSubmitting(true)

        service.create(data).then(({success}) => {
            setTimeout(() => {
                setStatus('saved')
                setSubmitting(false)
                this.props.history.push( '/back/суурь-давхарга/')
            }, 800)
        })
    }

    initMap() {

        this.tileImage = new TileImage({
            crossOrigin: 'Anonymous',
            url: 'http://mt1.google.com/vt/lyrs=s&hl=pl&x={x}&y={y}&z={z}',
        })

        this.tileWMS = new TileWMS({
            crossOrigin: 'Anonymous',
            url: '',
            params: {'FORMAT': 'image/png'},
        })

        this.tile = new Tile({
            source: this.tileImage,
        })

        this.map = new Map({
            target: 'map',
            layers: [this.tile],
            view: new View({
                projection: 'EPSG:3857',
                center: [11461613.630815497, 5878656.0228370065],
                zoom: 5.041301562246971,
            })
        })

        this.map.on('rendercomplete', this.scheduleSnapshot)

    }

    takeSnapshot() {

        // Destination size should match with base layer styling
        const dst_size = {width: 128 * 2, height: 72 * 2}

        const canvas_tmp = document.createElement('canvas')
        canvas_tmp.width = dst_size.width
        canvas_tmp.height = dst_size.height

        const ctx = canvas_tmp.getContext('2d')

        const canvas = document.querySelector('.ol-layer canvas')
        ctx.drawImage(
            canvas,
            0, 0, dst_size.width, dst_size.height,
            0, 0, dst_size.width, dst_size.height,
        )

        this.setState({
            snapshot: canvas_tmp.toDataURL(),
        })
    }

    scheduleSnapshot() {
        let {snapshot_timeout} = this.state
        if (snapshot_timeout) {
            clearTimeout(snapshot_timeout)
        }
        snapshot_timeout = setTimeout(this.takeSnapshot, 400)

        this.setState({snapshot_timeout})
    }

    handleURLChangeWMS(event, setFieldValue) {
        const wms = this.state.wms_list[event.target.value]
        if (wms) {
            this.tileWMS.updateParams({'LAYERS': wms.layers.join()})
            this.tileWMS.setUrl(wms.url)
            setFieldValue('url', wms.url)
            setFieldValue('wms', event.target.value)
        }
    }

    handleURLChangeXYZ(event) {
        const snapshot_url = event.target.value
        this.tileImage.setUrl(snapshot_url)
    }

    handleTileChange(event, tilename, setFieldValue) {
        setFieldValue('tilename', tilename)

        if (tilename == 'xyz') {
            this.tile.setSource(this.tileImage)
        }
        if (tilename == 'wms') {
            this.tile.setSource(this.tileWMS)
        }
    }

    render() {
        return (

            <div className="container my-4 shadow-lg p-3 mb-5 bg-white rounded">
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <a href="#" className="btn gp-outline-primary" onClick={this.props.history.goBack}>
                            <i className="fa fa-angle-double-left"></i> Буцах
                        </a>
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-4">
                        <Formik
                            enableReinitialize
                            initialValues={this.state.values}
                            validationSchema={validationSchema}
                            onSubmit={this.handleSubmit}
                        >
                            {({
                                errors,
                                status,
                                touched,
                                isSubmitting,
                                setFieldValue,
                                handleBlur,
                                values,
                                isValid,
                                dirty,
                            }) => {
                                const has_error = Object.keys(errors).length > 0
                                return (
                                    <Form>

                                        <TextField
                                            label="Нэр:"
                                            name="name"
                                            error={errors.name}
                                            placeholder="Нэр"
                                        />

                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input className="form-check-input" type="radio" name="tilename"
                                                    checked={values.tilename === 'xyz'}
                                                    onBlur={handleBlur}
                                                    onChange={e => this.handleTileChange(e, 'xyz', setFieldValue)}
                                                />
                                                XYZ tile image:
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <label className="form-check-label">
                                                <input className="form-check-input" type="radio" name="tilename"
                                                    checked={values.tilename === 'wms'}
                                                    onBlur={handleBlur}
                                                    onChange={e => this.handleTileChange(e, 'wms', setFieldValue)}
                                                />
                                                WMS tile service:
                                            </label>
                                        </div>

                                        {values.tilename == 'xyz' &&
                                            <TextField
                                                name="url"
                                                error={errors.url}
                                                placeholder="tile image URL"
                                                handleChange={this.handleURLChangeXYZ}
                                            />
                                        }

                                        {values.tilename == 'wms' &&
                                            <Fragment>
                                                <Field name="wms" as="select" className="form-control"
                                                    onChange={(e) => this.handleURLChangeWMS(e, setFieldValue)}
                                                >
                                                    <option value="" key={this.state.wms_list.length}>---------</option>
                                                    {this.state.wms_list.map((wms, index) =>
                                                        <option key={index} value={index}> {wms.name} ({wms.url}) </option>
                                                    )}
                                                </Field>
                                                <ErrorMessage name="url" component="div" className="invalid-feedback"/>
                                            </Fragment>
                                        }

                                        <div className="form-group">
                                            <label htmlFor="id_thumbnail"> Харагдах байдал </label>
                                            <Field name={name} id="id_thumbnail" type="hidden" />
                                            <div>
                                                {!this.state.snapshot &&
                                                    <div className="base-layer-preview-empty">
                                                        <i className="fa fa-picture-o fa-lg"></i>
                                                    </div>
                                                }
                                                {this.state.snapshot &&
                                                    <img className="base-layer-preview" src={this.state.snapshot}/>
                                                }
                                            </div>
                                        </div>


                                        <div></div>
                                        <div className="span3">
                                            {has_error
                                                ?
                                                    <p> </p>
                                                : status == 'saved' && !dirty &&
                                                    <p>
                                                        Амжилттай нэмэгдлээ
                                                    </p>
                                            }
                                            <div>
                                                <button type="submit" className="btn gp-btn-primary" disabled={isSubmitting || has_error}>
                                                    {isSubmitting && <i className="fa fa-spinner fa-spin"></i>}
                                                    {isSubmitting && <a className="text-light">Шалгаж байна.</a>}
                                                    {!isSubmitting && 'Нэмэх' }
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                    <div className="col-md-8">
                        <div id="map"></div>
                    </div>
                </div>
            </div>
        )
    }

}
