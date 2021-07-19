import React, { Component, Fragment } from "react"
import { Formik, Form, Field} from 'formik'
import * as Yup from 'yup'
import FileUpload from '@utils/Tools/FileUpload'

import {service} from './service'


/* const validationSchema = Yup.object().shape({
})
 */

export default class ConfigSystem extends Component {

    constructor(props) {

        super(props)
        this.state = {
            is_editing: false,
            initial_values: {
            },
            values: {},
            files: [],
        }
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.getFile = this.getFile.bind(this)
    }

    componentDidMount() {
        service.config.qgis_plugin.get().then((values) => {
            this.setState({
                initial_values: values,
                values,
                files,
            })
        })
    }

    handleEdit(e) {
        e.preventDefault()

        const { is_editing } = this.state

        this.setState({
            is_editing: !is_editing,
        })
    }

    handleSubmit(values, { setStatus, setValues }) {

        setStatus('saving')

        service.config.qgis_plugin
            .save(values)
            .then(({ success }) => {

                if (success) {
                    setStatus('save_success')
                    this.setState({ values })
                } else {
                    return Promise.reject()
                }

            })
            .catch(() => {
                setValues(this.state.values)
                setStatus('save_error')
            })
            .finally(() => {
                this.setState({
                    is_editing: false,
                    hide_file: false })
            })

    }

    // setInfo(type) {
    //     if (type == 'qgis pulgin') {
    //         const text = '.qgis pulgin нэртэй файл оруулах'
    //         this.setState({ text, type })
    //     }
    // }
    getFile(e) {
        console.log("e", e.target.value)
    }

    render() {

        const {
            is_editing,
            initial_values,
            hide_file,
        } = this.props
        var { files } = this.state
        return (
            <div className="card">

                <div className="card-header">
                    QGIS Plugin
                    <div className="card-action">
                        <a href="#" onClick={ this.handleEdit }>
                            <i className="fa fa-edit"></i>
                        </a>
                    </div>
                </div>
                <div className="card-body">
                    <Formik
                        initialValues={ initial_values }
                        initialStatus={ 'initial' }
                        enableReinitialize
                        validationSchema={ validationSchema }
                        onSubmit={ this.handleSubmit }
                    >
                        {({
                            errors,
                            status,
                            touched,
                            isSubmitting,
                            setFieldValue,
                            setStatus,
                            setValues,
                            handleBlur,
                            values,
                            isValid,
                            dirty,
                        }) => {
                            return (
                                <Form>
                                        { is_editing &&
                                        <Fragment>
                                        <div className="form-group">
                                            <label htmlFor="">Qgis Plugin файл оруулах</label>
                                            <FileUpload
                                            files={files}
                                            className="mt-2 d-flex justify-content-between"
                                            default_text="Файл оруулна уу"
                                            getFile={this.getFile}
                                            info_text='Файл оруулсан байх ёстой'
                                            accept="zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed"
                                        />
                                        </div>
                                            <button
                                                type="submit"
                                                className="btn gp-btn-primary"
                                                disabled={ status == 'saving' }
                                            >
                                                {status == 'saving' &&
                                                    <Fragment>
                                                        <i className="fa fa-circle-o-notch fa-spin"></i> {}
                                                        Түр хүлээнэ үү...
                                                    </Fragment>
                                                }
                                                {status != 'saving' && 'Хадгалах' }
                                            </button>
                                        </Fragment>
                                        }
                                    { !is_editing && status == 'save_success' &&
                                        <div className="alert alert-icon-success alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-success">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Амжилттай хадгаллаа!</span>
                                            </div>
                                        </div>
                                    }
                                    { !is_editing && status == 'save_error' &&
                                        <div className="alert alert-icon-warning alert-dismissible" role="alert">
                                            <button type="button" className="close" onClick={ () => setStatus('initial') }>×</button>
                                            <div className="alert-icon icon-part-warning">
                                                <i className="icon-check"></i>
                                            </div>
                                            <div className="alert-message">
                                                <span>Хадгалахад алдаа гарлаа!</span>
                                            </div>
                                        </div>
                                    }
                                </Form>
                            )
                        }}
                    </Formik>
                </div>
            </div>
        )
    }
}
