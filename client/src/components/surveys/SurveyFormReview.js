import React, { Component } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';
import * as actions from '../../actions/index'

class SurveyFormReview extends Component {
    renderReview(formValue){
        return (
            formFields.map(({name, label}) =>(
            <div key={name}>
                <label>{label}</label>
                <div>{formValue[name]}</div>
            </div>
            )) 
        )
    }
    render(){
        const { onCancel, formValues, submitSurvey, history} = this.props;
        return(
            <div>
                <h5>Please confirm your entries.</h5>
                {this.renderReview(formValues)}
                <button className='yellow darken-3 btn-flat left'
                    onClick={onCancel}
                >
                    Back
                </button>
                <button 
                    className='green text-white btn-flat right'
                    onClick={() => submitSurvey(formValues, history)}
                    >
                    Send Survey
                    <i className='material-icons right'>email</i>
                </button>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        formValues:  state.form.surveyForm.values
    }
}

export default connect(mapStateToProps, actions)(withRouter(SurveyFormReview))