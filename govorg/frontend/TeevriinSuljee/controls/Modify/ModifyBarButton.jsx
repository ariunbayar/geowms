import {Control} from 'ol/control'


export class ModifyBarButton extends Control {

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
        elementi.innerText = 'Modify'
        elementa.appendChild(elementi)

        element.addEventListener('click', (event) => {
            event.preventDefault()
            options.ModifyButton()
        })
        element.appendChild(elementa)

    }
}
