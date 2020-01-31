import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from "i18next";
var dateFormat = require('dateformat');


const resources = {
	en: {
	 translation: {
	   "event_calendar": "Events",
	   "today": "Today",
	   "next": "Next"
	 }
	},
	fi: {
	 translation: {
	   "event_calendar": "Tapahtumakalenteri",
	   "today": "Juuri nyt",
	   "next": "Seuraavaksi"
	 }
	}
};

const StyledContainer = styled.div`
	border-bottom: 1px solid #000;
	margin-bottom: 15px;
	.start, .end {
	    display: inline-block;
	}
	.additionalInformation {
		padding-bottom: 5px;
	}
	.eventTitle {
		margin-top: 0px;
		padding-top: 0px;
	}
`;

class EventsList extends Component {

    constructor(props) {
        super(props);
        const languageProp = this.props.langKey;
        i18n.init({
      	  resources,
      	  lng: languageProp
      	});
    }

    render() {
        const calendar = this.props.data;
        let limit = parseInt(this.props.limit);
        if(limit == "") {
        	limit = 100;
        }
        let addTitle = false;
        let titleAdded = false;
        let addFutureTitle = false;
        let futureTitleAdded = false;
        return (
            <div className="eventsInnerContainer">
            	<h2 className="title">{i18n.t('event_calendar')}</h2>
            	{calendar.map(function(event, index){
            		if(index > limit) {
            			return;
            		}
            		if(titleAdded){
            			addTitle = false;
            		} 
            		if(futureTitleAdded){
            			addFutureTitle = false;
            		}
            		if(new Date(event.start).setHours(0,0,0,0) == new Date().setHours(0,0,0,0) && !addTitle && !titleAdded) {
                    	addTitle = true;
                    	titleAdded = true;
                    } else if (new Date(event.start).setHours(0,0,0,0) > new Date().setHours(0,0,0,0) && !addFutureTitle && !futureTitleAdded) {
                    	addFutureTitle = true;
                    	futureTitleAdded = true;
                    }
            		return (
	            		<div>
		            		{addTitle && <h3 className="title">{i18n.t('today')}</h3>}
		            		{addFutureTitle && <h3 className="title">{i18n.t('next')}</h3>}
		                    <StyledContainer key={ index } className="singleRow">
		                    	<div className="start">{dateFormat(event.start, "dd.mm.yyyy HH.MM")}</div>
		                    	<h4 className="eventTitle"><a href={event.link} target="_blank">{event.name}</a></h4>
		                    	<div className="location additionalInformation">{event.location}</div>
		                    </StyledContainer>
	                    </div>
                    );
                })}
            </div>
        )
    }
}

EventsList.propTypes = {
    data: PropTypes.string,
    langKey: PropTypes.string,
    limit: PropTypes.number
};

export { EventsList };
