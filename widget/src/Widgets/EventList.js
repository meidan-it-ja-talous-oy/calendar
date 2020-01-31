import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {EventsList} from '../Components/EventsList';
import {EventService} from '../Services/EventService';
import PropTypes from 'prop-types';
import ReactLoading from 'react-loading';

const eventService = new EventService();

class EventList extends Component {

	constructor(props) {
		super(props);
	    const configJson = JSON.parse(this.props.config);
	    var langSetting = "en";
	    if(this.props.lang != null){
	    	langSetting = this.props.lang;
	    }
	    this.state = {
	    	value: '',
	    	data: [],
	    	loading: true,
	    	config: configJson,
	    	lang: langSetting
	    }
	    this.loadEvents();
	 }
	
	mergeAndSort(data) {
		var events = [];
		data.forEach(function(obj) { 
			obj.data.items.forEach(function(singleEvent){
				events.push({start: singleEvent.start.dateTime, end: singleEvent.end.dateTime, name: singleEvent.summary, description: singleEvent.description, location: singleEvent.location, link: singleEvent.htmlLink});
			});
		});
		events.sort(function compare(a,b) {
			return new Date(a.start).getTime() - new Date(b.start).getTime();
		});
		return events;
	}
	
	loadEvents() {
		eventService.fetchEvents(this.state.config.emails, this.state.config.scope)
		   .then(results => {
		       if(results.data) {
		           this.setState({
		               data: this.mergeAndSort(results.data),
		               loading: false
		           });
		       }
		   })
		   .catch(error => {
		       this.setState({
		           data: [],
		           loading: false
		       });
		   });
	}
	
	 render () {
		const loading = this.state.loading;
		const languageKey = this.state.lang;
	    return (
	    		<div className="eventsContainer">
		      	{loading ? (
		      	     <div className="loader">
		      	     	<ReactLoading type={'spinningBubbles'} color={'pink'} height={'80px'} width={'80px'} />
				      </div>
			      	) : (
					    <div className="results">
					       <EventsList data={this.state.data} langKey={languageKey} limit={this.state.config.limit} />
					    </div>
			        )
		        }
		      </div>
	    )
	  }

}

EventList.propTypes = {
    contact: PropTypes.object,
    lang: PropTypes.string
};

export default EventList;
