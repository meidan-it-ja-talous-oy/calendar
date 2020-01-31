import axios from 'axios';
import { Component } from 'react';

const BASE_URL = 'http://localhost:3000/';

export class EventService extends Component {

    constructor(){
        super();
    }
    
    fetchEvents(config, scope) {
    	var CONTEXT_URL = "events/";
    	if(scope == "week") {
    		CONTEXT_URL = "weekevents/";
    	}
    	return new Promise((resolve, reject) => {
            axios
                .get(BASE_URL+CONTEXT_URL+config)
                .then(response => {
                    if (response.data) {
                        resolve({
                            data: response.data
                        });
                    } else {
                        reject('No results for query: ' + query);
                    }
                })
                .catch(error => reject(error.message));
        });
    }
    
    fetchEventsWeekly(config) {
    	return new Promise((resolve, reject) => {
            axios
                .get(BASE_URL+'events/week/'+config)
                .then(response => {
                    if (response.data) {
                        resolve({
                            data: response.data
                        });
                    } else {
                        reject('No results for query: ' + query);
                    }
                })
                .catch(error => reject(error.message));
        });
    }

}