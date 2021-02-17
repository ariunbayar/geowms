import React, { Component, Fragment } from 'react'
import Text from './components/text'
import Logo from './components/logo'
import Count from './components/count'
import {LineGraph} from './components/LineGraph'
import {PieChart} from './components/PieChart'
import {service} from './service'
import InspireMap from "@utils/BundleMap"


export class CovidPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            initial_values: {
                emy_logo:'',
                batlagdsan_tohioldol:'',
                edgersen_humuusiin_too:'',
                emchlegdej_bui_humuus_too:'',
                tusgaarlagdsan_humuusiin_too:'',
                medeellin_eh_survalj:'',
                emiin_sangiin_too:'',
                emlegiin_too:'',
                niit_eruul_mend_baiguullaga_too:'',
                gzbgzzg_logo:'',
                title:'',
            },
        }
    }

    componentDidMount(){
        this.getDatas()
    }

    getDatas(){
        service.covidConfigGet().then((values) => {
            this.setState({
                initial_values: values
            })
        })
    }

    render() {
        const {
            emy_logo,
            batlagdsan_tohioldol,
            edgersen_humuusiin_too,
            emchlegdej_bui_humuus_too,
            tusgaarlagdsan_humuusiin_too,
            medeellin_eh_survalj,
            emiin_sangiin_too,
            emlegiin_too,
            niit_eruul_mend_baiguullaga_too,
            gzbgzzg_logo,
            title
        } = this.state.initial_values

        return (
            <div className="col-lg-12">
                <div className="row card mt-3 ml-0 mr-0">
                    <div className="row card-body">
                        <Text text={title}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2 col-lg-2 col-xl-2">
                        <div className="row">
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Logo src={emy_logo}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Count text={'Батлагдсан тохиолдол'} src={null} count={batlagdsan_tohioldol}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Count text={'Эдгэрсэн хүмүүсийн тоо'} src={null} count={edgersen_humuusiin_too}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-3 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Count text={'Эмчлэгдэж буй хүмүүсийн тоо'} src={null} count={emchlegdej_bui_humuus_too}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 col-lg-8 col-xl-8 mt-4">
                        <div className="card">
                            <div className="card-body">
                                <InspireMap bundle={{'id': 19}}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 col-lg-2 col-xl-2">
                        <div className="row">
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Logo src={gzbgzzg_logo}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Count text={'Нийт эрүүл мэндийн байгуулагын тоо'} src={null} count={niit_eruul_mend_baiguullaga_too}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Count text={'Эмнэлгийн тоо'} src={null} count={emlegiin_too}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-lg-12 col-xl-12">
                                <div className="card">
                                    <div className="card-body">
                                        <Count text={'Эмийн сангийн тоо'} src={null} count={emiin_sangiin_too}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-2 mt-4 col-lg-2 col-xl-2">
                        <div className="card">
                            <div className="card-body">
                                <Count text={'Тусгаарлагдаж буй хүмүүсийн тоо'} src={null} count={tusgaarlagdsan_humuusiin_too}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mt-4 col-lg-4 col-xl-4">
                        <div className="card" style={{height: '400px'}}>
                            <div className="card-body">
                                <PieChart></PieChart>
                            </div>
                        </div>
                    </div>
                    <div className="col-4 mt-4 col-lg-4 col-xl-4 ">
                        <div className="card" style={{height: '400px'}}>
                            <div className="card-body">
                                <LineGraph></LineGraph>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 mt-4 col-lg-2 col-xl-2 ">
                        <div className="card">
                            <div className="card-body">
                                <Count text={'Мэдээллийн эх сурвалж'} src={null} count={medeellin_eh_survalj}/>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }

}
