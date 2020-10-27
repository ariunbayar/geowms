import {Control} from 'ol/control'


export class FormBarButton extends Control {

    constructor(opt_options) {

        const options = opt_options || {}
        super({
            element: document.createElement('div'),
            target: options.target,
        })


        const cssClasses = '⚙-toggle-form'
        const element = this.element
        element.className = cssClasses
        const elementa = document.createElement('a')
        elementa.setAttribute('data-toggle', 'tooltip')
        elementa.setAttribute('data-placement', 'right')
        elementa.setAttribute('title', 'Бусад датаг засах')
        elementa.setAttribute('href', '#')
        element.setAttribute('id', '⚙-toggle-form-id')

        const elementi = document.createElement('i')
        elementi.setAttribute('aria-hidden', 'true')
        elementi.className = 'fa fa-wpforms text-white'
        elementa.appendChild(elementi)

        element.addEventListener('click', (event) => {
            event.preventDefault()
            options.FormButton()
        })
        element.appendChild(elementa)

    }
}
