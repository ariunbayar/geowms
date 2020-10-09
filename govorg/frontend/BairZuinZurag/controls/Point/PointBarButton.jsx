import {Control} from 'ol/control'


export class PointBarButton extends Control {

    constructor(opt_options) {

        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })


        const cssClasses = '⚙-toggle-search'
        const element = this.element
        element.className = cssClasses
        const elementa = document.createElement('a')
        elementa.setAttribute('href', '#')

        const elementi = document.createElement('i')
        elementi.setAttribute('aria-hidden', 'true')
        elementi.className = 'fa fa-circle-o gp-text-primary fa-2x'
        elementa.appendChild(elementi)

        element.addEventListener('click', (event) => {
            event.preventDefault()
            options.PointButton()
        })
        element.appendChild(elementa)

    }
}
