import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "../routes";
import Holder from "./Holder";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../static/assets/css/style.css";
import "../../static/assets/css/display.css";
import "../../static/assets/css/forms.css";
import "../../static/assets/css/buttons.css";
import "../../static/assets/vendor/font-awesome/css/font-awesome.css";
import "../../static/assets/vendor/font-awesome/css/font-awesome.min.css";
import "../../static/assets/vendor/modal-video/css/modal-video.min.css";
import "../../static/assets/vendor/owl.carousel/assets/owl.carousel.css";
import "../../static/assets/vendor/owl.carousel/assets/owl.carousel.min.css";
import "../../static/assets/vendor/owl.carousel/assets/owl.theme.default.css";
import "../../static/assets/vendor/owl.carousel/assets/owl.theme.default.min.css";
import "../../static/assets/vendor/owl.carousel/assets/owl.theme.green.css";
import "../../static/assets/vendor/owl.carousel/assets/owl.theme.green.min.css";
import "../../static/assets/vendor/split/split.css";

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
