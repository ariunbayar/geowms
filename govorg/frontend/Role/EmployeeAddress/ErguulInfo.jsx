import React, { Component } from 'react'
import {service} from '../Employee/service'
import BackButton from "@utils/Button/BackButton"


export class ErguulInfo extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            indicate: '',
        }
        this.getPos = this.getPos.bind(this)
    }

    componentDidMount(){
        this.getPos()
    }

    getPos(){
        const { id } = this.state
        service
            .getWherePos(id)
            .then(({
                success,
                first_name,
                last_name,
                local_lvl1,
                local_lvl2,
                local_lvl3,
                local_street,
                local_apart,
                local_dn,
                erguul_level3,
                erguul_street,
                erguul_apart,
                date_start,
                date_end,
                status,
                desc,
            }) => {
            if(success){
                this.setState({
                    first_name,
                    last_name,
                    local_lvl1,
                    local_lvl2,
                    local_lvl3,
                    local_street,
                    local_apart,
                    local_dn,
                    erguul_level3,
                    erguul_street,
                    erguul_apart,
                    date_start,
                    date_end,
                    status,
                    desc,
                })
            }
            if (status == 'Гарсан'){
                this.setState({ indicate:'text-success' })
            }
            else if (status == 'Гараагүй'){
                this.setState({ indicate:'text-danger' })
            }
            else if (status == 'Гарч байгаа'){
                this.setState({ indicate:'text-warning' })
            }
        })
    }


    render() {
        const {
            first_name,
            last_name,
            local_lvl1,
            local_lvl2,
            local_lvl3,
            local_street,
            local_apart,
            local_dn,
            erguul_level3,
            erguul_street,
            erguul_apart,
            date_start,
            date_end,
            status,
            desc,
            indicate,
        } = this.state
        return (
            <div className="card pl-5">
                <div className="row mt-4 ">
                    <BackButton {...this.props} name={'Буцах'} navlink_url={'/gov/perm/erguuleg/'}></BackButton>
                    <div className="col-4 ">
                        <div className="row">
                            <dt className="col-sm-6 col-xl-3">Овог, нэр:</dt>
                            <dd className="col-sm-6 col-xl-9">
                                { last_name }, { first_name }
                            </dd>
                            <dt className="col-sm-6 col-xl-3">Эхэлсэн хугацаа:</dt>
                                <dd className="col-sm-6 col-xl-9">
                                    { date_start}
                                </dd>
                                <dt className="col-sm-6 col-xl-3">Дууссан хугацаа:</dt>
                                <dd className="col-sm-6 col-xl-9">
                                    { date_end}
                                </dd>
                                <dt className="col-sm-6 col-xl-3">Төлөв:</dt>
                                <dd className={`col-sm-6 col-xl-9 ${indicate}`}>
                                    { status }
                                </dd>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <h5 className="col-sm-12 col-xl-12 ">
                                Эргүүл хийсэн газар:
                            </h5>
                            <dt className="col-sm-6 col-xl-3">Хороо/баг:</dt>
                            <dd className="col-sm-6 col-xl-9">
                                { erguul_level3}
                            </dd>
                            <dt className="col-sm-6 col-xl-3">Гудамж:</dt>
                            <dd className="col-sm-6 col-xl-9 ">
                                { erguul_street}
                            </dd>
                            <dt className="col-sm-6 col-xl-3"> Байр:</dt>
                            <dd className="col-sm-6 col-xl-9 ">
                                { erguul_apart}
                            </dd>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="row">
                            <h5 className="col-sm-12 col-xl-12 ">
                                Гэрийн хаяг:
                            </h5>
                            <dt className="col-sm-6 col-xl-3">
                                Хот/Аймаг:
                            </dt>
                            <dd className="col-sm-6 col-xl-9">
                                { local_lvl1 }
                            </dd>
                            <dt className="col-sm-6 col-xl-3"> Дүүрэг/Сум:</dt>
                            <dd className="col-sm-6 col-xl-9">
                                { local_lvl2 }
                            </dd>
                            <dt className="col-sm-6 col-xl-3">Хороо/баг:</dt>
                            <dd className="col-sm-6 col-xl-9">
                                { local_lvl3 }
                            </dd>
                            <dt className="col-sm-6 col-xl-3">Гудамж:</dt>
                            <dd className="col-sm-6 col-xl-9 ">
                                { local_street }
                            </dd>
                            <dt className="col-sm-6 col-xl-3">Байр:</dt>
                            <dd className="col-sm-6 col-xl-9 ">
                                { local_apart }
                            </dd>
                            <dt className="col-sm-6 col-xl-3">Хаалганы дугаар:</dt>
                            <dd className="col-sm-6 col-xl-9 ">
                                { local_dn }
                            </dd>
                        </div>
                    </div>
                </div>
                <div className="row pb-5 pr-5">
                    <div className="col-12">
                        <div>
                            <b>Эргүүлд гарсан тайлбар:</b>
                        </div>
                        <div>
                            <a className="ml-4 text-justify">{ desc }</a>
                        </div>
                    </div>
                </div>
            </div>
       )
    }
}


