import React, { Component } from 'react'
import {service} from '../Employee/service'
import BackButton from "@utils/Button/BackButton"


export class ErguulInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
        }
        this.getDetail = this.getDetail.bind(this)
        this.getPos = this.getPos.bind(this)
    }

    componentDidMount(){
        this.getDetail()
        this.getPos()
    }

    getPos(){
        const { id } = this.state
        service
            .getWherePos(id)
            .then(({
                success,
                erguul_level3,
                erguul_street,
                date_start,
                date_end,
                status,
                local_lvl1,
                local_lvl2,
                desc,
                }) => {
            if(success){
                this.setState({
                erguul_level3,
                erguul_street,
                date_start,
                date_end,
                status,
                local_lvl1,
                local_lvl2,
                desc,
                })
            }
        })
    }

    getDetail() {
        const { id } = this.state
        service
            .getDetailEmployee(id)
            .then(({ employee_detail, success }) => {
                if(success) {
                    this.setState({
                        employee: employee_detail,
                    })
                }
            })
    }

    render() {
        const { first_name, last_name } = this.state.employee
        const {
            erguul_level3,
            erguul_street,
            date_start,
            date_end,
            status,
            local_lvl1,
            local_lvl2,
            desc,
        } = this.state
        return (
            <div className="card pl-5">
                <div className="row mt-4 ">
                    <BackButton {...this.props} name={'Буцах'} navlink_url={'/gov/perm/erguuleg/'}></BackButton>
                    <div className="col-6 ">
                        <div className="row">
                            <dt className="col-md-3">Овог, нэр:</dt>
                            <dd className="col-md-9">
                                { last_name }, { first_name }
                            </dd>
                            <dt className="col-md-12">Эргүүл хийсэн газар:</dt>
                            <dt className="col-md-3">Хот/Аймаг:</dt>
                            <dd className="col-md-9">
                                { local_lvl1 }
                            </dd>
                            <dt className="col-md-3"> Дүүрэг/Сум:</dt>
                            <dd className="col-md-9">
                                { local_lvl2}
                            </dd>
                            <dt className="col-md-3">Хороо/баг:</dt>
                            <dd className="col-md-9">
                                { erguul_level3}
                            </dd>
                            <dt className="col-md-3">Гудамж:</dt>
                            <dd className="col-md-9 pb-4">
                                { erguul_street}
                            </dd>
                        </div>
                    </div>
                        <div className="col-6">
                            <div className="row">
                                <dt className="col-md-3">Эхэлсэн хугацаа:</dt>
                                <dd className="col-md-9">
                                    { date_start}
                                </dd>
                                <dt className="col-md-3">Дууссан хугацаа:</dt>
                                <dd className="col-md-9">
                                    { date_end}
                                </dd>
                                <dt className="col-md-3">Төлөв:</dt>
                                <dd className="col-md-9 text-success">
                                    { status }
                                </dd>
                        </div>
                    </div>
                </div>
                <div className="row pb-5">
                    <div className="col-12">
                        <div> <b>Тайлбар</b> </div>
                            <div>
                            { desc }
                            </div>
                    </div>
                </div>
            </div>

       )
    }
}


