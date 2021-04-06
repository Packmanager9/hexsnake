const tutorial_canvas = document.getElementById("tutorial");
const tutorial_canvas_context = tutorial_canvas.getContext('2d');
let totalsaws = 110
let whackout = -1

let rectx = {}
rectx.selected = {}
const gamepadAPI = {
    controller: {},
    turbo: true,
    connect: function (evt) {
        if (navigator.getGamepads()[0] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[1] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[2] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[3] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        }
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] === null) {
                continue;
            }
            if (!gamepads[i].connected) {
                continue;
            }
        }
    },
    disconnect: function (evt) {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
    },
    update: function () {
        gamepadAPI.controller = navigator.getGamepads()[0]
        gamepadAPI.buttonsCache = [];// clear the buttons cache
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        gamepadAPI.buttonsStatus = [];// clear the buttons status
        var c = gamepadAPI.controller || {}; // get the gamepad object
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                if (c.buttons[b].pressed) {
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                axes.push(c.axes[a].toFixed(2));
            }
        }
        gamepadAPI.axesStatus = axes;// assign received values
        gamepadAPI.buttonsStatus = pressed;
        // console.log(pressed); // return buttons for debugging purposes
        return pressed;
    },
    buttonPressed: function (button, hold) {
        var newPress = false;
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
            if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                newPress = true;// set the boolean variable to true
                if (!hold) {// if we want to check the single press
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                        if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                            newPress = false;
                        }
                    }
                }
            }
        }
        return newPress;
    },
    buttons: [
        'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
    ],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};

const pausebtn = document.getElementById("pause");
const clearbtn = document.getElementById("clear");
let pausedvec =  1
pausebtn.onclick = flip
function flip() {
    pausedvec*=-1
    if(pausedvec == -1){
        pausebtn.innerText = "unpause"
    }else{
        pausebtn.innerText = "pause"
    }
}
clearbtn.onclick = clear

function clear() {
    rectx.clear()
}

tutorial_canvas.style.background = "black"


let tip = {}
let flex = tutorial_canvas.getBoundingClientRect();
let xs
let ys

window.addEventListener('mousedown', e => {
    
    flex = tutorial_canvas.getBoundingClientRect();
    xs = e.clientX - flex.left;
    ys = e.clientY - flex.top;
    tip.x = xs
    tip.y = ys
    tip.body = tip

    for (let t = 0; t < rectx.blocks.length; t++) {
        for (let k = 0; k < rectx.blocks[t].length; k++) {
            if (rectx.blocks[t][k].center.isPointInside(tip)) {
                rectx.blocks[t][k].pile++
                rectx.blocks[t][k].shakeout()
                break
            }
        }
    }

});


