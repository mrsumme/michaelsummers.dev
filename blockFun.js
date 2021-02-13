let blockChainCount = 0;
let maxChainCount = 4;
let quadrants;
let z_block = 5000;
let z_shadow = 3000;
let intervals = [];

function setQuadrants() {
    quadrants = [[0,0], [0,1], [1,0], [1,1]];
    shuffleArr(quadrants);
}

function shuffleArr(arr) {
    let currentIndex = arr.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }

    return arr;
}

function drawStart(appElement) {
    let startBlock = document.createElement('img');
    let shadow = document.createElement('img');
    let quadrantLength = window.innerWidth  / Math.sqrt(maxChainCount);
    let quadrantHeight = window.innerHeight  / Math.sqrt(maxChainCount);
    let startCoor = [
        (Math.random() * quadrantLength * 0.3) + (quadrantLength * (quadrants[0][0] + 0.35)), 
        (Math.random() * quadrantHeight * 0.3) + (quadrantHeight * (quadrants[0][1] + 0.35)),
        0
    ];
    quadrants.shift();
    // startBlock element settings
    startBlock.src = './assets/SVG/Asset 21.svg';
    startBlock.style.maxWidth = '50px';
    startBlock.style.position = 'absolute';
    startBlock.style.left = `${startCoor[0]}px`;
    startBlock.style.top = `${startCoor[1]}px`;
    startBlock.style.zIndex = z_block;
    // shadow element settings
    shadow.src = './assets/SVG/Asset 38.svg';
    shadow.style.maxWidth = '50px';
    shadow.style.position = 'absolute';
    shadow.style.left = `${startCoor[0] - 31}px`;
    shadow.style.top = `${startCoor[1] + 29}px`;
    shadow.style.zIndex = z_shadow;
    appElement.appendChild(shadow);
    appElement.appendChild(startBlock);
    startCoor.push(z_block);
    startCoor.push([startCoor[0] - 31, startCoor[1] + 29]);
    return startCoor;
}

function drawWhichWay(lastMovement) {
    let options = [1, 3]
    if (lastMovement === 2) {
        options.push(2);
    }
    else if (lastMovement === 4) {
        options.push(4);
    }
    else {
        options.push(2, 4);
    }

    return options[Math.floor(Math.random() * options.length)]
}

function drawNextCube(appElement, previousCube) {
    // cube
    let nextBlock = document.createElement('img');
    nextBlock.src = './assets/SVG/Asset 21.svg';
    nextBlock.style.maxWidth = '50px';
    nextBlock.style.position = 'absolute';
    z_block++;
    nextBlock.style.zIndex = z_block;
    // shadow
    console.log(previousCube[4]);
    let shadow = document.createElement('img');
    shadow.src = './assets/SVG/Asset 38.svg';
    shadow.style.maxWidth = '50px';
    shadow.style.position = 'absolute';
    z_shadow++;
    shadow.style.zIndex = z_shadow;

    let direction = drawWhichWay(previousCube[2]);
    let newCoors = [];
    switch( direction ) {
        case 1:
            // cube
            nextBlock.style.left = `${previousCube[0]}px`;
            newCoors.push(previousCube[0]);
            nextBlock.style.top = `${previousCube[1] - 30}px`;
            newCoors.push(previousCube[1] - 30);
            newCoors.push(direction, nextBlock.style.zIndex);
            // shadow
            shadow.style.left = `${previousCube[4][0] - 20}px`;
            shadow.style.top = `${previousCube[4][1]}px`;
            newCoors.push([previousCube[4][0] - 20, previousCube[4][1]]);
            break;
        case 2:
            // cube
            nextBlock.style.left = `${previousCube[0] - 30}px`;
            newCoors.push(previousCube[0] - 30);
            nextBlock.style.top = `${previousCube[1]}px`;
            newCoors.push(previousCube[1]);
            nextBlock.style.zIndex = `${previousCube[3] - 1}`;
            newCoors.push(direction, nextBlock.style.zIndex);
            // shadow
            shadow.style.left = `${previousCube[4][0] - 31}px`;
            shadow.style.top = `${previousCube[4][1]}px`;
            newCoors.push([previousCube[4][0] - 31, previousCube[4][1]]);
            break;
        case 3:
            // cube
            nextBlock.style.left = `${previousCube[0] - 16}px`;
            newCoors.push(previousCube[0] - 16);
            nextBlock.style.top = `${previousCube[1] + 9}px`;
            newCoors.push(previousCube[1] + 9);
            newCoors.push(direction, nextBlock.style.zIndex);
            // shadow
            shadow.style.left = `${previousCube[4][0] - 16}px`;
            shadow.style.top = `${previousCube[4][1] + 9}px`;
            newCoors.push([previousCube[4][0] - 16, previousCube[4][1] + 9]);
            break;
        case 4:
            // block
            nextBlock.style.left = `${previousCube[0] + 30}px`;
            newCoors.push(previousCube[0] + 30);
            nextBlock.style.top = `${previousCube[1]}px`;
            newCoors.push(previousCube[1]);
            newCoors.push(direction, nextBlock.style.zIndex);
            // shadow
            shadow.style.left = `${previousCube[4][0] + 31}px`;
            shadow.style.top = `${previousCube[4][1]}px`;
            newCoors.push([previousCube[4][0] + 31, previousCube[4][1]]);
            break;
    }
    appElement.appendChild(shadow);
    appElement.appendChild(nextBlock);
    return newCoors;
}

function main() {
    let funWithBlocks = document.getElementById('fun-with-blocks');
    let coordinates = []
    coordinates.push(drawStart(funWithBlocks));

    let blocksPerChain = 0;
    let intervalID = window.setInterval(() => {
        coordinates.push(drawNextCube(funWithBlocks, coordinates[coordinates.length - 1]));
        blocksPerChain++;
        if (blocksPerChain >= 6) {
            clearInterval(intervalID);
            blockChainCount++;
            if (blockChainCount >= maxChainCount) {
                funWithBlocks.innerHTML = '';
                setQuadrants();
                drawDotGrid();
                blockChainCount = 0;
                z_block = 5000;
                z_shadow = 3000;
            }
            main();
        }
    }, 1000)
    intervals.push(intervalID);
}

function drawDotGrid() {
    let dot;
    let funWithBlocks = document.getElementById('dot-grid');
    squareSize = 30, i = 1, j = 1;
    while (i * squareSize < window.innerHeight * 0.895) {
        while (j * squareSize < window.innerWidth) {
            dot = document.createElement('p');
            dot.innerText = '.';
            dot.style.position = 'absolute';
            dot.style.color = '#05486e';
            dot.style.left = `${squareSize * j}px`;
            dot.style.top = `${40 + (squareSize * i)}px`;
            funWithBlocks.appendChild(dot);
            j++
        }
        j = 1;
        i++
    }
}

function windowResizeHandler() {
    intervals.forEach((id) => {
        clearInterval(id);
    });
    let animation = document.getElementById('fun-with-blocks');
    animation.innerHTML = '';
    setQuadrants();
    drawDotGrid();
    blockChainCount = 0;
    z_block = 5000;
    z_shadow = 3000;
    main();
}
window.onresize = windowResizeHandler;

setQuadrants();
drawDotGrid();
main();