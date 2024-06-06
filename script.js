// Julius Wiegand
//
// 06.06.2024
//
// Funny Cook Webgame
//

rowCount = 7;
columnCount = 4;
tickrate = 1000;

panHTML = '<img class="content" id="pan" src="images/pan.png">';

panLocation = 24;
hp = 3;
points = 0;

gridItems = document.getElementsByClassName("gridItem");
hpPointElements = document.getElementsByClassName("hp");

foods = {
    "food1": {
        "html": '<img class="content" id="food1" src="images/chicken.png">',
        "height": rowCount, // top 7 -> bottom 1
        "currentPosition": 0,
        "direction": "down"
    },
    "food2": {
        "html": '<img class="content" id="food2" src="images/bacon.png">',
        "height": rowCount, // top 6 -> bottom 2
        "currentPosition": 1,
        "direction": "down"
    },
    "food3": {
        "html": '<img class="content" id="food3" src="images/pancake.png">',
        "height": rowCount, // top 6 -> bottom 3
        "currentPosition": 2,
        "direction": "down"
    },
    "food4": {
        "html": '<img class="content" id="food4" src="images/burger.png">',
        "height": rowCount, // top 6 -> bottom 4
        "currentPosition": 3,
        "direction": "down"
    }
}

// initialise game
document.addEventListener("DOMContentLoaded", function() {
    // place pan on grid
    gridItems[panLocation].innerHTML = panHTML;

    // init point display
    document.getElementById("pointDisplay").innerText = points.toString();

    // init tickrate display
    document.getElementById("tickrateDisplay").innerText = tickrate.toString() + "ms";

    // place food on grid + randomise their location
    rowsWithFood = [];
    for (let i = 0; i < columnCount; i++) {
        do {
            randomHeight = Math.floor(Math.random() * 5);
        } while (rowsWithFood.includes(randomHeight));
        rowsWithFood.push(randomHeight);

        gridItems[i + (randomHeight * columnCount)].innerHTML = foods[`food${i + 1}`].html;

        foods[`food${i + 1}`].height = 6 - randomHeight;
        foods[`food${i + 1}`].currentPosition = i + (randomHeight * columnCount);
        foods[`food${i + 1}`].direction = Math.floor(Math.random() * 10) > 5 ? "up" : "down";
    }

    // set interval for moving food
    for (let i = 0; i < columnCount; i++) {
        setTimeout(function() {
            setInterval(() => {
                // gets called if food reaches bottom of the grid
                if (foods[`food${i + 1}`].height === 1) {
                    foods[`food${i + 1}`].direction = "up";
                    panColumn = (panLocation % columnCount) + 1;
                    
                    if (panColumn === i + 1) {
                        catchedFood();
                        addPoint();
                    } else {
                        removeHP();
                    }
                }
                
                // chance to drop down before reaching the top
                if (foods[`food${i + 1}`].height > 3) {
                    if (Math.floor(Math.random() * 10) < 3) {
                        foods[`food${i + 1}`].direction = "down";
                    }
                }

                // fall down if reached top
                if (foods[`food${i + 1}`].height === 6) {
                    foods[`food${i + 1}`].direction = "down";
                }
    
                moveFood(i + 1, foods[`food${i + 1}`].direction, foods[`food${i + 1}`].currentPosition);
            }, tickrate);
        }, Math.floor(Math.random() * 2500) + 750); // random start delay
    }
});

// move pan input listener
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" && panLocation > (rowCount * columnCount) - columnCount) {
        movePan("left", panLocation);
    } else if (event.key === "ArrowRight" && panLocation < (rowCount * columnCount) - 1) {
        movePan("right", panLocation);
    }
})

/**
 * Decreases the hp counter and animates the background, when hp reaches 0 it alerts the user and reloads the page
 *
 */
function removeHP() {
    hp -= 1;

    // sync with hp display
    for (let i = 0; i < hpPointElements.length; i++) {
        if (hp > i) {
            hpPointElements[i].style.display = "inline";
        } else {
            hpPointElements[i].style.display = "none";
        }
    }

    // animate background
    document.body.style.backgroundColor = `rgba(255, 0, 0, 0.2)`;
    setTimeout(() => {
        document.body.style.backgroundColor = "rgb(255, 255, 255)";
    }, 100);

    if (hp === 0) {
        alert("Game over");
        window.location.reload();
    }
}

function addPoint() {
    points += 1;
    document.getElementById("pointDisplay").innerText = points.toString();
}

/**
 * animates the pan when food was caught
 */
function catchedFood() {
    gridItems[panLocation].childNodes[0].style.transform = "rotate(-25deg)";
    setTimeout(() => {
        gridItems[panLocation].childNodes[0].style.transform = "rotate(0deg)";
    }, 150);
}

/**
 * Moves the food element in the specified direction.
 *
 * @param {string} food - The food element to move.
 * @param {string} direction - Direction to move food - can be "up" or "down".
 * @param {number} currentPosition - The current position of the food element in the grid.
 */
function moveFood(food, direction, currentPosition) {
    switch (direction) {
        case "up":
            gridItems[currentPosition].innerHTML = "";
            gridItems[currentPosition - columnCount].innerHTML = foods[`food${food}`].html;
            foods[`food${food}`].height += 1;
            foods[`food${food}`].currentPosition = currentPosition - columnCount;
            break;
        case "down":
            gridItems[currentPosition].innerHTML = "";
            gridItems[currentPosition + columnCount].innerHTML = foods[`food${food}`].html;
            foods[`food${food}`].height -= 1;
            foods[`food${food}`].currentPosition = currentPosition + columnCount;
            break;
    }
}

/**
 * Moves the pan element in the specified direction.
 *
 * @param {string} direction - Direction to move pan - can be "left" or "right".
 * @param {number} currentPosition - The current position of the pan element in the grid.
 */
function movePan(direction, currentPosition) {
    switch (direction) {
        case "left":
            gridItems[currentPosition].innerHTML = "";
            gridItems[currentPosition - 1].innerHTML = panHTML;
            panLocation -= 1;
            break;
        case "right":
            gridItems[currentPosition].innerHTML = "";
            gridItems[currentPosition + 1].innerHTML = panHTML;
            panLocation += 1;
            break;
    }
}