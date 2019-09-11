

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
		const { stroke, strokeWidth } = this.props;

		return (
			<g className={className}>
				<LineSeries
					yAccessor={this.yAccessorForvmPlus}
					stroke={stroke.vmPlus}
					strokeWidth={strokeWidth}
					fill="none" />
				<LineSeries
					yAccessor={this.yAccessorForvmMinus}
					stroke={stroke.vmMinus}
					strokeWidth={strokeWidth}
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
	strokeWidth: PropTypes.number
};

VISeries.defaultProps = {
	className: "react-stockcharts-vi-series",
	widthRatio: 0.5,
	strokeWidth: LineSeries.defaultProps.strokeWidth
};

export default VISeries;
