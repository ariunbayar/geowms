import React, { Component, Fragment } from 'react'
import Text from './components/text'
import Logo from './components/logo'
import Count from './components/count'
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
            src1: "/static/assets/image/logo/logo.png",
            src2: "/static/assets/image/logo/logo-2.png",
            src3: "/static/assets/image/logo/gzbgzzg-logo.jpg",
            count1: 431,
            count2: '',
            count3: '',
            count4: '',
            count5: '',
            count6: '',
            count7: '',
            text1: '',
            text2: '',
            text3: '',
            text4: '',
            text5: '',
            text6: '',
            text7: '',
            text8: 'Гарчиг',
            text9: 'Мэдээллийн эх сурвалж'
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
        const { src1, src2, src3,text1, text2, text3, text4, text5, text6, text7, text8, text9, count1, count2, count3, count4, count5, count6, count7 } = this.state
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
            <div className="col-ld-12">
                <div className="row border border-danger">
                    <div className="col-lg-12 d-flex border border-danger">
                        <Text text={title}/>
                    </div>
                </div>
                <div className="row border border-danger">
                    <div className="col-lg-2 d-flex flex-column border border-danger">
                        <Logo src={src1}/>
                    </div>
                    <div className="col-lg-8 border border-danger">
                        <div className="card">
                            aaaa33333
                            <InspireMap bundle={{'id': 10}}/>

                        </div>
                    </div>
                    <div className="col-lg-2 d-flex flex-column border border-danger">
                        <Logo src={src3}/>
                        <Count text={text4} src={src2} count={emiin_sangiin_too}/>
                        <Count text={text5} src={src2} count={emiin_sangiin_too}/>
                        <Count text={text6} src={src2} count={emlegiin_too}/>
                    </div>
                </div>
                <div className="row border border-danger">
                    <div className="col-lg-2 d-flex flex-column border border-danger">
                        <Count text={text7} src={src2} count={niit_eruul_mend_baiguullaga_too}/>
                    </div>
                    <div className="col-lg-4 d-flex flex-column border border-danger">
                        <div className="card">
                            aaaa6
                        </div>
                    </div>
                    <div className="col-lg-4 d-flex flex-column border border-danger">
                        <div className="card">
                            aaaa7
                        </div>
                    </div>
                    <div className="col-lg-2 d-flex flex-column border border-danger">
                        <Text text={text9}/>
                    </div>
                </div>
            </div>
        )
    }

}