class Hexagon{
    constructor(x,y, size, color){
        this.center = new Bosscircle(x,y,size, "transparent")
        this.nodes = []
        this.angle = 0
        this.size = size
        this.color = color
        this.pile = 0
        this.length = 10
        this.age = 0
        this.t = 0
        this.k = 0

        for(let t = 0;t<6;t++){
            let node = new Bosscircle(this.center.x+(this.size*(Math.cos(this.angle))), this.center.y+(this.size*(Math.sin(this.angle))), 0, "transparent")
            this.nodes.push(node)
            this.angle += (Math.PI*2)/6
        }
    }
    shakeout(){
        // if(this.pile >= 6){
        //     shakeoutyes = 1
        //     this.pile -=6
        //     if(this.k%2 == 0){
        //         // console.log("working", this.t,this.k)
        //         if(this.k > 0 && this.t > 0){
        //             rectx.blocks[this.t-1][this.k-1].pile +=1 // check ^
        //         }
        //         if(this.t > 0){
        //             rectx.blocks[this.t-1][this.k].pile +=1
        //         } 
        //         if(this.k > 0){
        //             rectx.blocks[this.t][this.k-1].pile +=1
        //         }
        //         if(this.k < rectx.blocks.length && this.t > 0){
        //             rectx.blocks[this.t-1][this.k+1].pile +=1
        //         }
        //         if(this.t < rectx.blocks.length){
        //             rectx.blocks[this.t+1][this.k].pile +=1
        //         }
    
        //         if(this.k < rectx.blocks.length){
        //             rectx.blocks[this.t][this.k+1].pile +=1
        //         }
        //     }else{
        //         // console.log("broken", this.t,this.k)
        //         if(this.t > 0){
        //             rectx.blocks[this.t-1][this.k].pile +=1 // !
        //         }
        //         // if(this.t > 0 && this.k > 0){
        //         //     // rectx.blocks[this.t-1][this.k-1].pile +=1 // check ^< +
        //         // } 
        //         if(this.k < rectx.blocks.length){
        //             rectx.blocks[this.t+1][this.k].pile +=1 // !V
        //         }
        //         if(this.t < rectx.blocks.length){
        //             rectx.blocks[this.t][this.k+1].pile +=1 // !
        //         }
        //         if(this.t > 0){
        //             rectx.blocks[this.t+1][this.k-1].pile +=1 // !
        //         }

        //         if(this.k > 0){
        //             rectx.blocks[this.t][this.k-1].pile +=1 // !
        //         }

        //         if(this.t < rectx.blocks.length && this.k < rectx.blocks.length){
        //             rectx.blocks[this.t+1][this.k+1].pile +=1 // check >^ +
        //         }
        //     }
            
             
            
        // }
    }
    draw(){
        // this.nodes = []
        // for(let t = 0;t<6;t++){
        //     let node = new Bosscircle(this.center.x+(this.size*(Math.cos(this.angle))), this.center.y+(this.size*(Math.sin(this.angle))), 0, "transparent")
        //     this.nodes.push(node)
        //     this.angle += (Math.PI*2)/6
        // }
        // if(this.pile == 0){
        //     tutorial_canvas_context.fillStyle = "#FFFFFF"
            tutorial_canvas_context.fillStyle = "black"
        // }else if(this.pile == 1){
        //     tutorial_canvas_context.fillStyle = "#EEEEEE"
        //     tutorial_canvas_context.fillStyle = "cyan"
        // }else if(this.pile == 2){
        //     tutorial_canvas_context.fillStyle = "#DDDDDD"
        //     tutorial_canvas_context.fillStyle = "magenta"
        // }else if(this.pile == 3){
        //     tutorial_canvas_context.fillStyle = "#CCCCCC"
        //     tutorial_canvas_context.fillStyle = "red"
        // }else if(this.pile == 4){
        //     tutorial_canvas_context.fillStyle = "#BBBBBB"
        //     tutorial_canvas_context.fillStyle = "orange"
        // }else if(this.pile == 5){
        //     tutorial_canvas_context.fillStyle = "#AAAAAA"
        //     tutorial_canvas_context.fillStyle = "yellow"
        // }else{

    
            if(this == rectx.selected || this.age > 0){

                tutorial_canvas_context.fillStyle =`rgb(${255-this.age*7},${0+this.age*7},${(255/(this.age/2))})`
                if(this == rectx.selected){
                    tutorial_canvas_context.fillStyle = "orange"
                }
            }
            if(this == food){
    
                if(this == rectx.selected || this.age > 0){
                    rectx.length++
                food = rectx.blocks[Math.floor(rectx.blocks.length*Math.random())][Math.floor(rectx.blocks.length*Math.random())]
                }
                tutorial_canvas_context.fillStyle = "red"
            }
        //     tutorial_canvas_context.fillStyle = "black"
        // }
        // if(this.t == 6 && this.k == 4){
        //     tutorial_canvas_context.fillStyle = "red"
        // }
        // tutorial_canvas_context.fillStyle = this.color
        tutorial_canvas_context.strokeStyle = "white"
        tutorial_canvas_context.lineWidth = 1
        tutorial_canvas_context.beginPath()
        tutorial_canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
        for(let t = 1;t<this.nodes.length;t++){
            tutorial_canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
        }
        tutorial_canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
        tutorial_canvas_context.fill()
        tutorial_canvas_context.stroke()
        tutorial_canvas_context.closePath()

    }
}

