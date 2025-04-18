export function processData(word, entry) {
    console.log(`processing ${word}`)
    let printKatakana = word.split('-')[0];
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
    let originTerm, originMeaning,originFlags, originEval;
    if (entry.direct) { // if the direct translation is included
        originTerm = entry.direct.word;
        originFlags = [];
        originEval = "bad";
        originMeaning = entry.direct.meaning;
    } else {
        originTerm = entry.origins[0].source;
        originFlags = entry.origins[0].language === "" ? [] : [entry.origins[0].language];
        originEval = originTerm === generalTerm ? "best" : allTerms.includes(originTerm) ? "good" : "bad";
    }


    let correctionNeeded = !["good", "best"].includes(originEval);
    let correction, correctionEval;
    let correctionFlags = [];
    if (correctionNeeded) {
        if (generalTerm === undefined) {
            correction = allTerms[1]; // TODO maybe wont always work
            console.log(`correction thingy: ${allTerms}`)
            correctionEval = "good"; // TODO is this right?
            // TODO flag
        } else {
            correction = generalTerm;
            if (entry.facets.general[0].regions?.length > 0) {
                correctionFlags = entry.facets.general[0].regions;
                correctionEval = "good";
            } else {
                correctionEval = "best";
            }
        }
    }
    let hasNotes = entry.notes.length > 0;
    let hasSources = entry.sources && Object.values(entry.sources).length > 0;
    console.log(`done processing ${word}`)
    return {
        printKatakana,
        aliasString,
        numDistinctTerms,
        allTerms,
        generalTerm,
        originTerm,
        originMeaning,
        originFlags,
        originEval,
        correctionNeeded,
        correction,
        correctionFlags,
        correctionEval,
        hasNotes,
        hasSources
    };
}