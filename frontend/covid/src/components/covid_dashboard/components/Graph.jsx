import React, { PureComponent } from 'react';
import Card from './components/Card'
import LineGraph from './components/LineGraph'
import PieChart from './components/PieChart'
import RadarChart from './components/RadarChart'
import PolorGraph from './components/PolorGraph'


class Graph extends PureComponent {
    render() {
        return (
            <div>
                <div className="row pt-3">
                    <Card color='primary' head_text={'header title'} body_text={'9999'} footer_text={'+580,231'}/>
                    <Card color='danger' head_text={'header title'} body_text={'9999'} footer_text={'+580,231'}/>
                    <Card color='dark' head_text={'header title'} body_text={'9999'} footer_text={'+580,231'}/>
                    <Card color='warning' head_text={'header title'} body_text={'9999'} footer_text={'+580,231'}/>
                </div>
                <div className="row">
                    <div className="col-6">
                    <LineGraph
                        label="Батлагдсан тохиолдол"
                        labels={['1', '2', '3', '4', '5', '6']}
                        datas={[60, 30, 10, 120, 340, 210]}
                        graph_color={'#EC0E00'}
                        lineTension={0.3}
                        height={150}
                    />
                    </div>
                    <div className="col-6">
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
                        <RadarChart
                            height={200}
                            datas={[20, 10, 4, 2]}
                            labels={['Running', 'Swimming', 'Eating', 'Cycling']}
                            backgroundColor={'rgba(184, 185, 210, .3)'}
                            borderColor={'#4BC0C0'}
                            label={"Үйлдлийн төрлөөр"}
                        />
                    </div>
                    <div className="col-4">
                        <PieChart
                            label="Батлагдсан тохиолдол"
                            labels={['1', '2', '3']}
                            datas={[123, 23, 234]}
                            height={200}
                            backgroundColor={["rgba(226, 42, 36, 0.6)", '#4BC0C0', '#FFCE56']}
                        />
                    </div>
                    <div className="col-4">
                        <PolorGraph
                            height={200}
                            label={"odrii mend"}
                            backgroundColor= {['#FF6384','#4BC0C0','#FFCE56','#E7E9ED','#36A2EB']}
                            datas={[11,16,7,3,14]}
                            labels={['Red','Green','Yellow','Grey','Blue']}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Graph;
