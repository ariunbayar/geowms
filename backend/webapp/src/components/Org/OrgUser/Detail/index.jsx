import React, { Component, Fragment } from "react"

import Modal from "../../../Modal"
import ModalAlert from "../../../ModalAlert"
import { service } from "../../service"
import { ButtonTokenRefresh } from "./ButtonTokenRefresh"
import { ButtonEdit } from "./ButtonEdit"
import { ButtonDelete } from "./ButtonDelete"
import { ButtonBack } from "./ButtonBack"


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
            status_token_refresh: 'initial',
            status_delete: 'initial',
        }

        this.fetchDetail = this.fetchDetail.bind(this)
        this.handleTokenRefresh = this.handleTokenRefresh.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleDeleteSuccess = this.handleDeleteSuccess.bind(this)
    }

    componentDidMount(){
        this.fetchDetail()
    }

    fetchDetail() {

        const pk = this.props.match.params.emp

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
                this.fetchDetail()
            this.setState({ status_token_refresh: success ? 'success' : 'fail' })
        })
    }

    handleDelete() {
        const { emp } = this.props.match.params
        this.setState({ status_delete: 'loading' })
        service.employeeRemove(emp).then(({ success }) => {
            this.setState({ status_delete: success ? 'success' : 'fail' })
        })
    }

    handleDeleteSuccess() {
        const { level, id } = this.props.match.params
        this.props.history.push(`/back/байгууллага/түвшин/${level}/${id}/хэрэглэгч/`)
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
        } = this.state.employee

        const {
            status_token_refresh,
            status_delete,
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
                        </dl>
                        {
                            level_1
                            &&
                            <dl className="row">
                                <dt className="col-md-3">Гэрийн хаяг:</dt>
                                <dd className="col-md-9">
                                    { level_1 + ", " + level_2 + ", " + level_3 + ", " + street + " гудамж " + apartment + " байр, " + door_number + " тоот" }
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
            </div>
        )
    }

}
