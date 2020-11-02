import React, { Component } from 'react'
import { service } from '../service'
// import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo'

export class Upload extends Component {
    constructor(props){
        super(props)
        this.values = []
        this.send = null
        this.state = {
            items: []
        }
        this.getFile = this.getFile.bind(this)
    }

    getFile(event) {
        const files = event.target.files;
        const formData = new FormData();
        for(var i = 0; i < files.length; i ++) {
            formData.append("data", files[i], files[i].name);
        }
        service.send(formData).then(({success, info, key}) => {
            if (success){
                alert(info)
                if (key){
                    alert(key)
                }
                else{
                    alert(key)
                }
            }
            else{
                alert(info)
            }
        })
    }

    render() {
        return (
            <div className={`card col-md-6 border border-danger `}>
                <div className="card-body ">
                    <form method="POST">
                        <h1>FILE UPLOAD</h1>
                        <input type="file" multiple onChange={(e) => this.getFile(e)}/>
                    </form>
                </div>
            </div>
        )
    }
}