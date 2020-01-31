import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {EventService} from '../Services/EventService';
import {EventModal} from '../Components/EventModal';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';
import moment from 'moment';
import styled from 'styled-components';
import WeekCalendar from 'react-week-calendar';

const eventService = new EventService();

class WeeklyView extends Component {

	constructor(props) {
		super(props);
	    const configJson = JSON.parse(this.props.config);
	    var langSetting = "en";
	    if(this.props.lang != null){
	    	langSetting = this.props.lang;
	    }
	    this.state = {
	    	value: '',
	    	lastUid: 0,
	    	selectedIntervals: [],
	    	eventLinks: [],
	    	loading: true,
	    	config: configJson,
	    	lang: langSetting
	    }
	    this.loadEvents();
	    
	 }
	
	mergeAndForm(data) {
		var events = [];
		var links = [];
		data.forEach(function(obj) { 
			obj.data.items.forEach(function(singleEvent){
				var start = new Date(singleEvent.start.dateTime);
				var end = new Date(singleEvent.end.dateTime);
				events.push(
						{
							value: singleEvent.summary, 
							start: moment(start),
							end: moment(end),
							uid: events.length,
							name: singleEvent.summary,
							link: singleEvent.htmlLink,
							description: singleEvent.description,
							location: singleEvent.location,
							eventStart: start.toISOString(),
							eventEnd: end.toISOString()
						}
				);
				links.push({name: singleEvent.summary, link: singleEvent.htmlLink, description: singleEvent.description, location: singleEvent.location, start: start, end: end});
			});
		});
		this.setState({
			eventLinks: links,
			selectedIntervals: events,
			loading: false,
			lastUid: events.length
		});
		return events;
	}
	
	loadEvents() {
		eventService.fetchEventsWeekly(this.state.config.emails)
		   .then(results => {
		       if(results.data) {
		    	   const newData = this.mergeAndForm(results.data);
		       }
		   })
		   .catch(error => {
		       this.setState({
		    	   selectedIntervals: [],
		           loading: false
		       });
		   });
	}
	
	 render () {
		const loading = this.state.loading;
		const events = this.state.selectedIntervals;
		const languageKey = this.state.lang;
	    return (
	    		<div className="eventsContainer">
		      	{loading ? (
		      	     <div className="loader">
		      	     	<ReactLoading type={'spinningBubbles'} color={'pink'} height={'80px'} width={'80px'} />
				      </div>
			      	) : (
					    <WeeklyViewContainer className="results">
					    	<h2>Viikon tapahtumat</h2>
					    	<WeekCalendar
					    		firstDay = {moment().startOf('isoWeek')}
					        	startTime = {moment({h: 8, m: 0})}
					        	endTime = {moment({h: 19, m: 0})}
					        	numberOfDays= {5}
					    		selectedIntervals = {events}
					        	onEventClick = {this.onEventClick}
					    		dayFormat = {"DD.MM."}
					    		scaleUnit = {30}
					    		scaleFormat = {"HH.mm"}
					    		useModal = {true}
					    		modalComponent={EventModal}
					    		showModalCase={['edit']}
					    	/>
					    </WeeklyViewContainer>
			        )
		        }
		      </div>
	    )
	  }

}

WeeklyView.propTypes = {
    contact: PropTypes.object,
    lang: PropTypes.string
};

export default WeeklyView;


const WeeklyViewContainer = styled.div`
.weekCalendar {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-left: 125px;
    padding-top: 28px;
    color: #6b6b6b;
}
.weekCalendar * {
    box-sizing: border-box;
}
.weekCalendar__header {
    position: absolute;
    height: 28px;
    line-height: 28px;
    z-index: 10;
    top: 0;
    padding-left: 125px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
}
.weekCalendar__scaleHeader {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 15;
    width: 125px;
    height: 28px;
    background-color: #f7f7f7;
    border: 1px solid #b7b7b7;
    line-height: 28px;
    color: #6b6b6b;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
}
.weekCalendar__headerWrapper {
    height: 100%;
    border-top: 1px solid #b7b7b7;
    border-bottom: 1px solid #b7b7b7;
    background-color: #f7f7f7;
    color: #6b6b6b;
}
.weekCalendar__headerColumn {
    height: 100%;
    display: inline-block;
    border-right: 1px solid #b7b7b7;
}
.weekCalendar__scaleColumn {
    position: absolute;
    z-index: 9;
    left: 0;
    padding-top: 28px;
    width: 125px;
    border-right: 1px solid #b7b7b7;
    border-left: 1px solid #b7b7b7;
    text-align: center;
}
.weekCalendar__scaleCell {
    background-color: #fff;
    border-bottom: 1px solid #b7b7b7;
}
.weekCalendar__content {
    position: relative;
    width: auto;
    overflow: auto;
    max-height: 600px;
}
.weekCalendar__overlay {
    position: absolute;
}
.weekCalendar__overlay_status_selection {
    background-color: rgba(249, 105, 14, 0.2);
}
.weekCalendar__status_selection .weekCalendar__overlay {
    pointer-events: none;
}
.calendarBody {
    position: relative;
    display: table;
    table-layout: fixed;
    min-width: 100%;
}
.calendarBody__row {
    display: table-row;
}
.calendarBody__cell {
    background-color: #fff;
    border-bottom: 1px solid #b7b7b7;
}
.calendarBody__column {
    display: table-cell;
    border-right: 1px solid #b7b7b7;
    min-width: 100px;
}
.dayCell {
    width: 100%;
    height: 100%;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
.dayCell:hover {
    cursor: pointer;
    background-color: rgba(249, 105, 14, 0.4);
    border-color: #f9690e;
}
.event {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    color: #000;
    background-color: rgba(139, 195, 74);
    border-radius: 5px;
    border: 1px solid #000;
}
.calendarModal {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    padding: 100px;
    z-index: 100;
}
.calendarModal__backdrop {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
}
.calendarModal__content {
    position: relative;
    margin: auto;
    border: 1px solid #b7b7b7;
    background: #fff;
    padding: 10px;
    border-radius: 3px;
}
.customModal__text {
    text-align: center;
    margin-bottom: 5px;
    white-space: nowrap;
}
.customModal__input {
    margin-bottom: 10px;
    width: 100%;
}
.customModal__button {
    display: inline-block;
    padding: 3px 6px;
    color: #fff;
    border: 1px solid rgba(249, 105, 14, 0.8);
    margin-bottom: 5px;
    background-color: rgba(249, 105, 14, 0.8);
}
.customModal__button:hover,
.customModal__button:focus {
    cursor: pointer;
    background-color: rgba(249, 105, 14, 0.6);
}
.customModal__button_float_right {
    float: right;
}
.dayCell:hover {
    cursor: auto !important;
    background-color: #FFF;
}
.event {
    cursor: pointer;
}
`;
