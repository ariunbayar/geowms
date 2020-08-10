import React, { Component } from "react"



export class CrudEvenLogTable extends Component {

    constructor(props) {
        super(props)
    }
    
    componentDidMount(){
    }
    render() {
        const {id, event_type, object_id, object_repr, datetime, content_type_id, user_id, user_pk_as_string, changed_fields, username} = this.props.values
        const idx = this.props.idx
        return (
            <tr>
                <td>{idx}</td>
                <td>{event_type==1 ? 'Create' : event_type==2 ? 'Update' : event_type==3 ? 'Delete' : event_type==4 ? 'Many-to-Many Change' : 'Reverse Many-to-Many Change'}</td>
                <td>{object_repr}</td>
                <td>{object_id}</td>
                <td>{username}</td>
                <td>{datetime}</td>
                
            </tr>
        )
    }

}
