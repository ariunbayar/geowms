import React, { Component } from 'react';

class MssqlForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            table_names: [
                'BUILDING_ALS3',
                'BUILDING_BGD',
                'BUILDING_BZD',
                'BUILDING_CHD',
                'BUILDING_HUD',
                'BUILDING_SBD',
                'BUILDING_SHD'
            ]
        }
    }

    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default MssqlForm;