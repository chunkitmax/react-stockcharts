

import React, { Component } from "react";
import PropTypes from "prop-types";

import { isDefined, isNotDefined, noop } from "../utils";
import {
	terminate,
	saveNodeType,
	isHoverForInteractiveType,
} from "./utils";
import EachSpeedResistanceLine from "./wrapper/EachSpeedResistanceLine";
import MouseLocationIndicator from "./components/MouseLocationIndicator";
import HoverTextNearMouse from "./components/HoverTextNearMouse";

class SpeedResistanceLine extends Component {
	constructor(props) {
		super(props);

		this.handleStart = this.handleStart.bind(this);
		this.handleEnd = this.handleEnd.bind(this);
		this.handleDrawSrl = this.handleDrawSrl.bind(this);
		this.handleDragSrl = this.handleDragSrl.bind(this);
		this.handleDragSrlComplete = this.handleDragSrlComplete.bind(this);

		this.terminate = terminate.bind(this);
		this.saveNodeType = saveNodeType.bind(this);

		this.getSelectionState = isHoverForInteractiveType("srls")
			.bind(this);

		this.nodes = [];
		this.state = {};
	}
	handleDragSrl(index, newXYValue) {
		this.setState({
			override: {
				index,
				...newXYValue
			}
		});
	}
	handleDragSrlComplete(moreProps) {
		const { override } = this.state;
		const { srls } = this.props;

		if (isDefined(override)) {
			const { index, ...rest } = override;
			const newsrls = srls
				.map((each, idx) => idx === index
					? { ...each, ...rest, selected: true }
					: each);
			this.setState({
				override: null,
			}, () => {
				this.props.onComplete(newsrls, moreProps);
			});
		}
	}
	handleDrawSrl(xyValue) {
		const { current } = this.state;

		if (isDefined(current) && isDefined(current.startXY)) {
			this.mouseMoved = true;

			this.setState({
				current: {
					startXY: current.startXY,
					endXY: xyValue,
				}
			});
		}
	}
	handleStart(xyValue) {
		const { current } = this.state;

		if (isNotDefined(current) || isNotDefined(current.startXY)) {
			this.mouseMoved = false;

			this.setState({
				current: {
					startXY: xyValue,
					endXY: null,
				}
			}, () => {
				this.props.onStart();
			});
		}
	}
	handleEnd(xyValyue, moreProps, e) {
		const { current } = this.state;
		const { srls, appearance } = this.props;

		if (this.mouseMoved
			&& isDefined(current)
			&& isDefined(current.startXY)
		) {
			const newsrls = [
				...srls.map(d => ({ ...d, selected: false })),
				{ ...current, selected: true, appearance }
			];
			this.setState({
				current: null,
			}, () => {
				this.props.onComplete(newsrls, moreProps, e);
			});
		}
	}
	render() {
		const { enabled, appearance } = this.props;
		const { currentPositionRadius, currentPositionStroke } = this.props;
		const { currentPositionOpacity, currentPositionStrokeWidth } = this.props;
		const { hoverText, srls } = this.props;
		const { current, override } = this.state;
		const overrideIndex = isDefined(override) ? override.index : null;

		const tempChannel = isDefined(current) && isDefined(current.endXY)
			? <EachSpeedResistanceLine
				interactive={false}
				{...current}
				appearance={appearance}
				hoverText={hoverText}
			/>
			: null;

		return <g>
			{srls.map((each, idx) => {
				const eachAppearance = isDefined(each.appearance)
					? { ...appearance, ...each.appearance }
					: appearance;

				return <EachSpeedResistanceLine key={idx}
					ref={this.saveNodeType(idx)}
					index={idx}
					selected={each.selected}
					{...(idx === overrideIndex ? override : each)}
					appearance={eachAppearance}
					hoverText={hoverText}
					onDrag={this.handleDragSrl}
					onDragComplete={this.handleDragSrlComplete}
				/>;
			})}
			{tempChannel}
			<MouseLocationIndicator
				enabled={enabled}
				snap={false}
				r={currentPositionRadius}
				stroke={currentPositionStroke}
				opacity={currentPositionOpacity}
				strokeWidth={currentPositionStrokeWidth}
				onMouseDown={this.handleStart}
				onClick={this.handleEnd}
				onMouseMove={this.handleDrawSrl}
			/>
		</g>;
	}
}


SpeedResistanceLine.propTypes = {
	enabled: PropTypes.bool.isRequired,

	onStart: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired,
	onSelect: PropTypes.func,

	currentPositionStroke: PropTypes.string,
	currentPositionStrokeWidth: PropTypes.number,
	currentPositionOpacity: PropTypes.number,
	currentPositionRadius: PropTypes.number,

	appearance: PropTypes.shape({
		stroke: PropTypes.string.isRequired,
		strokeOpacity: PropTypes.number.isRequired,
		fillOpacity: PropTypes.number.isRequired,
		strokeWidth: PropTypes.number.isRequired,
		edgeStroke: PropTypes.string.isRequired,
		edgeFill: PropTypes.string.isRequired,
		edgeStrokeWidth: PropTypes.number.isRequired,
		r: PropTypes.number.isRequired,
		fill: PropTypes.arrayOf(PropTypes.string).isRequired,
		fontFamily: PropTypes.string.isRequired,
		fontSize: PropTypes.number.isRequired,
		fontFill: PropTypes.string.isRequired,
	}).isRequired,
	hoverText: PropTypes.object.isRequired,

	srls: PropTypes.array.isRequired,
};

SpeedResistanceLine.defaultProps = {
	appearance: {
		stroke: "#000000",
		fillOpacity: 0.2,
		strokeOpacity: 0.8,
		strokeWidth: 1,
		edgeStroke: "#000000",
		edgeFill: "#FFFFFF",
		edgeStrokeWidth: 1,
		r: 5,
		fill: [
			"#e41a1c",
			"#377eb8",
			"#4daf4a",
			"#984ea3",
			"#ff7f00",
			"#ffff33",
			"#a65628",
			"#f781bf",
		],
		fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
		fontSize: 12,
		fontFill: "#000000",
	},

	onStart: noop,
	onComplete: noop,
	onSelect: noop,

	currentPositionStroke: "#000000",
	currentPositionOpacity: 1,
	currentPositionStrokeWidth: 3,
	currentPositionRadius: 4,

	hoverText: {
		...HoverTextNearMouse.defaultProps,
		enable: true,
		bgHeight: 18,
		bgWidth: 120,
		text: "Click to select object",
	},
	srls: [],
};

export default SpeedResistanceLine;
