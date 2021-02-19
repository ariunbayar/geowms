import React, { Component, Fragment } from 'react'
import Text from './components/text'
import TextArea from './components/textarea'
import Logo from './components/logo'
import Count from './components/count'
import {LineGraph} from './components/LineGraph'
import {PieChart} from './components/PieChart'
import {service} from './service'
import InspireMap from "@utils/BundleMap"
import SearchSelects from './components/SearchSelects'

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
                bundle: '',
                line_chart_datas: [],
                nas_barsan_too: '',
            },
            feature_collection: {},
            feature: {},
            graph_color: '#EC0E00',
            batlagdsan_tohioldol_ungu: 'danger',
            edgersen_humuusiin_ungu: 'success',
            emchlegdej_bui_humuus_ungu: 'warning',
            tusgaarlagdsan_humuusiin_ungu: 'warning',
            niit_eruul_mend_baiguullaga_ungu: 'info',
            emlegiin_ungu: 'info',
            emiin_sangiin_ungu: 'info',
            shinjilgee_ungu: 'info',
        }
        this.getFeature = this.getFeature.bind(this)
        this.loadData = this.loadData.bind(this)
    }

    componentDidMount(){
        this.getDatas()
    }

    getDatas(){
        service
            .covidConfigGet()
            .then((values) => {
                this.setState({ initial_values: values })
            })
    }

    loadData(loadErguul) {
        service
            .getErguulEmployees()
            .then(({feature_collection}) => {
                loadErguul(feature_collection)
            })
    }

    getFeature(feature) {
        this.setState({ feature })
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
            title,
            line_chart_datas,
            bundle,
            shinjilgee_too,
            nas_barsan_too,
        } = this.state.initial_values
        let labels = ['Эмчлэгдэж буй хүмүүсийн тоо', 'Эдгэрсэн хүмүүсийн тоо', 'Нас барсан хүмүүсийн тоо']
        const {
            feature_collection,
            feature,
            graph_color,
            batlagdsan_tohioldol_ungu,
            edgersen_humuusiin_ungu,
            emchlegdej_bui_humuus_ungu,
            tusgaarlagdsan_humuusiin_ungu,
            niit_eruul_mend_baiguullaga_ungu,
            emlegiin_ungu,
            emiin_sangiin_ungu,
            shinjilgee_ungu,
        } = this.state

        return (
            <div className="col-md-12">
                <div className="row card mt-3 ml-0 mr-0">
                    <div className="row card-body">
                        <Text text={title}/>
                    </div>
                </div>

                <div className="row">
                    <div className="col-2 col-md-2 col-xl-2 mt-2">
                        <div className="row">
                            <div className="col-12 mt-3 col-md-12 col-xl-12">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <Logo src={emy_logo}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${batlagdsan_tohioldol_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Батлагдсан тохиолдол'}
                                            src={null}
                                            count={batlagdsan_tohioldol}
                                            count_color={batlagdsan_tohioldol_ungu}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${edgersen_humuusiin_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Эдгэрсэн хүмүүсийн тоо'}
                                            src={null}
                                            count={edgersen_humuusiin_too}
                                            count_color={edgersen_humuusiin_ungu}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-3 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${emchlegdej_bui_humuus_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Эмчлэгдэж буй хүмүүсийн тоо'}
                                            src={null}
                                            count={emchlegdej_bui_humuus_too}
                                            count_color={emchlegdej_bui_humuus_ungu}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12  mt-3 col-md-12 col-xl-12 text-wrapp">
                                <div className={`card h-100 border border-${tusgaarlagdsan_humuusiin_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Тусгаарлагдаж буй хүмүүсийн тоо'}
                                            src={null}
                                            count={tusgaarlagdsan_humuusiin_too}
                                            count_color={tusgaarlagdsan_humuusiin_ungu}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-8 col-md-8 col-xl-8 mt-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <SearchSelects sendFeature={this.getFeature}/>
                                <InspireMap
                                    bundle={{'id': bundle}}
                                    features={feature_collection}
                                    feature={feature}
                                    loadErguul={(func) => this.loadData(func)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-2 col-md-2 col-xl-2">
                        <div className="row">
                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <Logo src={gzbgzzg_logo}/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${niit_eruul_mend_baiguullaga_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Нийт эрүүл мэндийн байгуулагын тоо'}
                                            src={null}
                                            count={niit_eruul_mend_baiguullaga_too}
                                            count_color={niit_eruul_mend_baiguullaga_ungu}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${emlegiin_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Эмнэлгийн тоо'}
                                            src={null}
                                            count={emlegiin_too}
                                            count_color={emlegiin_ungu}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${emlegiin_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Эмийн сангийн тоо'}
                                            src={null}
                                            count={emiin_sangiin_too}
                                            count_color={emiin_sangiin_ungu}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4 col-md-12 col-xl-12">
                                <div className={`card h-100 border border-${shinjilgee_ungu}`}>
                                    <div className={`card-body`}>
                                        <Count
                                            text={'Шинжилгээ хийсэн тоо'}
                                            src={null}
                                            count={shinjilgee_too}
                                            count_color={shinjilgee_ungu}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-4 mt-4 col-md-4 col-xl-4">
                        <div className="card border border-info">
                            <div className="card-body">
                                <PieChart
                                    labels={labels}
                                    batlagdsan_tohioldol={batlagdsan_tohioldol}
                                    edgersen_humuusiin_too={edgersen_humuusiin_too}
                                    nas_barsan_too={nas_barsan_too}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6 mt-4 col-md-8  col-xl-8 mb-4 ">
                        <div className="card border border-info">
                            <div className="card-body">
                                <LineGraph
                                    graph_color={graph_color}
                                    line_chart_datas={line_chart_datas}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}
