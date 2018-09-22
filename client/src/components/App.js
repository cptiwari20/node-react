import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions'

import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import SurveyNew from './surveys/SurveyNew'

class App extends Component {
    componentDidMount(){
        this.props.fetchUser()
    }
    render(){
        return (
            <BrowserRouter>
                <div className="container">
                    <Header />
                    <Switch>
                        <Route path='/surveys/new' component={SurveyNew} />
                        <Route path='/surveys' component={Dashboard} />
                        <Route path='/' component={Landing} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}


export default connect(null, actions)(App);