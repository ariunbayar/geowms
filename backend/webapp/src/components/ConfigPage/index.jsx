import React, { Component } from 'react'
import {Switch, Route} from 'react-router-dom'

import {ConfigList} from './ConfigList'
import {ConfigForm} from './ConfigForm'


export class ConfigPage extends Component {

    render() {
        return (
            <Switch>
                <Route exact path={"/back/тохиргоо/"} component={ConfigList}/>
                <Route exact path={"/back/тохиргоо/үүсгэх/"} component={ConfigForm}/>
                <Route exact path={"/back/тохиргоо/:id/засах/"} component={ConfigForm}/>
            </Switch>
        )
    }

}
