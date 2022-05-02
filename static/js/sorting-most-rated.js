async function initEventListener() {
    document.querySelectorAll("th").forEach(element => element.addEventListener('click', sortMostRatedShows));
    document.getElementById('leftArrow').addEventListener('click', paginationLeftArrowClick);
    document.getElementById('rightArrow').addEventListener('click', paginationRightArrowClick);
    document.querySelectorAll('.page-button').forEach(element => element.addEventListener('click', pageEventListener))
}

async function pageEventListener(event) {
    let newPage = event.currentTarget.innerText;
    let headers = document.querySelectorAll("th")
    let order_by;
    let direction;

    headers.forEach(function (element) {
        if (element.classList.contains('ASC') || element.classList.contains('DESC')) {
            order_by = element.classList[0];
            direction = element.classList[1];
        }
    })

    if (order_by === "header-title") {
        order_by = 'title';
    } else if (order_by === undefined) {
        order_by = 'undefined'
    }

    if (direction === undefined) {
        direction = 'undefined'
    }

    let newListData = await fetchSpecificPage(newPage, order_by, direction);

    replaceTableData(newListData);

    removeActiveAndPlaceNewActive(newPage);
}

async function fetchSpecificPage(page, order_by, direction) {
    try {
        const response = await fetch("/shows/most-rated", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'page': page, 'order_by': order_by, 'direction': direction}),
        });
        const data = await response.json();

        return data
    } catch (exception) {
        console.log('Something went horribly wrong. Who did upset Peeves agin?!');
        console.log(exception);
        console.log(exception.message); // Konkrét hibaüzenete az exceptionnak
    }
}

function replaceTableData(newListData) {
    let oldTableData = document.querySelectorAll('td');
    oldTableData.forEach(element => element.remove());
    let i = 0;

    let tableRows = document.querySelectorAll(".td-data-row");

    tableRows.forEach(function (element) {
            if (i < newListData.length) {
                let newData = document.createElement('td');
                let newData2 = document.createElement('td');
                let newData3 = document.createElement('td');
                let newData4 = document.createElement('td');
                let newData5 = document.createElement('td');
                let newData6 = document.createElement('td');
                let newData7 = document.createElement('td');
                newData.innerHTML = newListData[i].title;
                element.appendChild(newData);

                newData2.innerHTML = newListData[i].year;
                element.appendChild(newData2);

                newData3.innerHTML = newListData[i].runtime;
                element.appendChild(newData3);

                newData4.innerHTML = newListData[i].rating;
                element.appendChild(newData4);

                if (newListData[i].genre === null) {
                    newData5.innerHTML = "No genre added";
                    element.appendChild(newData5);
                } else {
                    newData5.innerHTML = newListData[i].genre;
                    element.appendChild(newData5);
                }

                if (newListData[i].trailer === null) {
                    newData6.innerHTML = "No URL";
                    element.appendChild(newData6);
                } else {
                    newData6.innerHTML = `<a href="${newListData[i].trailer}">Link</a>`;
                    element.appendChild(newData6);
                }

                if (newListData[i].homepage === null) {
                    newData7.innerHTML = "No URL";
                    element.appendChild(newData7);
                } else {
                    newData7.innerHTML = `<a href="${newListData[i].homepage}">Link</a>`;
                    element.appendChild(newData7)
                }
                i++;
            }
        }
    )
}


function removeActiveAndPlaceNewActive(pageNumber) {
    let buttons = document.querySelectorAll(".page-button");
    buttons.forEach(function (element) {
        if (element.classList.contains("active")) {
            element.classList.remove("active");
        }
    })

    buttons.forEach(function (element) {
        if (+element.innerText === +pageNumber) {
            element.classList.add('active');
        }
    })

}


async function paginationLeftArrowClick(event) {
    let buttons = document.querySelectorAll(".page-button");
    let pageNumber;
    let order_by;
    let direction;
    let headers = document.querySelectorAll("th")


    buttons.forEach(function (element) {
        if (element.classList.contains('active')) {
            pageNumber = element.innerText
        }
    })

    headers.forEach(function (element) {
        if (element.classList.contains('ASC') || element.classList.contains('DESC')) {
            order_by = element.classList[0];
            direction = element.classList[1];
        }
    })

    if (order_by === "header-title") {
        order_by = 'title';
    } else if (order_by === undefined) {
        order_by = 'undefined'
    }

    if (direction === undefined) {
        direction = 'undefined'
    }

    if (+pageNumber !== 1) {
        pageNumber--;
        let newListData = await fetchSpecificPage(pageNumber, order_by, direction);

        replaceTableData(newListData);

        removeActiveAndPlaceNewActive(pageNumber);
    }
}


async function paginationRightArrowClick(event) {
    let counter = document.querySelector('.for-szanil').childElementCount;
    let buttons = document.querySelectorAll(".page-button");
    let pageNumber;
    let order_by;
    let direction;
    let headers = document.querySelectorAll("th")


    buttons.forEach(function (element) {
        if (element.classList.contains('active')) {
            pageNumber = element.innerText
        }
    })

    headers.forEach(function (element) {
        if (element.classList.contains('ASC') || element.classList.contains('DESC')) {
            order_by = element.classList[0];
            direction = element.classList[1];
        }
    })

    if (order_by === "header-title") {
        order_by = 'title';
    } else if (order_by === undefined) {
        order_by = 'undefined'
    }

    if (direction === undefined) {
        direction = 'undefined'
    }

    if (+pageNumber < +counter) {
        pageNumber++;
        let newListData = await fetchSpecificPage(pageNumber, order_by, direction);

        replaceTableData(newListData);

        removeActiveAndPlaceNewActive(pageNumber);
    }
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


function bubbleSort(oldTableData, sortTarget) {
    let dictionaryForBubbleSort = {
        'header-title': 0, 'year': 1, 'runtime': 2, 'rating': 3, 'genre': 4, 'trailer': 5,
        'homepage': 6
    }
    let swapped = true;
    do {
        swapped = false;
        for (let j = 0; j < oldTableData.length - 1; j++) {
            if (oldTableData[j].children[dictionaryForBubbleSort[sortTarget]].innerText > oldTableData[j + 1].children[dictionaryForBubbleSort[sortTarget]].innerText) {
                let temp = oldTableData[j];
                oldTableData[j] = oldTableData[j + 1];
                oldTableData[j + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
    return oldTableData
}


function ascDescAdder(currentTarget, newTableData) {
    if (!currentTarget.contains('ASC')) {
        currentTarget.add('ASC');
        if (currentTarget.contains('DESC')) {
            currentTarget.remove('DESC');
        }
    } else if (currentTarget.contains('ASC')) {
        currentTarget.remove('ASC');
        newTableData = newTableData.reverse();
        currentTarget.add('DESC');
    }
}


function removeUnnecessarySortName(trHeader, sortTarget) {
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
