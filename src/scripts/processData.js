function getAllTermsOrigin(origin, facets) {
    let numDistinctTerms = 1;
    let originFlags = [];
    let originIsValid = false;
    let originIsGeneral = false;
    let allTerms = Object.entries(facets).flatMap(
        ([facetName, facetInfo]) => {
            return facetInfo.flatMap(regionInfo => {
                if (regionInfo.terms.includes(origin)) {
                    originFlags = regionInfo.regions ?? [];
                    originIsValid = true;
                    originIsGeneral = facetName === "general";
                } else {
                    numDistinctTerms++;
                }
                return regionInfo.terms
            })
        }
    );
    /*if (!allTerms.includes(origin)) {
        numDistinctTerms++;
    }*/
    return {allTerms, numDistinctTerms, originFlags, originIsValid, originIsGeneral};
}

function getAllTermsDirect(direct, facets) {
    let numDistinctTerms = 1;
    let allTerms = Object.values(facets).flatMap(
        (facetInfo) => {
            return facetInfo.flatMap(regionInfo => {
                if (!regionInfo.terms.includes(direct)) {
                    numDistinctTerms++;
                }
                return regionInfo.terms
            })
        }
    );
    /*
if (!allTerms.includes(direct)) {
numDistinctTerms++;
}*/
    return {allTerms, numDistinctTerms};
}

export function processData(word, entry) {
    console.log(`processing ${word}`)
    let printKatakana = word.split('-')[0];
    let aliasString = entry.aliases?.length > 0 ? ` (${entry.aliases.join(", ")})` : "" ?? "";

    let allTerms, numDistinctTerms, originTerm, originMeaning, originFlags, originEval;
    if (entry.direct) { // if the direct translation is included
        originTerm = entry.direct.word;
        ({
            allTerms, numDistinctTerms
        } = getAllTermsDirect(originTerm, entry.facets));
        originFlags = [];
        originEval = "bad";
        originMeaning = entry.direct.meaning;
    } else {
        originTerm = entry.origins[0].source;
        let originIsValid, originIsGeneral;
        ({
            allTerms, numDistinctTerms, originFlags, originIsValid, originIsGeneral
        } = getAllTermsOrigin(originTerm, entry.facets));
        if (originFlags.length === 0 && entry.origins[0].language) {
            originFlags = [entry.origins[0].language];
            originEval = "bad";
        } else {
            originEval = originIsValid ? (
                /* TODO this is where you'd flag origins as sankaku */
                originIsGeneral && (originFlags.length === 0 || originFlags.includes("us")) ? "best" : "good"
            ) : "bad";
        }
    }

    console.log(allTerms)


    console.log(`origin eval: ${originEval}`)
    let correctionNotNeeded = originEval === "best" || numDistinctTerms === 1;
    let correction, correctionEval;
    let correctionFlags = [];
    if (!correctionNotNeeded) {
        console.log(`generating correction`)
        let firstGeneralTerm = entry.facets.general?.at(0)?.terms?.join(", ") ?? undefined;
        if (firstGeneralTerm === undefined) { // if no "best" term
            correction = allTerms[1]; // TODO maybe wont always work
            console.log(`correction thingy: ${allTerms}`)
            correctionEval = "good"; // TODO is this right?
            // TODO flag
        } else {
            let generalIndex = firstGeneralTerm === originTerm ? 1 : 0;
            correction = entry.facets.general[generalIndex].terms?.join(", ") ?? undefined;
            if (entry.facets.general[generalIndex].regions?.length > 0) {
                correctionFlags = entry.facets.general[generalIndex].regions;
                correctionEval = "good";
            } else {
                correctionEval = "best";
            }
        }
    }
    let hasNotes = entry.notes.length > 0;
    let hasSources = entry.sources && Object.values(entry.sources).length > 0;
    console.log(`done processing ${word}`)
    console.log(`num distinct terms for ${word}: ${numDistinctTerms}`)
    return {
        printKatakana,
        aliasString,
        numDistinctTerms,
        allTerms,
        originTerm,
        originMeaning,
        originFlags,
        originEval,
        correctionNotNeeded,
        correction,
        correctionFlags,
        correctionEval,
        hasNotes,
        hasSources
    };
}