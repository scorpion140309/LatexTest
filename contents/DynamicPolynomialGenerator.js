// Parse coefficient string to number/fraction with LaTeX
function ParseCoefficient_(aCoef) {
	aCoef = aCoef.trim();
	if (!aCoef) return NaN;

	if (aCoef.includes("/")) {
		const parts = aCoef.split("/");
		if (parts.length === 2) {
			const num = Number(parts[0]);
			const denom = Number(parts[1]);
			if (!isNaN(num) && !isNaN(denom) && denom !== 0) {
				return { value: num / denom, latex: `\\frac{${Math.abs(num)}}{${Math.abs(denom)}}` };
			}
		}
	}

	const val = Number(aCoef);
	if (!isNaN(val)) {
		return { value: val, latex: Math.abs(val).toString() };
	}

	return NaN;
}

// Generate 1-variable polynomial LaTeX, high-degree first
function mjGeneratePolynomial(aVariable, aCoeffStrings) {
	let terms = [];
	const n = aCoeffStrings.length;

	for (let i = 0; i < n; i++) {
		const parsed = ParseCoefficient_(aCoeffStrings[i]);
		if (!parsed || parsed.value === 0) continue;

		const c = parsed.value;
		const latexCoef = parsed.latex;

		let term = "";
		const degree = n - 1 - i; // highest degree first

		if (degree === 0) {
			term = latexCoef; // constant term
		} else {
			if (Math.abs(c) !== 1) term += latexCoef; // coefficient
			term += aVariable;
			if (degree > 1) term += `^{${degree}}`;
		}

		terms.push({ sign: c < 0 ? "-" : "+", term: term });
	}

	if (terms.length === 0) return "0";

	let result = terms[0].sign === "-" ? "-" : "";
	result += terms[0].term;

	for (let i = 1; i < terms.length; i++) {
		result += ` ${terms[i].sign} ${terms[i].term}`;
	}

	return result;
}

