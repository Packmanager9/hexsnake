let foodchange = 1
let foodcounter = 0
const tutorial_canvas = document.getElementById("tutorial");
const tutorial_canvas_context = tutorial_canvas.getContext('2d');
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


tutorial_canvas.style.background = "black"



class Hexagon {
    constructor(x, y, size, color) {
        this.safe = 0
        this.center = new Bosscircle(x, y, size, "blue")
        this.nodes = []
        this.angle = 0
        this.size = size
        this.color = "black"
        this.pile = 0
        this.length = 10
        this.age = -1
        this.t = 0
        this.k = 0

        for (let t = 0; t < 6; t++) {
            let node = new Bosscircle(this.center.x + (this.size * (Math.cos(this.angle))), this.center.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
            this.nodes.push(node)
            this.angle += (Math.PI * 2) / 6
        }
    }
    draw() {
        if (this.age >= 1 || this == rectx.selected || this == food) {
            // if(this.age == .1){
            //     this.age=-1
            // }
            tutorial_canvas_context.fillStyle = this.color
            if (this == rectx.selected || this.age > 0) {

                tutorial_canvas_context.fillStyle = `rgb(${255 - this.age * 4},${0 + this.age * 4},${(255 / (this.age / 2))})`
                if (this == rectx.selected) {
                    tutorial_canvas_context.fillStyle = "orange"
                }
                if (this.age > 0 && this == rectx.selected) {
                    // rectx.length = rectx.length - this.age
                    if (rectx.length <= 0) {
                        // rectx.length = 1
                    }
                }
            }
            if (this == food) {

                if (this == rectx.selected || this.age > 0){// && this.age == Math.floor(this.age)) {
                    rectx.length++
                    let tg = 0
                    while (food.k * food.t == 0 || tg == 0 ) { //|| food.age != 0
                        food = rectx.blocks[Math.floor(rectx.blocks.length * Math.random())][Math.floor(rectx.blocks.length * Math.random())]
                        foodchange = 1
                        tg = 1
                    }
                }
                tutorial_canvas_context.fillStyle = "red"
            }
            tutorial_canvas_context.strokeStyle = "white"
            tutorial_canvas_context.lineWidth = 1
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
            for (let t = 1; t < this.nodes.length; t++) {
                tutorial_canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
            }
            tutorial_canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
            tutorial_canvas_context.fill()
            tutorial_canvas_context.stroke()
            tutorial_canvas_context.closePath()

        }
    }
}

class HexGrid {
    constructor(size) {
        this.deep = []
        this.deepsto = []
        this.blocks = []
        this.size = size
        this.length = 20
        for (let t = 0; t < tutorial_canvas.width - Math.round(size * 16); t += Math.round(size * 16)) {
            this.holdblocks = []
            let y = 0
            for (let k = 0; k < tutorial_canvas.height + 1; k += Math.round(size * 16)) {
                if (y % 2 == 0) {
                    const rect = new Hexagon(k, t, Math.round(size * 10), "white")
                    rect.draw()
                    rect.t = Math.floor(t / Math.round(size * 16))
                    rect.k = Math.floor(k / Math.round(size * 16))
                    rect.neighbors = []
                    this.holdblocks.push(rect)

                } else {

                    const rect = new Hexagon(k, t + Math.round(size * 8), Math.round(size * 10), "red")

                    rect.draw()
                    rect.t = Math.floor(t / Math.round(size * 16))
                    rect.k = Math.floor(k / Math.round(size * 16))
                    rect.neighbors = []
                    this.holdblocks.push(rect)
                }
                y++
            }
            this.blocks.push([...this.holdblocks])
        }
        this.selected = this.blocks[Math.floor(this.blocks.length * .5)][Math.floor(this.blocks.length * .5)]

        for (let t = 0; t < this.blocks.length; t++) {
            for (let k = 0; k < this.blocks[t].length; k++) {
                for (let s = 0; s < this.blocks.length; s++) {
                    for (let f = 0; f < this.blocks[t].length; f++) {
                        if (this.blocks[t][k].center.repelCheck(this.blocks[s][f].center)) {
                            if (t == s && k == f) {

                            } else {
                                this.blocks[t][k].neighbors.push(this.blocks[s][f])
                            }
                        }
                    }
                }
            }
        }
    }
    draw() {

        this.runs = 0
        this.runx = 0
        this.steer()
        for (let t = 0; t < this.blocks.length; t++) {
            for (let k = 0; k < this.blocks[t].length; k++) {
                this.blocks[t][k].draw()
            }
        }
    }
    clear() {
    }
    deeplook() {
        this.bumper = 0
        if (foodchange == 0) {
            return true
        }else{
            foodcounter++
            if(foodcounter > 10000){
                foodcounter = 0
                return true
            }
        }
        let bumpcen = 0
        this.mark = 0
        this.whammy = 0
        this.stobase = this.selected
        this.thing = this.selected

        let bet = this.thing.neighbors.length

        for (let f = 0; f < this.thing.neighbors.length; f++) {
            if (this.thing.neighbors[f].age > 0 || this.deep.includes(this.thing.neighbors[f]) || this.thing.neighbors[f] == this.thing) {
                bet--
            }
        }

        if (bet == 0) {
            return false
        }
        this.deep = [this.selected]
        this.deepsto = [this.stobase]
        this.angle = Math.atan2(-(this.thing.center.y - food.center.y), -(this.thing.center.x - food.center.x))
        this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
        for (let t = 0; t < this.length * 2; t++) {
            this.whammy = 0
            this.spoke = 0
            for (let k = 0; k < this.thing.neighbors.length; k++) {
                if (!this.deep.includes(this.thing.neighbors[k])) {
                    if (this.thing.neighbors[k].center.isPointInside(this.projexteddot)) {
                        if (this.thing.neighbors[k].age < this.deep.length-1) {
                            if (this.thing == food) {
                                foodchange = 0
                                return true
                            }

                           
                            let bet = this.thing.neighbors.length

                            for (let f = 0; f < this.thing.neighbors.length; f++) {
                                if (this.thing.neighbors[f].age > 0 || this.deep.includes(this.thing.neighbors[f]) || this.thing.neighbors[f] == this.thing) {
                                    bet--
                                }
                            }

                            if (bet == 0) {
                                this.spoke++
                                if(this.spoke>=this.thing.neighbors.length){
                                    return false
                                }
                            }else {
                                this.deep.push(this.thing.neighbors[k])
                                this.thing.safe = k
                                this.thing = this.thing.neighbors[k]
                                this.thing.center.draw()
                                bumpcen++
                                this.angle = Math.atan2(-(this.thing.center.y - food.center.y), -(this.thing.center.x - food.center.x))
                                this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
                                // k = 0
                                if (t < this.length) {
                                    // if(t <= 5){

                                    // if(Math.random()<.1){
                                    //     this.angle = Math.atan2((this.thing.center.x - food.center.x), (this.thing.center.y - food.center.y))
                                    //     this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
                                    //     k = 0
                                    // }
                                    // if(Math.random()<.1){
                                    //     this.angle = Math.atan2((this.thing.center.y - food.center.y), (this.thing.center.x - food.center.x))
                                    //     this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
                                    //     k = 0
                                    // }
                                    // if(Math.random()<.91){

                                    this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos((((((Math.random() * 6)) * ((Math.PI * 2)))))) * this.size * 16), this.thing.center.y + (Math.sin((((((Math.random() * 6)) * ((Math.PI * 2)))))) * this.size * 16), .3, "red")
                                    
                                    if(Math.random()<.5){
                                        this.angle = Math.atan2(-(this.thing.center.y - food.center.y), -(this.thing.center.x - food.center.x))
                                        this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
                                            }
                                    k = 0
                                    this.bumper++
                                    if (this.bumper > 3) {
                                        // return true
                                    }

                                    // }
                                    // }
                                    // if(Math.random()<.12){
                                    //     this.angle = Math.atan2((this.thing.center.y - food.center.y), (this.thing.center.x - food.center.x))
                                    //     this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")

                                    // }
                                } else {
                                    //  return true

                                }
                                this.stobase = this.thing
                                this.mark++
                                this.whammy = 1
                            }


                            break
                        } else {
                            this.angle = Math.atan2((this.thing.center.y - food.center.y), (this.thing.center.x - food.center.x))
                            this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle + ((((1 + Math.floor(Math.random() * 6)) * ((Math.PI * 2)) / 6)))) * this.size * 16), this.thing.center.y + (Math.sin(this.angle + ((((1 + Math.floor(Math.random() * 6)) * ((Math.PI * 2)) / 6)))) * this.size * 16), 3, "red")

                            this.mark++
                            this.whammy = 1

                            //maybe this area could work?
                            // for(let n = 0;n<this.thing.neighbors.length;n++){
                            //     let h = Math.floor(Math.random() * this.thing.neighbors.length)
                            //         if(this.thing.neighbors[h].age < t){
                            //             if(!this.deep.includes(this.thing.neighbors[h])){
                            //                 this.deep.push(this.thing.neighbors[h])
                            //                 this.thing = this.thing.neighbors[h]
                            //                 this.stobase = this.thing
                            //                 if(t == 0){
                            //                     this.thing.safe = h
                            //                 }
                            //                 if(this.thing == food){
                            //                     return true
                            //                 }
                            //                 break
                            //             }
                            //         }
                            // }


                        }
                    }
                }
            }
            // if(this.whammy == 0){
            for (let g = 0; g < this.length * 2; g++) {
                if (this.mark >= this.length + 1) {
                    for (let k = 0; k < this.thing.neighbors.length * 10; k++) {
                        let h = Math.floor(Math.random() * this.thing.neighbors.length)
                        if (this.thing.neighbors[h].age < this.deep.length-1) {
                            if (!this.deep.includes(this.thing.neighbors[h])) {
                                if (this.thing == food) {
                                    foodchange = 0
                                    return true
                                }

                                let bet = this.thing.neighbors.length

                                for (let f = 0; f < this.thing.neighbors.length; f++) {
                                    if (this.thing.neighbors[f].age > 0 || this.deep.includes(this.thing.neighbors[f]) || this.thing.neighbors[f] == this.thing) {
                                        bet--
                                    }
                                }

                                if (bet == 0) {
                                    return false
                                }
                                // if (g == 0) {
                                    this.thing.safe = h
                                // }
                                this.deep.push(this.thing.neighbors[h])
                                this.thing = this.thing.neighbors[h]
                                this.stobase = this.thing
                                this.thing.center.draw()
                                bumpcen++

                                break
                            }
                        }
                    }
                }
            }
            // }

        }

        this.deep.push(this.thing)
        let wet = this.thing.neighbors.length

        if (this.deep.length > this.length) {
            // return true
        }
        if (bumpcen > this.length) {
            // return true
        }
        for (let k = 0; k < this.thing.neighbors.length; k++) {
            if (this.thing.neighbors[k].age > 0 || this.thing.neighbors[k] == this.thing) {
                wet--
            }
        }
        if (wet == 0) {
            // if(!this.deeplook()){
            return false
            // }
        }
        // return true
        if (this.thing == food) {
            foodchange = 0
            return true
        }

        return false
    }

    // predict(thing){
    //     this.thing = thing
    //     this.selectedstox = this.thing
    //     this.angle = Math.atan2(-(this.thing.center.y - food.center.y), -(this.thing.center.x - food.center.x))
    //     this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
    //     for (let t = 0; t < this.thing.neighbors.length; t++) {
    //         let k = Math.floor(Math.random() * this.thing.neighbors.length)
    //         if (this.thing.neighbors[k].center.repelCheck(this.projexteddot)) {
    //             if (this.thing.neighbors[k].age <= 0 && this.thing.neighbors[k] != this.selected) {
    //                 if(this.runx == 0){
    //                     this.runx = 1
    //                     if(this.predict2(this.thing.neighbors[k])){
    //                         this.thing = this.thing.neighbors[k]
    //                         break
    //                     }
    //                 }
    //             } else {
    //                 let num = 1.1
    //                 if (Math.random() < .5) {
    //                     num = -1.1
    //                 }
    //                 this.angle += ((Math.PI * 2) / (6)) * num
    //                 this.projexteddot = new Bosscircle(this.thing.center.x + (Math.cos(this.angle) * this.size * 16), this.thing.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
    //             }
    //         }
    //     }

    //     if (this.thing == this.selectedstox) {
    //         return false
    //     }
    //     return true
    // }

    // predict2(thing2){
    //     this.thing2 = thing2
    //     this.selectedstoy = this.thing2
    //     this.angle = Math.atan2(-(this.thing2.center.y - food.center.y), -(this.thing2.center.x - food.center.x))
    //     this.projexteddot = new Bosscircle(this.thing2.center.x + (Math.cos(this.angle) * this.size * 16), this.thing2.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
    //     if (this.thing2 == this.selectedstoy) {
    //         for (let t = 0; t < this.thing2.neighbors.length*10; t++) {
    //             let k = Math.floor(Math.random() * this.thing2.neighbors.length)
    //             if (this.thing2.neighbors[k].age <= 0 && this.thing2.neighbors[k] != this.thing && this.thing2.neighbors[k] != this.selected) {
    //                 if(this.predict3(this.thing2.neighbors[k])){
    //                     this.thing2 = this.thing2.neighbors[k]
    //                     break
    //                 }
    //             }
    //         }
    //     }
    //     if (this.thing2 == this.selectedstoy) {
    //         return false
    //     }
    //     return true
    // }

    // predict3(thing3){
    //     this.thing3 = thing3
    //     this.selectedstoz = this.thing3
    //     this.angle = Math.atan2(-(this.thing3.center.y - food.center.y), -(this.thing3.center.x - food.center.x))
    //     this.projexteddot = new Bosscircle(this.thing3.center.x + (Math.cos(this.angle) * this.size * 16), this.thing3.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
    //     if (this.thing3 == this.selectedstoz) {
    //         for (let t = 0; t < this.thing3.neighbors.length*10; t++) {
    //             let k = Math.floor(Math.random() * this.thing3.neighbors.length)
    //             if (this.thing3.neighbors[k].age <= 0 && this.thing3.neighbors[k] != this.thing && this.thing3.neighbors[k] != this.thing2 && this.thing3.neighbors[k] != this.selected) {
    //                     this.thing3 = this.thing3.neighbors[k]
    //                 break
    //             }
    //         }
    //     }
    //     if (this.thing3 == this.selectedstoz) {
    //         return false
    //     }
    //     return true
    // }

    // // thing
    // // thing storage


    steer() {
        // foodcounter = 0
        this.selectedsto = this.selected
        this.angle = Math.atan2(-(this.selected.center.y - food.center.y), -(this.selected.center.x - food.center.x))
        this.projexteddot = new Bosscircle(this.selected.center.x + (Math.cos(this.angle) * this.size * 16), this.selected.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")

        for (let t = 0; t < this.selected.neighbors.length; t++) {
            if (this.selected.neighbors[t].center.repelCheck(this.projexteddot)) {
                if (this.selected.neighbors[t].age <= 0) {
                    if ((this.deeplook() || foodchange == 0 ) || (this.selected == food)) {
                        this.selected.age = this.length
                        this.runx = 0

                        let bet = this.thing.neighbors.length

                        for (let k = 0; k < this.thing.neighbors.length; k++) {
                            if (this.thing.neighbors[k].age > 0) {
                                bet--
                            }
                        }
                        if (bet == 0) {
                        } else {
                            this.selected = this.selected.neighbors[this.selected.safe]
                            for (let n = 0; n < this.blocks.length; n++) {
                                for (let k = 0; k < this.blocks[n].length; k++) {
                                    if (this.blocks[n][k].age > 0) {
                                        this.blocks[n][k].age--
                                    }
                                }
                            }
                            break
                        }
                    } else {
                        break
                    }

                }
                //  else {
                //     let num = 1.1
                //     if (Math.random() < .5) {
                //         num = -1.1
                //     }
                //     this.angle += ((Math.PI * 2) / (6)) * num
                //     this.projexteddot = new Bosscircle(this.selected.center.x + (Math.cos(this.angle) * this.size * 16), this.selected.center.y + (Math.sin(this.angle) * this.size * 16), 3, "red")
                // }
            }
        }
        if (this.selected == this.selectedsto) {
            for (let t = 0; t < this.selected.neighbors.length * 10; t++) {
                let k = Math.floor(Math.random() * this.selected.neighbors.length)
                if ((this.deeplook() || foodchange == 0)  ) {
                    if (this.selected.neighbors[this.selected.safe].age <= 0) {
                        this.runx = 0
                        this.selected.age = this.length
                        this.selected = this.selected.neighbors[this.selected.safe]
                        for (let n = 0; n < this.blocks.length; n++) {
                            for (let g = 0; g < this.blocks[n].length; g++) {
                                if (this.blocks[n][g].age > 0) {
                                    this.blocks[n][g].age--
                                }
                            }
                        }
                        break
                    }
                }
            }
        }

        if (this.selected == this.selectedsto) {
            if (this.runs == 0) {
                this.runs = 1
                this.steer()
            }
            for (let n = 0; n < this.blocks.length; n++) {
                for (let g = 0; g < this.blocks[n].length; g++) {
                    if (this.blocks[n][g].age > 0) {
                        // this.blocks[n][g].age = 0
                        // this.length = 0
                    }
                }
            }
        }
    }


    control() {
        this.projexteddot = new Bosscircle(this.selected.center.x + (gamepadAPI.axesStatus[0] * this.size * 16), this.selected.center.y + (gamepadAPI.axesStatus[1] * this.size * 16), 3, "red")
        // this.projexteddot.draw()
        for (let t = 0; t < this.selected.neighbors.length; t++) {
            if (this.selected.neighbors[t].center.repelCheck(this.projexteddot)) {
                this.selected.age = this.length
                this.selected = this.selected.neighbors[t]
                for (let t = 0; t < this.blocks.length; t++) {
                    for (let k = 0; k < this.blocks[t].length; k++) {
                        if (this.blocks[t][k].age > 0) {
                            this.blocks[t][k].age--
                        }
                    }
                }
                break
            }
        }

        // this.projexteddot = new Bosscircle(this.selected.center.x+(gamepadAPI.axesStatus[0]*this.size*16),this.selected.center.y+(gamepadAPI.axesStatus[1]*this.size*16), 3, "red" )
        // this.projexteddot2 = new Bosscircle(this.selected.center.x+(gamepadAPI.axesStatus[0]*this.size*36),this.selected.center.y+(gamepadAPI.axesStatus[1]*this.size*36), 3, "red" )
        // this.biglink = new Line(this.selected.center.x, this.selected.center.y,this.projexteddot2.x, this.projexteddot2.y, "red", 6)
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
food = rectx.blocks[Math.floor(rectx.blocks.length * Math.random())][Math.floor(rectx.blocks.length * Math.random())]

let counterx = 0

let shakeoutyes = 0
let counter = 0
window.setInterval(function () {
    counterx++
    tutorial_canvas_context.clearRect(0, 0, tutorial_canvas.width, tutorial_canvas.height)
    gamepadAPI.update()
    rectx.draw()
    // rectx.biglink.draw()
    // if (Math.random() < .01) {
    if(counterx%rectx.length <= 1 || Math.random()<.001){
        foodchange = 1
        counterx = 1
    }
}, 1)
