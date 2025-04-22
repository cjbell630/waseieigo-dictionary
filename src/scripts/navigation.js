export function navigateToCard(cardId) {
    //let prevResultsCard = document.querySelector(".details-pane .card[display='flex']");
    let prevResultsCard = document.querySelector(".details-pane .selected");
    console.log(prevResultsCard);
    prevResultsCard.classList.remove("selected");
    prevResultsCard.style.visibility = "hidden";
    prevResultsCard.style.display = "none";
    let newResultsCard = document.querySelector(`#${cardId}-results`);
    newResultsCard.classList.add("selected");
    newResultsCard.style.visibility = "visible";
    newResultsCard.style.display = "flex";

    // TODO for now we're doing this
    document.documentElement.style.setProperty('--test', '0');
}