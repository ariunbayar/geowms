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
        this.xmlToJson = this.xmlToJson.bind(this)
    }

    readFile(e){
        console.log(e)
    }

    getFile(event) {
        const files = event.target.files;

        var torf = false
        // const reader = new FileReader();
        const formData = new FormData();
        for(var i = 0; i < files.length; i ++) {
            formData.append("data", files[i], files[i].name);
            // reader.readAsText(files[i])
        }
        service.send(formData).then(rsp => {
            console.log(rsp)
        })
    }
    //     reader.onload = (e) => {
    //         this.values = []
    //         const text = e.target.result
    //         if(file.name.includes('.gml')) {
    //             const parser = new DOMParser();
    //             const xml = parser.parseFromString(text,"text/xml");
    //             this.setState({ xml, text })
    //             // this.send = xml
    //             // for(var i = 0; i < xml.childNodes[0].children.length; i++) {
    //             //     const elem = xml.getElementsByTagName('gml:featureMember')[i]
    //             //     const type = elem.nodeType
    //             //     if (type == 3){
    //             //         if (elem.nodeValue !== '') {
    //             //             console.log(elem.nodeValue)
    //             //         }
    //             //     }
    //             //     if(type == 1){
    //             //         for(let j = 0; j < elem.childNodes.length; j++){
    //             //             const child = elem.childNodes[j]
    //             //             if(child.nodeType == 3){
    //             //                 if (child.nodeValue !== '') {
    //             //                     console.log(child.nodeValue)
    //             //                 }
    //             //             }
    //             //             if (child.nodeType == 1){
    //             //                 for(let k = 0; k < child.childNodes.length; k++){
    //             //                     const childChild = child.childNodes[k]
    //             //                     if(childChild.nodeType == 3){
    //             //                         if (childChild.nodeValue !== '') {
    //             //                             console.log(childChild.nodeValue)
    //             //                         }
    //             //                     }
    //             //                     if ( childChild.nodeType == 1 ){
    //             //                         if (childChild.childNodes.length > 0){
    //             //                             for(let m = 0; m < childChild.childNodes.length; m ++){
    //             //                                 const child2 = childChild.childNodes[m]
    //             //                                 if(child2.nodeType == 3){
    //             //                                     if (child2.nodeValue !== '') {
    //             //                                         console.log(child2.nodeValue)
    //             //                                     }
    //             //                                 }
    //             //                                 if (child2.nodeType == 1){
    //             //                                     for(let l = 0; l < child2.childNodes.length; l ++){
    //             //                                         const child3 = child2.childNodes[l]
    //             //                                         if(child3.nodeType == 3){
    //             //                                             if (child3.nodeValue !== '') {
    //             //                                                 console.log(child3.nodeValue)
    //             //                                             }
    //             //                                         }
    //             //                                         if(child3.nodeType == 1) {
    //             //                                             for(let p = 0; p < child3.childNodes.length; p ++){
    //             //                                                 const child4 = child3.childNodes[p]
    //             //                                                 if (child4.nodeType == 3) {
    //             //                                                     console.log(child4.nodeValue)
    //             //                                                 }
    //             //                                             }
    //             //                                         }
    //             //                                     }
    //             //                                 }
    //             //                             }
    //             //                         }
    //             //                     }
    //             //                 }
    //             //             }
    //             //         }
    //             //     }
    //             // }
    //             const features = xml.getElementsByTagName('gml:FeatureCollection')
    //             // const features = xml.getElementsByTagName('gml:featureMember')
    //             // const features = xml.getElementsByTagName('gml:FeatureCollection')
    //             // for (let i = 0; i < 10; i++){
    //             //     console.log(features[i].childNodes.length)
    //             //     for(let j = 0; j < features[i].childNodes.length; i ++){
    //             //         console.log(features[i].childNodes[j])
    //             //     }
    //             // }
    //             // features.map((feature, idx) => {
    //             //     console.log(feature)
    //             // })
    //             // console.log(xml.querySelectorAll('gml:featureMember'))
    //             // xml.features.slice(0,1).map((feature, idx) => {
    //             //     service.send(feature).then(rsp => {
    //             //         console.log(rsp)
    //             //     })
    //             //     this.values.push(feature)
    //             //     console.log(feature)
    //             // })
    //         }
    //         if(file.name.includes('.geojson')) {
    //             const obj = JSON.parse(text)
    //             send = obj
    //             obj.features.slice(0,1).map((feature, idx) => {
    //                 service.send(feature).then(rsp => {
    //                     console.log(rsp)
    //                 })
    //                 this.values.push(feature)
    //                 console.log(feature)
    //             })
    //         }
    //         if(file.name.includes('.shp')) {
    //             // const infoWindow = new google.maps.InfoWindow();
    //             // infoWindow.setContent(text);
    //         }
    //     };
    // }

    xmlToJson(xml) {
        // Create the return object
        var obj = {};
        if (xml.nodeType == 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) { // text
            obj = xml.nodeValue;
        }
        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) == "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof(obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.xmlToJson(item));
                }
            }
        }
        return obj;
    };

    componentDidUpdate(pP, pS){
        if(pS.xml !== this.state.xml){
            const objects = this.xmlToJson(this.state.xml)
            objects['gml:FeatureCollection']['gml:featureMember'].map((feature, idx) => {
                const obj = feature['tn-ro:RoadNode']['net:geometry']
                var keys = Object.keys(obj);
                keys.map((key, ik) => {
                    if (key !== '#text'){
                        const ob = obj[keys[ik]]
                        var names = Object.keys(ob);
                        names.map((name, ix) => {
                            if (name == 'gml:pos'){
                                var pos = ob[name]['#text'] // coordinate
                                const toibj = {'pos': pos}
                                this.values[idx].push(toibj)
                            }
                            if (name == '@attributes'){
                                // console.log('attr')
                                const attr = ob[name]
                                const info = [{'info': attr}]
                                this.values.push(info)
                            }
                        })
                    }
                })
            })
        }
        if (pS.text !== this.state.text){
            const text = this.state.text
            // console.log(text)
        }
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