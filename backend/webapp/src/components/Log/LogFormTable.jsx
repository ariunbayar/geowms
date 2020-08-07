import React, { Component } from "react"

export class LogFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {transaction_number, amount, date, status, result, permission_number, card, cardholder} = this.props.values
        return (
            <tr>
                <td className="odd">{transaction_number}</td>
                <td className="sorting_1">{amount}</td>
                <td>{date}</td>
                <td>{status}</td>
                <td>{result}</td>
                <td>{permission_number}</td>
                <td>{card}</td>
                <td>{cardholder}</td>
            </tr>
        )

    }

}