class HexGrid{
    constructor(size) {
        this.blocks = []
        this.size = size
        this.length = 10
        for (let t = 0; t < tutorial_canvas.width+1; t += Math.round(size*16)) {
            this.holdblocks = []
            let y = 0
            for (let k = 0; k < tutorial_canvas.height+1; k += Math.round(size*16)) {
                if(y%2==0){
                    const rect = new Hexagon(k, t, Math.round(size*10), "white")
                    rect.draw()
                    rect.t = Math.floor(t / Math.round(size*16))
                    rect.k = Math.floor(k / Math.round(size*16))
                    rect.neighbors = []
                    this.holdblocks.push(rect)

                }else{

                const rect = new Hexagon(k, t+Math.round(size*8), Math.round(size*10), "red")
            
                rect.draw()
                rect.t = Math.floor(t / Math.round(size*16))
                rect.k = Math.floor(k / Math.round(size*16))
                rect.neighbors = []
                this.holdblocks.push(rect)
                }
                y++
            }
            this.blocks.push([...this.holdblocks])
        }
        this.selected = this.blocks[Math.floor(this.blocks.length*.5)][Math.floor(this.blocks.length*.5)]

        for(let t = 0;t<this.blocks.length;t++){
            for(let k = 0;k<this.blocks[t].length;k++){
                for(let s = 0;s<this.blocks.length;s++){
                    for(let f = 0;f<this.blocks[t].length;f++){
                        if(this.blocks[t][k].center.repelCheck(this.blocks[s][f].center)){
                            if(t == s && k == f){

                            }else{
                                this.blocks[t][k].neighbors.push(this.blocks[s][f])
                            }
                        }
                    }
                }
            }
        }
    }
    draw() {

        this.control()
        for (let t = 0; t < this.blocks.length; t++) {
            for (let k = 0; k < this.blocks[t].length; k++) {
                this.blocks[t][k].draw()
                // console.log(this.blocks[t][k])
            }
        }

        // for(let f = 0;f< this.blocks.length;f++){
        //     for (let t = 0; t < this.blocks.length; t++) {
        //         for (let k = 0; k < this.blocks[t].length; k++) {
        //             this.blocks[t][k].shakeout()
        //         }
        //     }
        // }
    }
    clear(){
        // for(let f = 0;f< this.blocks.length;f++){
        //     for (let t = 0; t < this.blocks.length; t++) {
        //         for (let k = 0; k < this.blocks[t].length; k++) {
        //             this.blocks[t][k].pile = 0
        //         }
        //     }
        // }
    }
    control(){
        // this.selected.center.x++
        // console.log(gamepadAPI)
        let projexteddot = new Bosscircle(this.selected.center.x+(gamepadAPI.axesStatus[0]*this.size*16),this.selected.center.y+(gamepadAPI.axesStatus[1]*this.size*16), 3, "red" )
        projexteddot.draw()
        for(let t = 0;t<this.selected.neighbors.length; t++){
            if(this.selected.neighbors[t].center.repelCheck(projexteddot)){
                this.selected.age=this.length
                // console.log(this.selected)
                this.selected=this.selected.neighbors[t]
                for (let t = 0; t < this.blocks.length; t++) {
                    for (let k = 0; k < this.blocks[t].length; k++) {
                        if(this.blocks[t][k].age > 0){
                            this.blocks[t][k].age--
                        }
                    }
                }

                break
            }
        }
    }
}

class Line {
    constructor(x, y, x2, y2, color, width) {
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.width = width
        this.dir = 0
    }
    hypotenuse() {
        const xdif = this.x1 - this.x2
        const ydif = this.y1 - this.y2
        const hypotenuse = (xdif * xdif) + (ydif * ydif)
        return Math.sqrt(hypotenuse)
    }
    draw() {
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.lineWidth = this.width
        tutorial_canvas_context.beginPath()
        tutorial_canvas_context.moveTo(this.x1, this.y1)
        tutorial_canvas_context.lineTo(this.x2, this.y2)
        tutorial_canvas_context.stroke()
        tutorial_canvas_context.lineWidth = 1
    }
}
class Bosscircle {
    constructor(x, y, radius, color, xmom = 0, ymom = 0) {
        this.height = 0
        this.width = 0
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.xmom = xmom
        this.ymom = ymom
    }
    draw() {
        tutorial_canvas_context.fillStyle = this.color
        tutorial_canvas_context.lineWidth = 0
        tutorial_canvas_context.strokeStyle = this.color
        tutorial_canvas_context.beginPath();
        if (this.radius < 1) {
            this.radius = 1
        }
        tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
        tutorial_canvas_context.fill()
        tutorial_canvas_context.stroke();
    }
    move() {
        this.x += this.xmom
        this.y += this.ymom
        if (this.x + this.radius > tutorial_canvas.width) {
            this.x = tutorial_canvas.width - this.radius
            if (this.xmom > 0) {
                this.xmom *= -1
            }
        }
        if (this.y + this.radius > tutorial_canvas.height) {
            this.y = tutorial_canvas.height - this.radius
            if (this.ymom > 0) {
                this.ymom *= -1
            }
        }
        if (this.x - this.radius < 0) {
            this.x = 0 + this.radius
            if (this.xmom < 0) {
                this.xmom *= -1
            }
        }
        if (this.y - this.radius < 0) {
            this.y = 0 + this.radius
            if (this.ymom < 0) {
                this.ymom *= -1
            }
        }
    }
    isPointInside(point) {
        let link = new Line(this.x, this.y, point.x, point.y, "red", 1)
        if (link.hypotenuse() <= this.radius) {
            return true
        }
        return false
    }
    repelCheck(point) {
        let link = new Line(this.x, this.y, point.x, point.y, "red", 1)
        if (link.hypotenuse() <= this.radius + point.radius) {
            return true
        }
        return false
    }
}

let food = {}
 rectx = new HexGrid(2)
 food = rectx.blocks[Math.floor(rectx.blocks.length*Math.random())][Math.floor(rectx.blocks.length*Math.random())]

let shakeoutyes = 0
let counter = 0
window.setInterval(function () {
    tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)
    rectx.draw()
    counter++
    if(counter%4 == 0){

        // rectx.blocks[Math.floor(rectx.blocks.length*.5)][Math.floor(rectx.blocks.length*.5)].pile++
    }
    gamepadAPI.update()
}, 50)


function getRandomLightColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 14) + 1)];
    }
    return color;
}
