import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from "i18next";
var dateFormat = require('dateformat');


const resources = {
	en: {
	 translation: {
	   "read_more": "Read more"
	 }
	},
	fi: {
	 translation: {
	   "read_more": "Lue lisää"
	 }
	}
};

const StyledContainer = styled.div`
	.startEnd {
	   color: #000;
	   margin-bottom: 15px;
	}
	label {
		font-size: 24px;
		color: #000;
		margin-bottom: 15px;
	}
	.location {
	   color: #000;
	}
	.description {
		color: #000;
	}
`;

class EventModal extends Component {

    constructor(props) {
        super(props);
        const languageProp = this.props.langKey;
        i18n.init({
      	  resources,
      	  lng: languageProp
      	});
    }

    render() {
    	if(this.props.name === undefined) {
    		return;
    	}
        return (
            <StyledContainer className="customModal">
            	<div className="startEnd">{dateFormat(new Date(this.props.eventStart), "dd.mm.yyyy HH.MM")}</div>
            	<a href={this.props.link}><label>{this.props.name}</label></a>
            	<div className="location">{this.props.location}</div>
            	<div className="description" dangerouslySetInnerHTML={{__html: this.props.description}}></div>
            </StyledContainer>
        )
    }
}

EventModal.propTypes = {
		eventStart: PropTypes.string,
		eventEnd: PropTypes.string,
		uid: PropTypes.string,
		name: PropTypes.string,
		link: PropTypes.string,
		description: PropTypes.string,
		location: PropTypes.string
};

export { EventModal };
