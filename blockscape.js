class Block {
    constructor(coor, timeOfDay, assets) {
        this.coor = coor;
        this.timeOfDay = timeOfDay;
        this.assets = assets;
        this.element = document.createElement('img');
        this.element.classList.add('block');
        this.element.style.position = 'absolute';
        this.element.style.maxWidth = '50px';
        this.element.style.left = `${this.coor.left}px`;
        this.element.style.top = `${this.coor.top}px`;
        this.element.style.zIndex = this.coor.zIndex;
        this.element.src = assets['block'];
        this.shadow = {
            element: document.createElement('img'),
            coor: null
        };
        this.shadow.element.classList.add('block-shadow');
        this.shadow.coor = this.renderShadow();
    }

    get movement() {
        return this.coor.movement;
    }

    get coordinates() {
        return this.coor
    }

    get elevation() {
        return this.coor.elev
    }

    /*
        morning:
            left - 30
            top + 30
        afternoon:
            left + 19
            top + 19
        evening:
            left + 30
            top + 30
            scaleY(0.6666)

                     |  / 
                     | /
       evening ->    |/    <- morning
              ----------------
                    /|
                   / |
       afternoon  /  |
    */
    renderShadow() {
        let shadowCoor;
        switch (this.timeOfDay) {
            case 'morning':
                shadowCoor = {
                    left: `${this.coor.left + -30 + (this.elevation * -30)}px`,
                    top: `${this.coor.top + 30 + (this.elevation * 30)}px`,
                    zIndex: this.coor.zIndex - 2000
                }
                break;
            case 'afternoon':
                shadowCoor = {
                    left: `${this.coor.left + 19 + (this.elevation * 18)}px`,
                    top: `${this.coor.top + 19 + (this.elevation * 20)}px`,
                    zIndex: this.coor.zIndex - 2000
                }
                break;
            case  'evening':
                shadowCoor = {
                    left: `${this.coor.left + 30 + (this.elevation * 30)}px`,
                    top: `${this.coor.top + 30 + (this.elevation * 30)}px`,
                    zIndex: this.coor.zIndex - 2000
                }
                break;
        }
        Object.entries(shadowCoor).forEach((x) => {
            this.shadow.element.style[x[0]] = x[1];
        });
        this.shadow.element.src = this.assets['shadow'];
        this.shadow.element.style.position = 'absolute';
        this.shadow.element.style.maxWidth = '50px';
        return shadowCoor;
    }

    coorToString(coor) {
        let str = Object.entries(coor).reduce((prev, curr) => {
            return prev += `${curr[0]}:${curr[1]};`;
        },'')
        return str;
    }

    enterFromRight() {

    }

    enterFromLeft() {

    }

    enterFromUp() {

    }

    enterFromForward() {

    }

    updateTimeOfDay(timeOfDay, assets) {
        this.timeOfDay = timeOfDay;
        this.renderShadow();
        this.assets = assets;
        this.element.src = this.assets.block;
        this.shadow.element.src = this.assets.shadow;

    }

    place(wrapper) {
        wrapper.appendChild(this.element);
        wrapper.appendChild(this.shadow.element);
    }

    fade() {
        this.element.classList.toggle('fade');
        this.element.style.top = this.element.style.top - 30;
        this.shadow.element.classList.toggle('fade');

    }
}

class Chain {
    constructor(blockscape, quadrant, dimensions, maxChainLength, timeOfDay, assets) {
        this.blocks = [];
        this.interval;
        this.assets = assets;
        this.maxChainLength = maxChainLength;
        this.blockscape = blockscape;
        this.dimensions = dimensions;
        this.quadrant = quadrant;
        this.timeOfDay = timeOfDay;
        this.element = document.createElement('div');
        blockscape.element.appendChild(this.element);
        this.start()

    }

    calculateStartCoor() {
        let quadrantLength = this.blockscape.element.innerWidth  / this.dimensions[0];
        let quadrantHeight = this.blockscape.element.innerHeight  / this.dimensions[0];
        console.log(this.quadrant)
        console.log(this.blockscape.quadrants)
        let startCoordinates = {
            left: (Math.random() * quadrantLength * 0.3) + (quadrantLength * (this.quadrant[0] + 0.35)), 
            top: (Math.random() * quadrantHeight * 0.3) + (quadrantHeight * (this.quadrant[1] + 0.35)),
            zIndex: 5000,
            elev: 0,
            movement: null
        };
        return startCoordinates;
    }

    get lastMovement() {
        return this.blocks[this.blocks.length - 1].movement
    }

