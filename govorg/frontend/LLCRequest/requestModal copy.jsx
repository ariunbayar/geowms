import React, {Component, Fragment} from "react"
import {service} from './service'
import Modal from "@utils/Modal/Modal"
import Loader from "@utils/Loader/index"
import SelectField from '@utils/Tools/Form/select_field'


export default class RequestModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            status: "initial",

            action_type: '',
            modal_status: "closed",
            modal_icon: 'fa fa-check-circle',
            icon_color: 'success',
            title: '',
            text: '',
            model_type_icon: '',
            has_button: false,
            action_name: '',
            modalClose: null,

            values: props.values,

            table_name: '',
            themes: [],
            packages: [],
            features: [],
            feature_name: '',
            theme_name: '',
            package_name: '',
            selected_packages: [],
            selected_features: [],
            selected_dt_list: [],
            data_type_list: [],
            id_list: [],
            message: 'Property сонгоогүй байна.',
            is_loading: false,
            modal_status: 'closed',
        }
        this.handleOpen = this.handleOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleModalOpen = this.handleModalOpen.bind(this)
        this.handleModalAction = this.handleModalAction.bind(this)
        this.selectedFeature = this.selectedFeature.bind(this)
        this.handleRequestApprove = this.handleRequestApprove.bind(this)
        this.handleRequestReturn = this.handleRequestReturn.bind(this)
        this.modalChange = this.modalChange.bind(this)
        this.handleModalClose = this.handleModalClose.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleGetDetial = this.handleGetDetial.bind(this)
        // this.getInspireTree = this.getInspireTree.bind(this)
        this.getArray = this.getArray.bind(this)
        this.getFeatProperties = this.getFeatProperties.bind(this)
    }

    handleModalOpen(){
        this.setState({ modal_status: 'open' }, () => {
            this.setState({ modal_status: 'initial' })
        })
    }

    getRequestIds(selected_value, values) {
        let request_values
        let ids = []
        let feature_id

        if (selected_value){
            request_values = [selected_value]
        }
        else {
            request_values = values
        }
        request_values.map((value, idx) => {
            if (idx == 0) feature_id = value.feature_id
            ids.push(value.id);
        })
        return {ids, feature_id}
    }

    handleModalAction(){
        const { selected_value, values } = this.state

        const {ids, feature_id} = this.getRequestIds(selected_value, values)
        this.setState({ is_loading: true })

        if(this.state.action_type == 'reject')
        {
           this.handleRequestReject(ids, feature_id)
        }
        if(this.state.action_type == 'approve') {
            this.handleRequestApprove(ids, feature_id)
        }
        if(this.state.action_type == 'return') {
            this.handleRequestReturn(ids, feature_id)
        }
    }

    handleRequestReturn(ids, feature_id,) {
        service
            .requestReject(ids, feature_id)
            .then(({ success, info }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        info,
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                    this.setState({ is_loading: false })
                }
                else {
                    this.modalChange(
                        '',
                        'fa fa-times-circle',
                        'danger',
                        info,
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа. Обьект олдсонгүй',
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                }
            })
    }

    handleRequestReject(ids, feature_id,) {
        service
            .requestReject(ids, feature_id)
            .then(({ success, info }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        info,
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                    this.setState({ is_loading: false })
                }
                else {
                    this.modalChange(
                        '',
                        'fa fa-times-circle',
                        'danger',
                        info,
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа. Обьект олдсонгүй',
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                }
            })
    }

    handleRequestApprove(ids, feature_id){
        service
            .requestApprove(ids, feature_id)
            .then(({ success, info }) => {
                if(success) {
                    this.modalChange(
                        '',
                        'fa fa-check-circle',
                        'success',
                        info,
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                    this.setState({ is_loading: false })
                }
                else {
                    this.modalChange(
                        '',
                        'fa fa-times-circle',
                        'danger',
                        info,
                        '',
                        false,
                        "",
                        this.handleModalClose
                    )
                }
            })
            .catch((error) => {
                if(error == 'Bad Request') {
                    this.modalChange(
                        '',
                        'fa fa-exclamation-circle',
                        'warning',
                        'Алдаа гарлаа',
                        '',
                        false,
                        "",
                        this.handleModalClose
                        )
                    }
                })
    }

    componentDidMount() {
        if (this.state.status == "initial") this.handleOpen()
        const {id} = this.state
        // this.getInspireTree(id)
    }

    componentDidUpdate(pP, pS) {
        const { theme_name, feature_name, packages, features, table_name} = this.state
        if (pS.feature_name != feature_name) {
            if (feature_name) this.getFeatProperties(feature_name)
            else this.setState({feature_name})
            this.setState({ id_list: [] })
        }

        if (pS.packages != packages) {
            this.setState({packages})
        }

        if (pS.features != features) {
            this.setState({features})
        }
    }

    handleOpen() {
        this.setState({ status: "open" })
    }

    handleClose() {
        this.setState({status: "closed"})
        this.props.modalClose()
    }

    selectedFeature(e) {
        const feature = e.selected[0]
        if (feature) {
            const { values } = this.props
            const id = feature.getProperties()['id']
            values.map((value, idx) => {
                if (value.id == id) {
                    this.setState({ form_json: value.form_json, selected_value: value })
                }
            })
        }
    }

    modalChange(action_type, modal_icon, icon_color, title, text, has_button, action_name, modalClose) {
        this.setState({
            action_type,
            modal_icon,
            icon_color,
            title,
            text,
            has_button,
            action_name,
            modalClose
        })
        this.handleModalOpen()
    }

    handleModalClose() {
        this.setState({ is_loading: false })
        this.props.refreshData()
    }

    getFeatProperties(feature_code) {
        this.setState({ is_loading: true })
        service.pg_config.getProperties(feature_code).then(({data_type_list}) => {
            if (data_type_list && data_type_list.length > 0) {
                this.setState({ data_type_list, is_loading: false })
            }
        })
    }

    handleGetDetial( packages, features ){
        const {table_id, id} = this.state
        this.setState({ is_loading: true })
        service.pg_config.tableDetail(id, table_id).then(({success, form_datas}) => {
            if(success){
                form_datas['selected_packages'] = this.getArray(packages, form_datas.theme_name)
                form_datas['selected_features'] = this.getArray(features, form_datas.package_name)
                this.setState({ ...form_datas, is_loading: false })
            }
        })
    }

    // getInspireTree(id){
    //     const {table_id} = this.state
    //     service.pg_config.getInspireTree(id).then(({themes, packages, features}) => {
    //         this.setState({themes, packages, features})
    //         if(table_id) this.handleGetDetial(packages, features)
    //     })
    // }

    getArray(data, selected_value) {
        var array = [...data]
        var seleted_datas = array.filter((data) => data.parent == selected_value)
        return seleted_datas
    }

    handleChange(name, e) {
        const { packages, features } = this.state
        const selected_value = e.target.value
        var data_list = {}
        var seleted_datas = []
        var array = []

        if ( name == 'theme' ) {
            data_list['theme_name'] = selected_value
            seleted_datas = this.getArray(packages, selected_value)
            data_list['selected_packages'] = seleted_datas
            data_list['feature_name'] = ''
            data_list['id_list'] = []
        }

        else if ( name == 'package' ) {
            if (selected_value) {
                data_list['package_name'] = selected_value
                seleted_datas = this.getArray(features, selected_value)
                data_list['selected_features'] = seleted_datas
                data_list['feature_name'] = ''
                data_list['id_list'] = []

            }
            else {
                data_list['feature_name'] = ''
                data_list['id_list'] = []
            }
        }
        else {
            data_list['feature_name'] = selected_value
        }

        if (! selected_value) {
            data_list['selected_features'] = []
            data_list['feature_name'] = ''
        }

        this.setState({ ...data_list })
    }

    render () {

        const selected_form_json = this.state.form_json
        const { is_loading, status, selected_value, values, themes, packages, features, table_id, id,
            theme_name, package_name,
            feature_name, selected_features,
            selected_packages, data_type_list,
            id_list, table_name} = this.state
        const hide_btn = this.props.hide_btn
        const className =
            "modal fade" +
            (status == "initial" ? " d-block" : "") +
            (status == "open" ? " show d-block" : "") +
            (status == "closing" ? " d-block" : "") +
            (status == "closed" ? " d-none" : "")

        const classNameBackdrop =
            "modal-backdrop fade" +
            (status == "open" ? " show" : "") +
            (status == "closed" ? " d-none" : "")

        return (
            <Fragment>
                <div className={className + " ml-3 mr-3 mb-3 mt-3 pl-3 pr-3 pb-3 pt-3 rounded text-wrap"} style={{height:"calc( 103vh - 85px - 15px)"}}>
                    <div className="col-md-10 d-flex justify-content-center container">
                        <div className="modal-content animated row" >
                            <div className="col-md-12">
                                <div className="row mt-2" style={{background:"white"}}>
                                    <div className="col-md-11">
                                        <h5 className="text-center text-justify">Хүсэлт шийдвэрлэx</h5>
                                    </div>
                                    <div className="col-md-1" onClick={() => this.handleClose()}>
                                        <button type="button" className="close float-right" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                </div>
                                {/* <div className="col-md-12">
                                    <div className='form-row'>
                                        <div className='col-md-3 '>
                                        </div>
                                        <div className='form-group col-md-9'>
                                            <div className='row'>
                                                    <span
                                                        className="col-md-4 border rounded"
                                                        name='inspire_property'
                                                    >
                                                        Theme
                                                    </span>
                                                    <span
                                                        className="col-md-4 border rounded"
                                                        name='inspire_property'
                                                    >
                                                        Package
                                                    </span>
                                                    <span
                                                        className="col-md-4 border rounded"
                                                        name='inspire_property'
                                                    >
                                                        Feature
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr /> */}
                                <div className="form-row mr-3">
                                    <div className='form-group col-md-3 align-self-center text-center px-2 '>
                                        <b className="text-wrap">Point</b><br/>
                                    </div>
                                    <div className='form-group col-md-9'>
                                        <div className="row">
                                            <SelectField
                                                title_name='theme'
                                                data_list={themes}
                                                defualt_value={theme_name}
                                                setSelect={this.handleChange}
                                            />
                                            <SelectField
                                                title_name='package'
                                                data_list={selected_packages}
                                                defualt_value={package_name}
                                                setSelect={this.handleChange}
                                            />
                                            <SelectField
                                                title_name='feature'
                                                data_list={selected_features}
                                                defualt_value={feature_name}
                                                setSelect={this.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {
                                    hide_btn
                                    ?
                                        <div className="row my-2 mr-1 float-right"></div>
                                    :
                                        <div className="row my-2 mr-1 float-right">
                                            <button
                                                type="button mr-2 ml-2"
                                                onClick={() => this.modalChange(
                                                    'reject',
                                                    'fa fa-exclamation-circle',
                                                    'warning',
                                                    "Тохиргоог татгалзах",
                                                    `Та ${
                                                        values.length == 1
                                                            ?
                                                                get_modal_text(values[0].kind)
                                                            :
                                                        values.length > 1
                                                            ?
                                                                `${values.length} өгөгдлөө`
                                                            :
                                                            null
                                                    }
                                                    татгалзахдаа итгэлтэй байна уу?`,
                                                    true,
                                                    "татгалзах",
                                                    null
                                                )}
                                                className="btn gp-btn-primary waves-effect waves-light"
                                            >
                                                <i className="fa fa-check-square-o">Татгалзах</i>
                                            </button>
                                            <button
                                                type="button mr-2 ml-2"
                                                onClick={() => this.modalChange(
                                                    'reject',
                                                    'fa fa-exclamation-circle',
                                                    'warning',
                                                    "Тохиргоог буцаах",
                                                    `Та ${
                                                        values.length == 1
                                                            ?
                                                                get_modal_text(values[0].kind)
                                                            :
                                                        values.length > 1
                                                            ?
                                                                `${values.length} өгөгдлөө`
                                                            :
                                                            null
                                                    }
                                                    буцаахдаа итгэлтэй байна уу?`,
                                                    true,
                                                    "буцаах",
                                                    null
                                                )}
                                                className="btn gp-btn-primary waves-effect waves-light ml-2"
                                            >
                                                <i className="fa fa-check-square-o">Буцаах</i>
                                            </button>
                                            <button
                                                type="button mr-2 ml-2"
                                                onClick={() => this.modalChange(
                                                    'approve',
                                                    'fa fa-exclamation-circle',
                                                    'warning',
                                                    "Хүсэлт үүсгэх",
                                                    `Та ${
                                                        values.length == 1
                                                            ?
                                                                get_modal_text(values[0].kind)
                                                            :
                                                        values.length > 1
                                                            ?
                                                                `${values.length} өгөгдөлд`
                                                            :
                                                            null
                                                    }
                                                    хүсэлт үүсгэх итгэлтэй байна уу?`,
                                                    true,
                                                    "Хүсэлт үүсгэх",
                                                    null
                                                )}
                                                className="btn gp-btn-outline-primary waves-effect waves-light ml-2"
                                            >
                                                <i className="fa fa-check">Хүсэлт үүсгэх</i>
                                            </button>
                                        </div>
                                }
                             <Loader is_loading={is_loading} text={'Хүсэлтийг шалгаж байна түр хүлээнэ үү...'} />
                            </div>
                        </div>
                    </div>
                    <Modal
                        modal_status={this.state.modal_status}
                        modal_icon={this.state.modal_icon}
                        icon_color={this.state.icon_color}
                        title={this.state.title}
                        has_button={this.state.has_button}
                        text={this.state.text}
                        modalAction={this.handleModalAction}
                        actionNameDelete={this.state.action_name}
                        modalClose={this.state.modalClose}
                    />
                </div>
                <div className={classNameBackdrop}></div>
            </Fragment>
        )
    }
}
