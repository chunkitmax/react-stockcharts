

import { sum } from "d3-array";

import { isDefined, last, slidingWindow, path } from "../utils";
import { VI as defaultOptions } from "./defaultOptionsForComputation";

export default function() {

	let options = defaultOptions;

	function calculator(data) {
		const { windowSize } = options;

		const viAlgorithm = slidingWindow()
			.windowSize(windowSize)
			.accumulator((values) => {

        const sumTrueRange = sum(values, d => d.trueRange)
        const sumVmUp = sum(values, d => d.vmUp)
        const sumVmDown = sum(values, d => d.vmDown)

				return {
          vmPlus: sumVmUp/sumTrueRange,
          vmMinus: sumVmDown/sumTrueRange,
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
          cur.high-cur.low,
          Math.abs(cur.low-prev.close),
          Math.abs(cur.high-prev.close)
        ),
        vmUp: Math.abs(cur.high-prev.low),
        vmDown: Math.abs(cur.low-prev.high)
      }
    })

		const viData = viAlgorithm(setupCalculator(data));

		return viData;
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
