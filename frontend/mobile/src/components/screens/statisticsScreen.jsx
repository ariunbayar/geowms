import React, {Component} from 'react'
import { Chart } from 'react-charts'
//alert(JSON.stringify(this.props.bundle))
export class StatisticsScreen extends Component {
    render() {
        const data = [
              {
                label: 'Series 1',
                data: [[0, 10], [1, 12], [4, 1], [13, 6], [6, 1]]
              },
              {
                label: 'Series 2',
                data: [[2, 5], [1, 7], [2, 1], [3, 9], [4, 12]]
              },
              {
                label: 'Series 3',
                data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
              }
            ]
            const data1 = [
                {
                  label: 'Series 1',
                  data: [[0, 1], [1, 2], [2, 4], [3, 2], [4, 7]]
                },
                {
                  label: 'Series 2',
                  data: [[0, 3], [1, 1], [2, 5], [3, 6], [4, 4]]
                }
              ]
              const data2= [
                {
                  label: 'Series 1',
                  data: [[3, 1], [9, 2], [12, 9], [9, 12], [14, 7]]
                },
                {
                  label: 'Series 2',
                  data: [[0, 3], [6, 10], [22, 16], [3, 6], [14, 4]]
                }
              ]
          const axes = [
              { primary: true, type: 'linear', position: 'bottom' },
              { type: 'linear', position: 'left' }
            ]
        
        return (
            <div className="statick">
                <div  
                    style={{
                        top:'80px',
                        width: '95%',
                        height: '300px'
                    }}
                    >  
                        <Chart data={data} axes={axes} />
                </div>
                <div  
                    style={{
                        top:'80px',
                        width: '95%',
                        height: '300px'
                    }}
                    >  
                        <Chart data={data1} axes={axes} />
                </div>
                <div  
                    style={{
                        top:'80px',
                        width: '95%',
                        height: '300px'
                    }}
                    >  
                        <Chart data={data2} axes={axes} />
                </div>
            </div>
        )

    }

}
