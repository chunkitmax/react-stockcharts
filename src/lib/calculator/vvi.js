

import { sum, mean } from "d3-array";

import { slidingWindow } from "../utils";
import { vvi as defaultOptions } from "./defaultOptionsForComputation";
import ema from "react-stockcharts/lib/calculator/ema";

export default function() {

	let options = defaultOptions;

	function calculator(data) {
		const { windowSize, emaWindowSize } = options;

    const emaAlgorithm = values => {
        const vmPlus = ema().options({ windowSize: emaWindowSize, sourcePath: 'vmPlus' })(values),
              vmMinus = ema().options({ windowSize: emaWindowSize, sourcePath: 'vmMinus' })(values)
        return vmPlus.map((vp, i) => ({
          vmPlus: vp - 1.,
          vmMinus: vmMinus[i] - 1.
        }))
      };

		const vviAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator((values) => {

				const sumTrueRange = sum(values, d => d.trueRange);
				const sumVmUp = sum(values, d => d.vmUp);
				const sumVmDown = sum(values, d => d.vmDown);

				return {
					vmPlus: sumVmUp / sumTrueRange,
					vmMinus: sumVmDown / sumTrueRange,
				};
			});

		const setupCalculator = slidingWindow()
			.windowSize(2)
			.undefinedValue(() => [
				{ close: 0, high: 0, low: 0 },
				{ close: 0, high: 0, low: 0 }
			]).accumulator(tuple => {
				const prev = tuple[0];
				const cur = tuple[1];
				return {
					trueRange: Math.max(
						cur.high - cur.low,
						Math.abs(cur.low - prev.close),
						Math.abs(cur.high - prev.close)
					)*cur.volume,
					vmUp: Math.abs(cur.high - prev.low)*cur.volume,
					vmDown: Math.abs(cur.low - prev.high)*cur.volume
				};
      });

		return emaAlgorithm(vviAlgorithm(setupCalculator(data)));
	}
	calculator.undefinedLength = function() {
		const { windowSize } = options;

		return windowSize - 1;
	};
	calculator.options = function(x) {
		if (!arguments.length) {
			return options;
		}
		options = { ...defaultOptions, ...x };
		return calculator;
	};

	return calculator;
}
