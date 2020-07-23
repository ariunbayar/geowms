export class Capabilities {

    constructor(xml_raw) {

        this.xml = (new DOMParser()).parseFromString(xml_raw, "text/xml")

    }
    getLegend(legend){
        if(legend)
        {
            return legend.getAttribute("xlink:href")
        }
        else
        {
            return "null"
        }
    }
    
    getLayers() {
        const nodes = this.xml.querySelectorAll('WMS_Capabilities > Capability Layer')
        return [...nodes].map((layer) => {
            return {
                name: layer.querySelector('Title').innerHTML,
                code: layer.querySelector('Name').innerHTML,
                legendurl: this.getLegend(layer.querySelector('Style > LegendURL > OnlineResource'))
            }
        })
    }

}
