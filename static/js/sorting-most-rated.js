async function initEventListener() {
    document.querySelectorAll("th").forEach(element => element.addEventListener('click', sortMostRatedShows));
    document.getElementById('leftArrow').addEventListener('click', paginationLeftArrowClick);
    document.getElementById('rightArrow').addEventListener('click', paginationRightArrowClick);
    document.querySelectorAll('.page-button').forEach(element => element.addEventListener('click', pageEventListener))
}

async function pageEventListener(event){
    let newPage = event.currentTarget.innerText;
    let order_by;
    let headers = document.querySelectorAll("th")
    let direction;

    headers.forEach(function(element){
        if(element.classList.contains('ASC') || element.classList.contains('DESC')){
            order_by = element.classList[0];
            direction = element.classList[1];
        }
    })

    if(order_by === "header-title"){
        order_by = 'title';
    }else if(order_by === undefined){
        order_by = 'undefined'
    }

    if(direction === undefined){
        direction = 'undefined'
    }

    await fetchSpecificPage(newPage, order_by, direction);
}

async function fetchSpecificPage(page, order_by, direction){
    await fetch("/shows/most-rated", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'page': page, 'order_by': order_by, 'direction': direction}),
    }).then(function(response){
        console.log(response);
    }).catch(function (){
        console.log('Something went horribly wrong. Who did upset Peeves agin?!');
    })
}


function paginationLeftArrowClick(event){
    console.log(event.currentTarget);
}


function paginationRightArrowClick(event){
    console.log(event.currentTarget);
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
    if(!currentTarget.contains('ASC')){
        currentTarget.add('ASC');
        if(currentTarget.contains('DESC')){
            currentTarget.remove('DESC');
        }
    }else if(currentTarget.contains('ASC')){
        currentTarget.remove('ASC');
        newTableData = newTableData.reverse();
        currentTarget.add('DESC');
    }
}


function removeUnnecessarySortName(trHeader, sortTarget){
    let gg = trHeader.querySelectorAll('th')
    gg.forEach(ez => {
        if (!ez.classList.contains(sortTarget) && ez.classList.contains('ASC')) {
            ez.classList.remove('ASC')
        } else if (!ez.classList.contains(sortTarget) && ez.classList.contains('DESC')) {
            ez.classList.remove('DESC')
        }
    })
}


await initEventListener();
