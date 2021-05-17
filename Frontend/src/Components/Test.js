import React, { Component } from 'react';
import { connect } from 'react-redux';
import { testOne } from '../Redux/Test/actions';

export class Test extends Component {
	componentDidMount = () => {
		this.props.testOne();
	};
	render() {
		return <div>This is a test</div>;
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		testOne: () => dispatch(testOne()),
	};
};

export default connect(null, mapDispatchToProps)(Test);
