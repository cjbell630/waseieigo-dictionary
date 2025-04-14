export function processData(word, entry) {
    console.log(`processing ${word}`)
    let aliasString = entry.aliases?.length > 0 ? ` (${entry.aliases.join(", ")})` : "" ?? "";
    let numDistinctTerms = 0;
    let allTerms = Object.values(entry.facets).flatMap(
        (facetRegions) => {
            numDistinctTerms++;
            return facetRegions.flatMap(regionInfo => {
                return regionInfo.terms
            })
        }
    );
    console.log(allTerms)
    let generalTerm = entry.facets.general?.at(0)?.terms?.join(", ") ?? undefined;
    let originTerm = entry.origins[0].source;
    let originFlag = entry.origins[0].language === "" ? undefined : entry.origins[0].language;
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
            correctionFlag = entry.facets.general[0].region;
            correctionEval = correctionFlag === undefined ? "best" : "good";
        }
    }
    let hasNotes = entry.notes.length > 0;
    let hasSources = Object.values(entry.notes).length > 0;
    console.log(`done processing ${word}`)
    return {
        aliasString,
        numDistinctTerms,
        allTerms,
        generalTerm,
        originTerm,
        originFlag,
        originEval,
        correctionNeeded,
        correction,
        correctionFlag,
        correctionEval,
        hasNotes,
        hasSources
    };
}