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
            geo_id: 'au_11',
            name: 'Улаанбаатар',
            count_datas: [],
            charts: {}
        }
        this.getState = this.getState.bind(this)
    }

    componentDidMount(){
        this.getState()
    }

    getState(){
        const {geo_id} = this.state
        service.getState(geo_id).then(({success, count_datas, charts}) =>{
            if(success){
                this.setState({count_datas, charts})
            }
        })
    }

    render() {
        const {count_datas, charts, name} = this.state
        return (
            <div className="card-body">
                <div className="row pt-3">
                    <div className="col-12 mb-2">
                        <h4 className="text-center">{name} өнөөдрийн байдлаар</h4>
                    </div>
                    {count_datas.map((data, idx) =>
                        <Card
                            idx={idx}
                            color={data.color}
                            head_text={data.name}
                            body_text={data.data}
                            prev_data={data.prev_data}
                        />
                    )}
                </div>
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
                    {/* <div className="col-4">
                        <RadarChart
                            height={400}
                            labels={charts.piechart_one ? charts.piechart_one.labels : []}
                            datas={charts.piechart_one ? charts.piechart_one.datas : []}
                            backgroundColor={'rgba(184, 185, 210, .3)'}
                            borderColor={'#4BC0C0'}
                            label={"Үйлдлийн төрлөөр"}
                        />
                    </div>
                    <div className="col-4">
                    <LineGraph
                        labels={['1', '2', '3', '4', '5', '6']}
                        lineTension={0.1}
                        label="Батлагдсан тохиолдол 2"
                        datas={[60, 30, 10, 120, 340, 210]}
                        datas={[210, 30, 10, 120, 340]}
                        graph_color={'#15ca20'}
                        height={150}
                    />
                    </div>
                    <div className="col-4">
                        <PolorGraph
                            height={400}
                            label={"odrii mend"}
                            backgroundColor= {['#FF6384','#4BC0C0','#FFCE56','#E7E9ED','#36A2EB', '#EC0E00', '#EC0E00']}
                            labels={charts.piechart_one ? charts.piechart_one.labels : []}
                            datas={charts.piechart_one ? charts.piechart_one.datas : []}
                        />
                    </div> */}
                </div>
            </div>
        );
    }
}

export default Graph;