    get lastCoordinates() {
        return this.blocks[this.blocks.length - 1].coordinates
    }

    updateTimeOfDay(timeOfDay, assets) {
        this.timeOfDay = timeOfDay
        this.assets = assets;
        this.blocks.forEach((block) => {
            block.updateTimeOfDay(timeOfDay, assets)
        });
    }

    /*
        Coordinate Calculators

        Coordinates structued as follows:
            [
                X coordinate,
                Y coordinate,
                Z coordinate,
                Elevation
            ]
        X, Y, Z coordinates are for placing block and correspond to
        the CSS attributes left, top, z-index respectively. Elevation
        concerns to the height of the block relative to the start
        block and is used to place shadows.
    */

    shiftLeft(coor) {
        return {
            left: coor.left - 30, 
            top: coor.top, 
            zIndex: coor.zIndex - 1, 
            elev: coor.elev,
            movement: 'Left'
        }
    }

    shiftRight(coor) {
        return {
            left: coor.left + 30, 
            top: coor.top,
            zIndex: coor.zIndex + 1,
            elev: coor.elev,
            movement: 'Right'
        }
    }

    shiftUp(coor) {
        return {
            left: coor.left, 
            top: coor.top - 30,
            zIndex: coor.zIndex + 1,
            elev: coor.elev + 1,
            movement: 'Up'
        }
    }

    shiftForward(coor) {
        return {
            left: coor.left - 16, 
            top: coor.top + 9,
            zIndex: coor.zIndex + 1,
            elev: coor.elev,
            movement: 'Forward'
        }
    }

    shiftBackward(coor) {

    }

    whichWay(lastMovement = this.lastMovement) {
        let options = ['Up', 'Forward'];
        if (lastMovement === 'Left') {
            options.push('Left');
        }
        else if (lastMovement === 'Right') {
            options.push('Right');
        }
        else {
            options.push('Left');
            options.push('Right');
        }

        return options[Math.floor(Math.random() * options.length)];
    }

    start() {
        let coor;
        if (this.blocks.length === 0) {
            coor = this.calculateStartCoor();
        }
        else {
            coor = this.lastCoordinates;
        }

        let block = new Block(coor, this.timeOfDay, this.assets)
        block.place(this.element);
        this.blocks.push(
            block
        );
        this.interval = window.setInterval(() => {
            this.next();
        }, 1000);
    }

    next() {
        if (this.blocks.length >= this.maxChainLength) {
            clearInterval(this.interval);
            this.stop()
            this.blockscape.start();
        }
        else {
            let direction = this.whichWay()
            let coor = this[`shift${direction}`](this.lastCoordinates)
            let block = new Block(coor, this.timeOfDay, this.assets)
            block.place(this.element);
            this.blocks.push(
                block
            );
        }
    }

    stop() {
        clearInterval(this.interval)
    }

    demolish() {
        clearInterval(this.interval)
        this.blockscape.reloadQuadrant(this.quadrant);
        this.blocks.forEach((block, i) => {
            setTimeout(() => {
                block.fade();
            }, 1000 * i);
        })
        setTimeout(() => {
            this.element.innerHTML = '';
            this.blockscape.chains.shift();
        }, 6500);
    }
}

class Blockscape {
    constructor(element, dimensions = [2,2], maxChainLength = 7) {
        this.element = element;
        this.element.innerHeight = window.innerHeight;
        this.element.innerWidth = window.innerWidth;
        this.dotGrid = document.getElementById('dot-grid');
        this.navbar = document.getElementsByClassName('navbar')[0];
        this.greeting = {
            container: document.getElementById('one-line-intro-container'),
            text: document.getElementById('one-line-intro'),
            select: document.getElementById('time')
        }
        this.sun = {
            element: document.getElementsByClassName('sun')[0],
            rays: document.getElementsByClassName('ray_box')[0],
            morning: {
                left: '95%',
                top: '0%',
                rays: 'visible'
            },
            afternoon: {
                left: '-50%',
                top: '95%',
                rays: 'visible'
            },
            evening: {
                left: '-95%',
                top: '0%',
                rays: 'hidden'
            }
        }
        this.dotGrid.innerHeight = this.element.innerHeight;
        this.dotGrid.innerWidth = this.element.innerWidth;
        this.dimensions = dimensions;
        this.quadrants = [];
        this.maxChainLength = maxChainLength;
        this.intervals = [];
        this.chains = [];
        this.timeOfDay;
        this.assets = {
            morning: {
                block: './assets/SVG/Asset 21.svg',
                shadow: './assets/SVG/Asset 38.svg',
                background: '#cee39d',
                oneLineBackground: 'rgba(206, 227, 157, 0.5)',
                oneLineColor: '#05486e',
                navbarColor: '#05486e',
                gridColor: '#05486e'
            },
            afternoon: {
                block: './assets/SVG/Asset 36.svg',
                shadow: './assets/SVG/Asset 39.svg',
                background: '#f8b195',
                oneLineBackground: 'rgba(181,112,132,0.5)',
                oneLineColor: 'white',
                navbarColor: '#05486e',
                gridColor: '#05486e'
            },
            evening: {
                block: './assets/SVG/Asset 20.svg',
                shadow: './assets/SVG/Asset 40.svg',
                background: '#05486e',
                oneLineBackground: 'rgba(62,93,123,0.5)',
                oneLineColor: 'white',
                navbarColor: 'rgba(62,93,123,0.5)',
                gridColor: 'rgba(162,177,191, 0.5)'
            }
        }
        this.drawDotGrid();
        this.setQuadrants();
        this.setTimeOfDay();
        window.onresize = this.windowResizeHandler.bind(this);
        this.timeDropdownHandler();
    }

