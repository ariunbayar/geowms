import React, { Component } from 'react';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pic: "/static/assets/image/logo/logo.png",
            name: 'Байрлалд суурилсан орон зайн мэдээлэл (KOВИД-19)'
        }
    }


    render() {
        const { pic, name }  = this.state
            return (
                <div className="p-1 mr-20">
                    <img src={pic} width="100" height="40" />&nbsp; &nbsp;
                    <b>{name}</b>
                </div>
            )
    }
}
