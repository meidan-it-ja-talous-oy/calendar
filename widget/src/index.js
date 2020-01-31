import React from 'react';
import ReactDOM from 'react-dom';
import EventList from './Widgets/EventList';
import WeeklyView from './Widgets/WeeklyView';

export function renderEventsList(elementId, config, lang) {
	const application = <EventList config={config} lang={lang} />;
	ReactDOM.render(application, document.getElementById(elementId));
}

export function renderWeeklyView(elementId, config, lang) {
	const application = <WeeklyView config={config} lang={lang} />;
	ReactDOM.render(application, document.getElementById(elementId));
}