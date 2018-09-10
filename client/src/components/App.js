import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions'

import Header from './Header';
import Landing from './Landing';
const Survey = () => <h2>Survey Page</h2>


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
                        <Route path='/surveys' component={Survey} />
                        <Route path='/' component={Landing} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}


export default connect(null, actions)(App);