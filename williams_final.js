/*
Cassandra Williams CORE 101
Title: Star Sorter Thing
Description: Takes a catalog of stars and sorts them into a 3D chart
https://github.com/astronexus/HYG-Database
*/

var table
var stars = []
var buttonA
var buttonB
var buttonC
var mode
var font

function preload(){
    table = loadTable("assets/stars_shorter.csv")
    font = loadFont('/assets/inconsolata.otf');
}

function Star(table, index){
    this.mag = table.getNum(index, 2)
    this.absMag = table.getNum(index, 3)
    this.x = table.getNum(index, 7)
    this.y = table.getNum(index, 5)
    this.z = table.getNum(index, 6)
    this.curX = this.x
    this.curY = this.y
    this.curZ = this.z

    this.hold = table.getString(index, 4)
    for(var i = 0; i < this.hold.length || i < 3; i++){
        if(this.hold[i] == " ")
            i++
        if(i == 0){
            switch(this.hold[i]){
                case 'O':
                    this.spec = 220
                    break;
                case 'B':
                    this.spec = 200
                    break;
                case 'A':
                    this.spec = 180
                    break;
                case 'F':
                    this.spec = 60
                    break;
                case 'G':
                    this.spec = 40
                    break;
                case 'K':
                    this.spec = 20
                    break;
                case 'M':
                    this.spec = 0
                    break;
            }

        }

        if(this.hold[i] > -1){
            this.spec += this.hold[i]*2
            i = this.hold.length
        }
    }

    this.draw = function(){
        if(this.spec > 80)
            var d = this.spec-100
        else var d = this.spec

        var s = map(this.absMag, -26, 14.249, 4, 0.7)
        strokeWeight(s)

        var e = abs(map(d, 0, 140, -50, 50))
        stroke(this.spec, e, 100)

        var a = map(d, 0, 140, -1000, 1000)
        var b = map(this.absMag, -5.7, 13, -1000, 1000)
        var c = map(this.mag, 2.07, 13, -1000, 1000)
        
        switch(mode){
            case 0:
                this.curX = lerp(this.curX, this.x, 0.1)
                this.curY = lerp(this.curY, this.y, 0.1)
                this.curZ = lerp(this.curZ, this.z, 0.1)
                point(this.curX,this.curY,this.curZ)
                break
            case 1:
                this.curX = lerp(this.curX, a, 0.1)
                this.curY = lerp(this.curY, b, 0.1)
                this.curZ = lerp(this.curZ, c, 0.1)
                point(this.curX,this.curY,this.curZ)
                break
        }
    }
}

function setup(){
    createCanvas(700,700,WEBGL)
    angleMode(DEGREES)
    colorMode(HSB)
    noFill()
    camera(0, 0, 5000);
    mode = 0
    moving = 0

    buttonA = createButton('Default')
    buttonA.position(2,2)
    buttonA.mousePressed(def)

    buttonB = createButton('Sort')
    buttonB.position(70,2)
    buttonB.mousePressed(srt)

    buttonC = createButton('Reset Camera')
    buttonC.position(583,2)
    buttonC.mousePressed(rcam)

    textFont(font)
    textSize(100)
    textAlign(CENTER, CENTER)

    for(var i = 1; i < table.getRowCount(); i++){
        stars[i] = new Star(table, i)
    }
}

function draw(){
    background(0)
    orbitControl()

    if(mode == 1){
        strokeWeight(10)
        stroke(240, 58, 78)
        fill(240, 58, 78)
        line(-1000, 1000, -1000, -1000, -1000, -1000)
        line(-1000, -1000, -1000, -1000, -1000, 1000)
        line(-1000, -1000, -1000, 1000, -1000, -1000)

        push()
        translate(0, 0, -1000)
        text('spectral class', 0, -1100)
        pop()

        push()
        translate(-1000, -1100, 0)
        rotateY(90)
        text('magnitude', 0, 0)
        pop()

        push()
        translate(-1100, 0, -1000)
        rotate(-90)
        text('absolute magnitude', 0, 0)
        pop()
    }

    for(var i = 1; i < table.getRowCount(); i++){
        stars[i].draw()
    }
}

function def(){
    mode = 0
}

function srt(){
    mode = 1
}

function rcam(){
    camera(0, 0, 5000)
}