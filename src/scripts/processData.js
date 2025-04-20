function getAllTermsOrigin(origin, facets) {
    let numDistinctTerms = 1;
    let originFlags = [];
    let originIsValid = false;
    let originIsGeneral = false;
    let fullOrigin = [];
    let allTerms = Object.entries(facets).flatMap(
        ([facetName, facetInfo]) => {
            return facetInfo.flatMap(regionInfo => {
                if (regionInfo.terms.includes(origin)) {
                    originFlags = regionInfo.regions ?? [];
                    originIsValid = true;
                    originIsGeneral = facetName === "general";
                    fullOrigin = regionInfo.terms;
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
    return {allTerms, numDistinctTerms, originFlags, originIsValid, originIsGeneral, fullOrigin};
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

    let allTerms, numDistinctTerms, firstTerm, firstTermMeaning, firstTermFlags, firstTermEval;
    if (entry.direct) { // if the direct translation is included
        firstTerm = entry.direct.word;
        console.log(`direct first term: ${firstTerm}`);
        ({
            allTerms, numDistinctTerms
        } = getAllTermsDirect(firstTerm, entry.facets));
        firstTermFlags = [];
        firstTermEval = "bad";
        firstTermMeaning = entry.direct.meaning;
    } else {
        let originIsValid, originIsGeneral, fullOrigin;
        ({
            allTerms, numDistinctTerms, originFlags: firstTermFlags, originIsValid, originIsGeneral, fullOrigin
        } = getAllTermsOrigin(entry.origins[0].source, entry.facets));
        if (fullOrigin.length > 0) { // if origin is present in other entries
            firstTerm = fullOrigin.join(", "); // join all other terms in associated line
            firstTermEval = originIsValid ? (
                /* TODO this is where you'd flag origins as sankaku */
                originIsGeneral && (firstTermFlags.length === 0 || firstTermFlags.includes("us")) ? "best" : "good"
            ) : "bad";
        } else { // if origin is not present in other entries
            firstTerm = entry.origins[0].source; // take origin from origins
            firstTermFlags = [entry.origins[0].language]; // take flags from origins
            firstTermEval = "bad"; // because it's not present in other entries, it's bad
        }
    }

    let correctionNotNeeded = firstTermEval === "best" || numDistinctTerms === 1;
    let secondTerm, secondTermEval;
    let secondTermFlags = [];
    if (!correctionNotNeeded) {
        console.log(`generating correction`)
        let firstGeneralTerm = entry.facets.general?.at(0)?.terms?.join(", ") ?? undefined;
        if (firstGeneralTerm === undefined) { // if no "best" term
            if (numDistinctTerms === 2) {
                // TODO display one that doesn't equal origin
                let singleOrigin = firstTerm.split(", ")[0];
                let correctionInfo = Object.values(entry.facets).flat().find(regionInfo => !regionInfo.terms.includes(singleOrigin));
                secondTerm = correctionInfo.terms.join(", ");
                secondTermFlags = correctionInfo.regions;
                console.log(`............................................................correction: ${secondTerm}`);
            } else {
                // TODO
            }
            //secondTerm = allTerms[1]; // TODO maybe wont always work
            //console.log(`secondTerm thingy: ${allTerms}`)
            secondTermEval = "good"; // TODO is this right?
            // TODO flag
        } else {
            let generalIndex = firstGeneralTerm === firstTerm ? 1 : 0;
            secondTerm = entry.facets.general[generalIndex].terms?.join(", ") ?? undefined;
            if (entry.facets.general[generalIndex].regions?.length > 0) {
                secondTermFlags = entry.facets.general[generalIndex].regions;
                secondTermEval = "good";
            } else {
                secondTermEval = "best";
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
        firstTerm,
        firstTermMeaning,
        firstTermFlags,
        firstTermEval,
        correctionNotNeeded,
        secondTerm,
        secondTermFlags,
        secondTermEval,
        hasNotes,
        hasSources
    };
}