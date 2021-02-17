import React, { Component, Fragment } from 'react'
import Text from './components/text'

export class CovidPage extends Component {

    render() {
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
                        <div className="card">
                            aaaa22222
                        </div>
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
                        <div className="card">
                            aaaa44
                        </div>
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
