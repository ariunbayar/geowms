import React, { Component, Fragment } from "react"

import Modal from "../../../Modal"
import ModalAlert from "../../../ModalAlert"
import { service } from "../../service"
import { ButtonTokenRefresh } from "./ButtonTokenRefresh"
import { ButtonEdit } from "./ButtonEdit"
import { ButtonDelete } from "./ButtonDelete"
import { ButtonBack } from "./ButtonBack"
import AddressMap from "./Map"

export class Detail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            employee: {
                id: '',
                username: '',
                first_name: '',
                last_name: '',
                email: '',
                gender: '',
                register: '',
                position: '',
                is_admin: false,
                is_super: false,
            },
            points: [],
            point: [],
            is_loading: true,
            is_empty: false,
            status_token_refresh: 'initial',
            status_delete: 'initial',
        }

        this.fetchDetail = this.fetchDetail.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this)
        this.getAddresses = this.getAddresses.bind(this)
        this.setLoading = this.setLoading.bind(this)
        this.getFeature = this.getFeature.bind(this)
    }

    componentDidMount(){
        const pk = this.props.match.params.emp
        Promise.all([
            this.getAddresses(pk),
            this.fetchDetail(pk),
        ])
    }

    fetchDetail(pk) {

        service
            .employeeDetail(pk)
            .then(({ success, employee }) => {
                if (success) {
                    this.setState({ employee })
                } else {
                    // TODO
                }
            })
    }

    handleTokenRefresh() {
        const { emp } = this.props.match.params
        this.setState({ status_token_refresh: 'loading' })
        service.empTokenRefresh(emp).then(({ success }) => {
            if (success)
                this.fetchDetail(emp)
            this.setState({ status_token_refresh: success ? 'success' : 'fail' })
        })
    }

    handleDelete() {
        this.setState({status_delete: 'initial'})
        const { emp, level } = this.props.match.params
        this.setState({ status_delete: 'loading' })
        service.employeeRemove(emp).then(({ success }) => {
            global.refreshOrgCount(level)
            this.setState({ status_delete: success ? 'success' : 'fail' })
        })
    }

    handleDeleteSuccess() {
        const { level, id } = this.props.match.params
        this.props.history.push(`/back/байгууллага/түвшин/${level}/${id}/хэрэглэгч/`)
    }

    getAddresses(pk) {
        service
            .getAddress(pk)
            .then(({ success, points }) => {
                if (success) {
                    const feature_length = points.features.length
                    let obj = Object()
                    if (feature_length > 1) {
                        obj['points'] = points
                    }
                    else if (feature_length == 1) {
                        obj['point'] = points
                    }
                    this.setState({ ...obj, is_loading: false })
                }
            })
    }

    getFeature(feature) {
        this.setState({ feature })
    }

    setLoading(is_true) {
        this.setState({ is_loading: is_true })
    }

    getPoint(point_coordinate) {
        let coordinates = point_coordinate
        if (typeof point_coordinate == 'string') {
            coordinates = point_coordinate.split(',')
        }
        const coordinate = [coordinates[1], coordinates[0]]
        return coordinate
    }

    render() {

        const { level, id, emp } = this.props.match.params
        const {
            username,
            last_name,
            first_name,
            position,
            email,
            gender,
            register,
            is_admin,
            is_active,
            token,
            created_at,
            updated_at,
            phone_number,
            level_1,
            level_2,
            level_3,
            street,
            apartment,
            door_number,
            state,
            address_state_display,
            pro_class,
        } = this.state.employee

        const {
            status_token_refresh,
            status_delete,
            points,
            point,
            feature
        } = this.state
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 p-0 text-right">
                        <ButtonTokenRefresh onClick={ this.handleTokenRefresh } status={ status_token_refresh }/>
                        <ButtonEdit to={`/back/байгууллага/түвшин/${level}/${id}/хэрэглэгч/${emp}/засах/`}/>
                        <ButtonDelete
                            status={ status_delete }
                            onClick={ this.handleDelete }
                            employee_name={ first_name }
                            onSuccess={ this.handleDeleteSuccess }
                        />
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-6">
                        <dl className="row">
                            <dt className="col-md-3">Нэвтрэх нэр:</dt>
                            <dd className="col-md-9">{ username }</dd>

                            <dt className="col-md-3">Овог, нэр:</dt>
                            <dd className="col-md-9">
                                { last_name }, { first_name }
                            </dd>

                            <dt className="col-md-3">Албан тушаал:</dt>
                            <dd className="col-md-9">
                                { position }
                            </dd>

                            <dt className="col-md-3">Токен:</dt>
                            <dd className="col-md-9">
                                { token }
                            </dd>
                            <dt className="col-md-3">Мэргэжлийн ангийн бүрэлдэхүүн статус:</dt>
                            <dd className="col-md-9">
                                { pro_class }
                            </dd>
                        </dl>
                        <dl className="row">
                            <dt className="col-md-3">Бүртгэсэн:</dt>
                            <dd className="col-md-9">
                                { created_at }
                            </dd>

                            <dt className="col-md-3">Зассан:</dt>
                            <dd className="col-md-9">
                                { updated_at }
                            </dd>

                        </dl>
                    </div>

                    <div className="col-md-6">
                        <dl className="row">
                            <dt className="col-md-3">Мэйл хаяг:</dt>
                            <dd className="col-md-9">
                                { email }
                            </dd>

                            <dt className="col-md-3">Хүйс:</dt>
                            <dd className="col-md-9">
                                { gender }
                            </dd>

                            <dt className="col-md-3">Регистр:</dt>
                            <dd className="col-md-9">
                                { register }
                            </dd>

                            <dt className="col-md-3">Утасны дугаар:</dt>
                            <dd className="col-md-9">
                                { phone_number }
                            </dd>

                            <dt className="col-md-3">Ажилтны төлөв:</dt>
                            <dd className="col-md-9">
                                { state }
                            </dd>
                        </dl>
                        {
                            level_1
                            &&
                            <dl className="row">
                                <dt className="col-md-3">Гэрийн хаяг:</dt>
                                <dd className="col-md-9">
                                    { level_1 + ", " + level_2 + ", " + level_3 + ", " + street + " гудамж " + apartment + " байр, " + door_number + " тоот" }
                                </dd>

                                <dt className="col-md-3">
                                    Төлөв:
                                </dt>
                                <dd className="col-md-9">
                                    { address_state_display }
                                </dd>
                            </dl>
                        }
                        { is_admin &&
                            <p>
                                <i className="fa fa-check-circle-o fa-lg" aria-hidden="true"></i>
                                {} Байгууллагын админ
                            </p>
                        }

                        { !is_active &&
                            <p>
                                <i className="fa fa-times-circle text-danger fa-lg" aria-hidden="true"></i>
                                {} Нэвтрэх эрхгүй
                            </p>
                        }
                    </div>

                </div>
                <AddressMap
                    features={points}
                    feature={point}
                    setLoading={this.setLoading}
                />
            </div>
        )
    }

}
