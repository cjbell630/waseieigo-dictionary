export function processData(word, entry) {

    console.log(`processing ${word}`)
    let data = {};
    let allTerms = Object.values(entry.facets).flatMap(
        (facetRegions) => {
            return facetRegions.flatMap(regionInfo => {
                return regionInfo.terms
            })
        }
    );
    console.log(allTerms)
    let generalTerm = entry.facets.general?.terms?.join(", ") ?? undefined;
    let originTerm = entry.origins[0].source;
    let originFlag; // TODO
    let originEval = originTerm === generalTerm ? "best" : allTerms.includes(originTerm) ? "good" : "bad";
    let correctionNeeded = !["good", "best"].includes(originEval);
    let correction, correctionEval, correctionFlag;
    if (correctionNeeded) {
        if (generalTerm === undefined) {
            correction = allTerms[1]; // TODO maybe wont always work
            console.log(`correction thingy: ${allTerms}`)
            correctionEval = "good"; // TODO is this right?
            // TODO flag
        } else {
            correction = generalTerm;
            correctionEval = "best";
            // TODO flag
        }
    }
    console.log(allTerms);
    console.log(`generalTerm: ${generalTerm}`);
    console.log(`done processing ${word}`)
    return {
        allTerms,
        generalTerm,
        originTerm,
        originEval,
        correctionNeeded,
        correction,
        correctionEval,
    };
}