export class Capabilities {

    constructor(xml_raw) {

        this.xml = (new DOMParser()).parseFromString(xml_raw, "text/xml")

    }
/*    getStyle(styles) {
        console.log(JSON.stringify(styles))
        return [...styles].map((style) => {
            [{
                name: style.querySelector('Name').innerHTML,
                title: style.querySelector('Title').innerHTML,
            }]
        })
    }
*/
    getLayers() {
        const nodes = this.xml.querySelectorAll('WMS_Capabilities > Capability Layer')
        return [...nodes].map((layer) => {
            //const styles = layer.querySelectorAll('Style')
            return {
                name: layer.querySelector('Title').innerHTML,
                code: layer.querySelector('Name').innerHTML,
                //styles: this.getStyle(styles)
            }
        })
    }

}