    drawDotGrid() {
        let dot;
        let squareSize = 30, i = 1, j = 1;
        while (i * squareSize < this.element.innerHeight * 0.895) {
            while (j * squareSize < this.element.innerWidth) {
                dot = document.createElement('p');
                dot.innerText = '.';
                dot.style.position = 'absolute';
                dot.style.color = '#05486e';
                dot.style.left = `${squareSize * j}px`;
                dot.style.top = `${40 + (squareSize * i)}px`;
                this.dotGrid.appendChild(dot);
                j++
            }
            j = 1;
            i++
        }
    }

    setQuadrants() {
        for (let i=0; i < this.dimensions[0]; i++) {
            for (let j=0; j < this.dimensions[1]; j++) {
                this.quadrants.push([i,j])
            }
        }
        this.shuffleArr(this.quadrants);
    }

    shuffleArr(arr) {
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

    setTimeOfDay(time = new Date()) {
        if (time.getHours() >= 5 && time.getHours() < 12) {
            this.timeOfDay = 'morning';
        }
        else if (time.getHours() >= 12 && time.getHours() < 18) {
            this.timeOfDay = 'afternoon';
        }
        else if (time.getHours() >= 18 || time.getHours() < 5 ) {
            this.timeOfDay = 'evening';
        }
        this.updateTimeOfDay(this.timeOfDay);
    }

    updateTimeOfDay(timeOfDay) {
        this.timeOfDay = timeOfDay;
        console.log(this.navbar)
        this.navbar.style.background = this.assets[this.timeOfDay].navbarColor;
        for (const dot of this.dotGrid.children) {
            dot.style.color = this.assets[this.timeOfDay].gridColor;
        }
        this.element.style.background = this.assets[this.timeOfDay].background;
        this.greeting.container.style.backgroundColor = this.assets[this.timeOfDay].oneLineBackground;
        this.greeting.text.style.color = this.assets[this.timeOfDay].oneLineColor;
        this.greeting.select.value = this.timeOfDay;
        this.sun.element.style.top = this.sun[this.timeOfDay].top;
        this.sun.element.style.left = this.sun[this.timeOfDay].left;
        this.sun.rays.style.visibility = this.sun[this.timeOfDay].rays;
        this.chains.forEach((chain) => {
            chain.updateTimeOfDay(this.timeOfDay, this.assets[this.timeOfDay]);
        });
    }

    windowResizeHandler() {
        this.chains.forEach((chain) => {
            chain.demolish()
        });
        this.chains = [];
        this.element.innerHTML = '';
        this.element.innerWidth = window.innerWidth;
        this.element.innerHeight = window.innerHeight;
        this.drawDotGrid();
        this.start();
    }

    timeDropdownHandler() {
        this.greeting.select.addEventListener('change', (e) => {
            let boundFunc = this.updateTimeOfDay.bind(this)
            boundFunc(e.target.value);
        })
    }

    reloadQuadrant(quadrant) {
        this.quadrants.unshift(quadrant);
    }

    start() {
        this.chains.push(new Chain(this, this.quadrants.pop(), this.dimensions, this.maxChainLength, this.timeOfDay, this.assets[this.timeOfDay]))
        if (this.chains.length === 4) {
            console.log(this.chains)
            this.chains[0].demolish();
        }
    }
}

let wrapper = document.getElementById('fun-with-blocks');
wrapper.innerWidth = window.innerWidth;
wrapper.innerHeight = window.innerHeight;
let blockscape = new Blockscape(wrapper);
blockscape.start();