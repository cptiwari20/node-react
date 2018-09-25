import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
    componentDidMount (){
        this.props.fetchSurveys()
    };
    renderSurvey(){
        return this.props.surveys.reverse().map(survey => {
            return (
                <div className='card darken-2' key={survey._id}>
                    <div className="card-content">
                        <span className='card-title'>{survey.title}</span>
                        <p>
                            {survey.body}
                        </p>
                        <p className='right'>
                            Sent On: {new Date(survey.sentDate).toLocaleDateString()}
                        </p>
                        </div>
                        <div className='card-action'>
                            <a>Yes: {survey.yes}</a>
                            <a>No: {survey.no} </a>
                        </div>
                </div>
            )
        })
    }
    render(){
        return(
            <div>
                {this.renderSurvey()}
            </div>
        )
    }
};

function mapStateToProps ({surveys}) {
    return { surveys };
};

export default connect(mapStateToProps, { fetchSurveys })(SurveyList)