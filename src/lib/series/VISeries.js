

import React, { Component } from "react";
import PropTypes from "prop-types";

import BarSeries from "./BarSeries";
import LineSeries from "./LineSeries";

class VISeries extends Component {
	constructor(props) {
		super(props);
		this.yAccessorForvmPlus = this.yAccessorForvmPlus.bind(this);
		this.yAccessorForvmMinus = this.yAccessorForvmMinus.bind(this);
	}
	yAccessorForvmPlus(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).vmPlus;
	}
	yAccessorForvmMinus(d) {
		const { yAccessor } = this.props;
		return yAccessor(d) && yAccessor(d).vmMinus;
	}
	render() {
		const { className } = this.props;
		const { stroke } = this.props;

		return (
			<g className={className}>
				<LineSeries
					yAccessor={this.yAccessorForvmPlus}
					stroke={stroke.vmPlus}
					fill="none" />
				<LineSeries
					yAccessor={this.yAccessorForvmMinus}
					stroke={stroke.vmMinus}
					fill="none" />
			</g>
		);
	}
}

VISeries.propTypes = {
	className: PropTypes.string,
	yAccessor: PropTypes.func.isRequired,
	stroke: PropTypes.shape({
		vmPlus: PropTypes.string.isRequired,
		vmMinus: PropTypes.string.isRequired,
	}).isRequired,
	widthRatio: PropTypes.number,
	width: BarSeries.propTypes.width,
};

VISeries.defaultProps = {
	className: "react-stockcharts-vi-series",
	widthRatio: 0.5,
	width: BarSeries.defaultProps.width,
};

export default VISeries;
