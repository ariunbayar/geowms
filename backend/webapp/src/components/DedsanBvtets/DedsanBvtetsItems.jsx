import React, { Component } from "react"



export class DedsanBvtetsItems extends Component {

    constructor(props) {
        super(props)
    }
    componentDidMount(){
    }
    render() {
        const {id, name, code, package1} = this.props.values
        console.log("package", id)
        return (
            <tr className="odd">
              
                
            </tr>
        )

    }

}
