import React, { PureComponent } from 'react';
import Card from './components/Card'
import LineGraph from './components/LineGraph'
import PieChart from './components/PieChart'
import RadarChart from './components/RadarChart'
import {service} from './service'
import PolorGraph from './components/PolorGraph'


class Graph extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            geo_id: props.geo_id ? props.geo_id : 'au_496',
            count_datas: [],
            charts: {}
        }
        this.getState = this.getState.bind(this)
    }

    componentDidMount(){
        const {geo_id} = this.state
        this.getState(geo_id)
    }

    componentDidUpdate(pP) {
        if (pP.geo_id !== this.props.geo_id) {
            this.setState({ geo_id: this.props.geo_id })
            this.getState(this.props.geo_id)
        }
    }

    getState(geo_id){
        service.getState(geo_id).then(({success, count_datas, charts, name}) =>{
            if(success){
                this.setState({count_datas, charts, name})
            }
        })
    }

    render() {
        const {count_datas, charts, name} = this.state
        return (
            <div className="card-body">
                <div className="row">
                    <div className="col-8">
                        <h4 className="text-center">Нийт байдлаар</h4>
                        <LineGraph
                            label="Батлагдсан тохиолдол"
                            labels={charts.linechart_all ? charts.linechart_all.dates : []}
                            is_one_many_line={true}
                            datas={charts.linechart_all ? charts.linechart_all.datas : []}
                            graph_color={'#EC0E00'}
                            lineTension={0.3}
                            height={150}
                        />
                    </div>
                    <div className="col-4">
                        <h4 className="text-center">Өнөөдрийн байдлаар</h4>
                        <PieChart
                                label="Батлагдсан тохиолдол"
                                labels={charts.piechart_one ? charts.piechart_one.labels : []}
                                datas={charts.piechart_one ? charts.piechart_one.datas : []}
                                height={330}
                                backgroundColor= {charts.piechart_one ? charts.piechart_one.backgroundColor : []}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Graph;
