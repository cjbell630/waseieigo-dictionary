function navigateToCardParams(cardId, newVisibility, newDisplay, newFlex, updateURL, urlData = {}, newUrl = "/", query = null, scrollValue = null) {

    let currentScroll = document.body.scrollTop;
    let currentQuery = document.querySelector("#search-bar")?.value;
    //let prevResultsCard = document.querySelector(".details-pane .card[display='flex']");
    let prevResultsCard = document.querySelector(".details-pane .selected");
    console.log(prevResultsCard);
    prevResultsCard.classList.remove("selected");
    prevResultsCard.style.visibility = "hidden";
    prevResultsCard.style.display = "none";
    let newResultsCard = document.querySelector(`#${cardId}-results`);
    newResultsCard.classList.add("selected");
    newResultsCard.style.visibility = newVisibility;
    newResultsCard.style.display = newDisplay;

    // TODO for now we're doing this
    document.documentElement.style.setProperty('--card-open', newFlex[0]);
    document.documentElement.style.setProperty('--card-open-word', newFlex[1]);
    if (scrollValue) {
        document.body.scrollTop = scrollValue;
    }

    if (query) {
        console.log(`query found: ${query}`)
    }

    if (updateURL) {
        //document.getElementById("content").innerHTML = response.html;
        //document.title = response.pageTitle;
        //window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
        console.log(`updating state to`)
        console.log({...urlData, "query": currentQuery, "scroll": currentScroll});
        window.history.replaceState({...window.history.state, "query": currentQuery, "scroll": currentScroll}, "");
        window.history.pushState(urlData, "", newUrl);
    }
}

export function navigateToCard(cardId, updateURL = true, query = null, scrollValue = null) {
    if (cardId === "placeholder") {
        console.log(`navigating with query ${query} and scroll ${scrollValue}`)
        navigateToCardParams(cardId, "", "", ["4", ""], updateURL, undefined, undefined, query, scrollValue);
    } else {
        navigateToCardParams(
            cardId, "visible", "flex",
            ["0", "none"], updateURL, {"term": cardId},
            `/?term=${cardId}`
        );
    }
}