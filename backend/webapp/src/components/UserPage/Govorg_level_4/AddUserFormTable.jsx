import React, { Component } from "react"



export class AddUserFormTable extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const { } = this.props.values
        return (
            <tr>
                <td>{"Хэрэглэгчийн нэр"}</td>
                <td>{"Админ болсон огноо"}</td>
                <td>{"Админ эрх олгосон хэрэглэгч"}</td>
                <td>{"Харьяат байгууллага"}</td>
                <td> 
                    <a href="#" onClick={this.props.handleUserDelete}>
                        <i className="fa fa-trash-o" aria-hidden="true"></i>
                    </a>
                </td>
            </tr>
        )

    }

}
