import React, { Component } from "react"
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

export class Charts extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
        
    }
    
    render() {
      const dataLine = {
          labels: ["2020-07-01", "2020-07-02", "2020-07-03", "2020-07-04", "2020-07-05", "2020-07-06"],
          datasets: [
            {
              label: "My First dataset",
              fill: true,
              lineTension: 0.3,
              backgroundColor: "rgba(184, 185, 210, .3)",
              borderColor: "rgb(35, 26, 136)",
              borderCapStyle: "butt",
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: "miter",
              pointBorderColor: "rgb(35, 26, 136)",
              pointBackgroundColor: "rgb(255, 255, 255)",
              pointBorderWidth: 10,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgb(0, 0, 0)",
              pointHoverBorderColor: "rgba(220, 220, 220, 1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [20, 10, 5, 5, 20, 6, 3]
            },
           
          ]
        }
      
        return (
          <MDBContainer>
            <Line data={dataLine} options={{ responsive: true }} />
          </MDBContainer>
        )
    }

}
