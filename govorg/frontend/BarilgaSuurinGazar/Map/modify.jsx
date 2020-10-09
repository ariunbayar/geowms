import React, {Component} from 'react'
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

export class ModifySet extends Component {

    constructor(opt_options)
        ExampleModify(){
            const init = () => {
            const select = new Select();
            this.map.addInteraction(select);
            select.on("select", event => this.featureSelected(event));
            const modify = new Modify({
                features: select.getFeatures(),
            })
            modify.on("modifyend", event => this.modifiedFea(event));
            this.map.addInteraction(modify);
            this.select = select
            this.modify = modify
            this.modifyE.setEvents()
            }
            const setEvents = () => {
            var selectedFeatures = this.select.getFeatures();
            this.select.on('change:active', function () {
                selectedFeatures.forEach(function (each) {
                selectedFeatures.remove(each);
                });
            });
            }
            const setActive = (active) => {
            this.select.setActive(active);
            this.modify.setActive(active);
            }
            return { funct: init, setEvents: setEvents, setActive: setActive }
        }
    }
