import React, { PureComponent } from 'react';
import Navbar from "./components/Navbar"


class CovidDashboard extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">

                        <div className="col-md-12 border border-danger" style={{height: '50px'}}>
                            HEADER
                        </div>

                        <div className="col-md-3 border border-danger" style={{height: '1000px'}}>
                            MENU
                        </div>

                        <div className="col-md-9 border border-danger" style={{height: '1000px'}}>
                            <div className="row">
                                <div className="col-md-12 border border-danger" style={{height: '50px'}}>
                                    <Navbar />
                                </div>
                                <div className="col-md-12 border border-danger" style={{height: '950px'}}>
                                    MAP
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CovidDashboard;
