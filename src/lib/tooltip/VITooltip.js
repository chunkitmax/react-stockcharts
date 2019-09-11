

import { format } from "d3-format";
import React, { Component } from "react";
import PropTypes from "prop-types";

import displayValuesFor from "./displayValuesFor";
import GenericChartComponent from "../GenericChartComponent";

import ToolTipText from "./ToolTipText";
import ToolTipTSpanLabel from "./ToolTipTSpanLabel";
import { functor } from "../utils";

class VITooltip extends Component {
	constructor(props) {
		super(props);
		this.renderSVG = this.renderSVG.bind(this);
	}
	renderSVG(moreProps) {
		const { onClick, fontFamily, fontSize, displayFormat, className } = this.props;
		const { yAccessor, options, appearance, labelFill } = this.props;
		const { displayValuesFor } = this.props;

		const { chartConfig: { width, height } } = moreProps;

		const currentItem = displayValuesFor(this.props, moreProps);
		const viValue = currentItem && yAccessor(currentItem);

		const vmPlus = (viValue && viValue.vmPlus && displayFormat(viValue.vmPlus)) || "n/a";
		const vmMinus = (viValue && viValue.vmMinus && displayFormat(viValue.vmMinus)) || "n/a";

		const { origin: originProp } = this.props;
		const origin = functor(originProp);
		const [x, y] = origin(width, height);

		return (
			<g className={className} transform={`translate(${ x }, ${ y })`} onClick={onClick}>
				<ToolTipText x={0} y={0}
					fontFamily={fontFamily} fontSize={fontSize}>
					<ToolTipTSpanLabel fill={labelFill}>{`VI (${options.windowSize}): `}</ToolTipTSpanLabel>
					<ToolTipTSpanLabel fill={labelFill}> Vm+ : </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.vmPlus}>{vmPlus}</tspan>
					<ToolTipTSpanLabel fill={labelFill}> Vm- : </ToolTipTSpanLabel>
					<tspan fill={appearance.stroke.vmMinus}>{vmMinus}</tspan>
				</ToolTipText>
			</g>
		);
	}
	render() {
		return <GenericChartComponent
			clip={false}
			svgDraw={this.renderSVG}
			drawOn={["mousemove"]}
		/>;
	}
}

VITooltip.propTypes = {
	origin: PropTypes.oneOfType([
		PropTypes.array,
		PropTypes.func
	]).isRequired,
	className: PropTypes.string,
	fontFamily: PropTypes.string,
	fontSize: PropTypes.number,
	labelFill: PropTypes.string,

	yAccessor: PropTypes.func.isRequired,
	options: PropTypes.shape({
		windowSize: PropTypes.number.isRequired,
	}).isRequired,
	appearance: PropTypes.shape({
		stroke: {
			vmPlus: PropTypes.string.isRequired,
			vmMinus: PropTypes.string.isRequired,
		}.isRequired
	}).isRequired,
	displayFormat: PropTypes.func.isRequired,
	displayValuesFor: PropTypes.func,
	onClick: PropTypes.func,
};

VITooltip.defaultProps = {
	origin: [0, 0],
	displayFormat: format(".3f"),
	displayValuesFor: displayValuesFor,
	className: "react-stockcharts-tooltip",
};

export default VITooltip;
// export default VITooltip;
