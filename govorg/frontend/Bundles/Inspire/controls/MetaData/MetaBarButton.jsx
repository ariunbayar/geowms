import {Control} from 'ol/control'


export class MetaBarButton extends Control {

    constructor(opt_options) {

        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })


        const cssClasses = '⚙-toggle-meta'
        const element = this.element
        element.className = cssClasses
        const elementa = document.createElement('a')
        elementa.setAttribute('data-toggle', 'tooltip')
        elementa.setAttribute('data-placement', 'right')
        elementa.setAttribute('title', 'Мета дата нэмэх')
        elementa.setAttribute('href', '#')
        element.setAttribute('id', '⚙-toggle-form-id')

        const elementi = document.createElement('i')
        elementi.setAttribute('aria-hidden', 'true')
        elementi.className = 'fa fa-database text-white'
        elementa.appendChild(elementi)

        element.addEventListener('click', (event) => {
            event.preventDefault()
            options.MetaButton()
        })
        element.appendChild(elementa)

    }
}
