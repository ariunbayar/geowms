export class Capabilities {

    constructor(xml_raw) {

        this.xml = (new DOMParser()).parseFromString(xml_raw, "text/xml")

    }
    getLayers() {
        const nodes = this.xml.querySelectorAll('WMS_Capabilities > Capability Layer')
        return [...nodes].map((layer) => {
            return {
                name: layer.querySelector('Title').innerHTML,
                code: layer.querySelector('Name').innerHTML,
                legendurl: layer.querySelector('Style > LegendURL > OnlineResource').getAttribute("xlink:href")
            }
        })
    }

}
