function navigateToCardParams(cardId, newVisibility, newDisplay, newFlex, updateURL, urlData = {}, newUrl = "/") {
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
    if (updateURL) {
        //document.getElementById("content").innerHTML = response.html;
        //document.title = response.pageTitle;
        //window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
        window.history.pushState(urlData, "", newUrl);
    }
}

export function navigateToCard(cardId, updateURL = true) {
    if (cardId === "placeholder") {
        navigateToCardParams(cardId, "", "", ["4",""], updateURL);
    } else {
        navigateToCardParams(
            cardId, "visible", "flex",
            ["0","none"], updateURL, {"term": cardId},
            `/?term=${cardId}`
        );
    }
}