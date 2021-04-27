import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BaseRouter from './BaseRouter';
import Holder from './Components/Holder';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/style.css';
import './assets/css/forms.css';
import './assets/css/buttons.css';
import './assets/vendor/font-awesome/css/font-awesome.css';
import './assets/vendor/font-awesome/css/font-awesome.css.map';
import './assets/vendor/font-awesome/css/font-awesome.min.css';
import './assets/vendor/modal-video/css/modal-video.min.css';
import './assets/vendor/owl.carousel/assets/owl.carousel.css';
import './assets/vendor/owl.carousel/assets/owl.carousel.min.css';
import './assets/vendor/owl.carousel/assets/owl.theme.default.css';
import './assets/vendor/owl.carousel/assets/owl.theme.default.min.css';
import './assets/vendor/owl.carousel/assets/owl.theme.green.css';
import './assets/vendor/owl.carousel/assets/owl.theme.green.min.css';
import './App.css';
import 'antd/dist/antd.css';

export class App extends Component {
	render() {
		return (
			<Router>
				<Holder>
					<BaseRouter />
				</Holder>
			</Router>
		);
	}
}

export default App;
