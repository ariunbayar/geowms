import React, { Component } from "react"



export class HuulgaFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {transaction_number, amount, date} = this.props.values
        return (
            <tr className="odd">
                <td className="sorting_1">{transaction_number}</td>
                <td>{amount}</td>
                <td>{date}</td>
            </tr>
        )

    }

}
