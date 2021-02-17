import React, { Component, Fragment } from 'react'
import Text from './components/text'
import Logo from './components/logo'

export class CovidPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            src1: "/static/assets/image/logo/logo.png",
            src2: "/static/assets/image/logo/logo-2.png"
        }
    }

    render() {
        const { src1, src2 } = this.state
        return (
            <div className="col-ld-12">
                <div className="row border border-danger">
                    <div className="col-lg-12 d-flex border border-danger">
                        {/* <div className="card">
                            aaaa1111111
                        </div> */}
                        <Text text="Гарчиг"/>
                    </div>
                </div>
                <div className="row border border-danger">
                    <div className="col-lg-3 d-flex flex-column border border-danger">
                        {/* <div className="card">
                            aaaa22222
                        </div> */}
                        <Logo src={src1}/>
                        <div className="card">
                            aaaa2222
                        </div>
                        <div className="card">
                            aaaa2222
                        </div>
                        <div className="card">
                            aaaa22
                        </div>
                        {/* <div className="card">
                            aaaa22
                        </div> */}
                    </div>
                    <div className="col-lg-6 border border-danger">
                        <div className="card">
                            aaaa33333
                        </div>
                    </div>
                    <div className="col-lg-3 d-flex flex-column border border-danger">
                        {/* <div className="card">
                            aaaa44
                        </div> */}
                        <Logo src={src2}/>
                        <div className="card">
                            aaaa44
                        </div>
                        <div className="card">
                            aaaa44
                        </div>
                        <div className="card">
                            aaaa44
                        </div>
                        {/* <div className="card">
                            aaaa44
                        </div> */}
                    </div>
                </div>
                <div className="row border border-danger">
                    <div className="col-lg-3 d-flex flex-column border border-danger">
                        <div className="card">
                            aaaa55
                        </div>
                    </div>
                    <div className="col-lg-3 d-flex flex-column border border-danger">
                        <div className="card">
                            aaaa6
                        </div>
                    </div>
                    <div className="col-lg-3 d-flex flex-column border border-danger">
                        <div className="card">
                            aaaa7
                        </div>
                    </div>
                    <div className="col-lg-3 d-flex flex-column border border-danger">
                        {/* <div className="card">
                            aaaa8
                        </div> */}
                        <Text text="Мэдээллийн эх сурвалж"/>
                    </div>
                </div>
            </div>
        )
    }

}
