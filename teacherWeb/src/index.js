import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Provider} from 'react-redux'
import store from './store'

import StRoute from './route/StRoute'

ReactDOM.render(
	<Provider store={store}>
		<StRoute/>
	</Provider>,
	document.getElementById('root')
);
