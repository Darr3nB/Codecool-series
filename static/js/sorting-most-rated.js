async function initEventListener() {
    document.querySelectorAll("th").forEach(element => element.addEventListener('click', sortMostRatedShows));
}


async function sortMostRatedShows(event) {
    let oldTableData = [];
    let currentTarget = event.currentTarget.classList;
    let sortTarget = event.currentTarget.classList[0];
    let trHeader = document.querySelector(".tr-header");
    let tdDataRow = document.querySelectorAll(".td-data-row");
    tdDataRow.forEach(element => oldTableData.push(element));
    let newTableData = bubbleSort(oldTableData, sortTarget);

    ascDescAdder(currentTarget, newTableData);

    removeUnnecessarySortName(trHeader, sortTarget);

    let tableHtml = `${trHeader.outerHTML}`
    newTableData.forEach(row => {
        tableHtml += `${row.outerHTML}`;
    })


    document.querySelector('table').innerHTML = tableHtml;
    await initEventListener();
}


function bubbleSort(oldTableData, sortTarget){
    let dictionaryForBubbleSort = {'header-title': 0, 'year': 1, 'runtime': 2, 'rating': 3, 'genre': 4, 'trailer': 5,
                                    'homepage': 6}
    let swapped = true;
    do{
        swapped = false;
        for(let j = 0; j < oldTableData.length - 1; j++){
            if(oldTableData[j].children[dictionaryForBubbleSort[sortTarget]].innerText > oldTableData[j + 1].children[dictionaryForBubbleSort[sortTarget]].innerText){
                let temp = oldTableData[j];
                oldTableData[j] = oldTableData[j + 1];
                oldTableData[j + 1] = temp;
                swapped = true;
            }
        }
    }while (swapped);
    return oldTableData
}

function ascDescAdder(currentTarget, newTableData){
    if(!currentTarget.contains('asc')){
        currentTarget.add('asc');
        if(currentTarget.contains('desc')){
            currentTarget.remove('desc');
        }
    }else if(currentTarget.contains('asc')){
        currentTarget.remove('asc');
        newTableData = newTableData.reverse();
        currentTarget.add('desc');
    }
}

function removeUnnecessarySortName(trHeader, sortTarget){
    let gg = trHeader.querySelectorAll('th')
    gg.forEach(ez => {
        if (!ez.classList.contains(sortTarget) && ez.classList.contains('asc')) {
            ez.classList.remove('asc')
        } else if (!ez.classList.contains(sortTarget) && ez.classList.contains('desc')) {
            ez.classList.remove('desc')
        }
    })
}


await initEventListener();
