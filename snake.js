var login = angular.module("login", []);

login.controller("loginControl", function($scope){
    $scope.colors = [
        {value:"lightGreen",name:"Yeşil"},
        {value:"pink",name:"Pembe"},
        {value:"yellow",name:"Sarı"},
        {value:"blue",name:"Lacivert"},
        {value:"#21BBC2",name:"Mavi"},
        {value:"white",name:"Beyaz"},
        {value:"red",name:"Kırmızı"},
        {value:"orange",name:" Turuncu"},
        {value:"brown",name:"Kahverengi"},
        {value:"purple",name:"Mor"}
    ]

    $scope.levels = [
        {value:13, name:"Kolay 😴"},
        {value:20, name:"Orta 😦"},
        {value:25, name:"Zor 😵"},
        {value:30, name:"Çok Zor 🥵"}
    ]

    gamers = []

    for (let [key, value] of Object.entries(localStorage)) {
        gamers.push(Object.assign({key,value}));
    }

    gamers.sort((b,a) => parseFloat(a.value) - parseFloat(b.value));

    $scope.gamers = gamers

    $scope.deleteGamer = function(gamerNick){
        localStorage.removeItem(gamerNick);
        alert(gamerNick + " Silindi");
        window.location.reload();
    }
});

timer = setInterval(checkSound, 1000 / 10)

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

musicCase = true

const bgSound = new Audio("https://www.mboxdrive.com/theme.mp3");
bgSound.volume = 0.05;
bgSound.loop = true;

function checkSound(){
    if(musicCase){
        bgSound.play()   
    }
    else{
        bgSound.pause()
    }
}

class RottenApple{
    constructor(px,py){
        this.positionX = px
        this.positionY = py
    }
}

const backgroundAudio = new Audio("https://www.mboxdrive.com/undertale-ost-100-megalovania.mp3");
backgroundAudio.volume = 0.1;
backgroundAudio.loop = true;

const gameOverAudio = new Audio("https://www.mboxdrive.com/akasya.mp3");
const pointAudio = new Audio("https://www.mboxdrive.com/super-mario-coin-sound.mp3")
pointAudio.volume = 0.2;

let scoreTable = document.getElementById("scoreTable");

const drawRect = (x,y,w,h,color) => {
    context.fillStyle = color;
    context.fillRect(x,y,w,h);
}

const drawText = (text,x,y,color) => {
    context.fillStyle = color;
    context.font = "17px Lucida Console"
    context.fillText(text,x,y);
}

class SnakeGame {

    constructor(gamerNick, snakeColor, gameLevel){
        document.addEventListener("keydown", this.onKeyPress.bind(this))
        this.gamer = gamerNick
        this.snakeColor = snakeColor;
        this.gameLevel = gameLevel;
    }

    init(){
        this.positionX = this.positionY = 10;
        this.appleX = this.appleY = 5;
        this.tailSize = 5;
        this.score = this.tailSize - 5;
        this.trail = [];
        this.gridSize = 20;
        this.tileCount = 30;
        this.score = 0;
        this.velocityX = this.velocityY = 0;
        this.rottenApple1 = new RottenApple(5,5)
        this.rottenApple2 = new RottenApple(6,6)
        this.rottenApple3 = new RottenApple(6,6)

        this.rottenApples = [this.rottenApple1]

        if(this.gameLevel > 13){
            this.rottenApples.push(this.rottenApple2)
        }

        if(this.gameLevel == 30){
            this.rottenApples.push(this.rottenApple3)
        }
    
        this.timer = setInterval(this.loop.bind(this), 1000 / Number(this.gameLevel))
        this.enemyTimer = setInterval(this.createRotters.bind(this), 1000/1)

        this.appleImg = new Image();
        this.appleImg.src = "https://github.com/deveross/HRMSProject/blob/master/Database%20Details/enenson.png?raw=true"

        this.background = new Image();
        this.background.src = "https://github.com/deveross/HRMSProject/blob/master/Project's%20Images/grass.png?raw=true"

        this.rottenAppleImage = new Image();
        this.rottenAppleImage.src = "https://github.com/deveross/HRMSProject/blob/master/Database%20Details/karaapple.png?raw=true";

        this.background.height = "50px";

        this.direction;

        this.nextLevel = false;
    }

    losing(){
        clearInterval(this.timer)
        clearInterval(this.enemyTimer)
        var gamerScore = localStorage.getItem(this.gamer);

        if(musicCase){
            gameOverAudio.play();
        }
        
        if (this.score > gamerScore){
            localStorage.setItem(this.gamer, this.score)
            this.gameOver(this.score,this.score,this.gamer);
        }
        else{
            this.gameOver(this.score,gamerScore,this.gamer);
        }

        this.reset()
        canvas.classList.remove("fadeInAnimation");
        canvas.classList.remove("fadeOutAnimation");
    }

    reset(){
        this.init();
    }


    loop(){
        this.update();
        this.draw();
    }

    createRotters(){
        this.rottenApples.forEach(r=>{
            r.positionX = Math.floor(Math.random() * this.tileCount);
            r.positionY = Math.floor(Math.random() * this.gridSize); 
        }) 
    }

    update(){
        this.positionX += this.velocityX;
        this.positionY += this.velocityY;

        this.trail.forEach(t=>{
            if(this.positionX === t.positionX && this.positionY === t.positionY && this.tailSize > 5){
                this.losing()
            }
        });

        this.rottenApples.forEach(r=>{
            if(this.positionX === r.positionX && this.positionY === r.positionY && this.tailSize >= 20){
                this.losing()
            }
        })
        
        this.trail.push({
            positionX : this.positionX,
            positionY : this.positionY
        })

        while(this.trail.length > this.tailSize){
            this.trail.shift();
        }

        if((this.appleX  == this.positionX) && (this.appleY == this.positionY)){

            if(musicCase){
                pointAudio.play();
            }

            this.tailSize++

            if(this.gameLevel == 13){
                this.score++;
            }
            if(this.gameLevel == 20){
                this.score += 2
            }
            if(this.gameLevel == 25){
                this.score += 3
            }
            if(this.gameLevel == 30){
                this.score += 4
            }
            
            this.appleX = Math.floor(Math.random() * this.tileCount);
            this.appleY = Math.floor(Math.random() * this.gridSize);
        }

        if(this.tailSize - 5 >= 10 || this.gameLevel == 30){
            canvas.style.border = "20px ridge red"
            canvas.style.borderRadius ="20px"
            this.nextLevel = true;
        }
        else{
            canvas.style.border = "1px solid white"
            this.nextLevel = false;
        }

        if(this.nextLevel){
            if(this.positionX < 0){
                this.losing()
            }
            if(this.positionY < 0){
                this.losing()
            }
            if(this.positionX > this.tileCount - 1){
                this.losing()
            }
            if(this.positionY > this.gridSize- 1){
                this.losing()
            }
        }

        else{
            if(this.positionX < 0){
                this.positionX = this.tileCount - 1 ;
            }

            if(this.positionY < 0){
                this.positionY = this.gridSize -1;
            }

            if(this.positionX > this.tileCount - 1){
                this.positionX = -1;
            }

            if(this.positionY > this.gridSize- 1){
                this.positionY = -1;
            }
        }
    }

    draw(){

        context.drawImage(this.background,0,0)

        drawText(this.gamer, 18, 25, "Yellow");

        drawText(this.score, canvas.width-30, 25,"white")

        switch(this.direction){
            case "right" : 
                drawRect(this.positionX*20+8,this.positionY*20+6.5, 25,7, "red");
                break
            case "left":
                drawRect(this.positionX*20-14,this.positionY*20+6.5, 25,7, "red");
                break
            case "up":
                drawRect(this.positionX*20+6.5,this.positionY*20-14, 7,25, "red");
                break
            case "down":
                drawRect(this.positionX*20+6.5,this.positionY*20+8, 7,25, "red");
                break
        }

        this.trail.forEach(t=>{
            drawRect(t.positionX * this.gridSize, t.positionY * this.gridSize, 19.9, 19.9, this.snakeColor)
        });

        context.drawImage(this.appleImg,this.appleX*this.gridSize, this.appleY*this.gridSize)

        if(this.tailSize >= 20){
            this.rottenApples.forEach(a=>{
                context.drawImage(this.rottenAppleImage,a.positionX*this.gridSize,a.positionY*this.gridSize)
            })
        }
    }


    onKeyPress(e){

        if(e.keyCode === 37 && this.velocityX !== 1){
            this.velocityX = -1;
            this.velocityY = 0;
            this.direction = "left";
        }
        if(e.keyCode === 38 && this.velocityY !== 1){
            this.velocityX = 0;
            this.velocityY = -1;
            this.direction = "up";
        }
        if(e.keyCode === 39 && this.velocityX !== -1){
            this.velocityX = 1;
            this.velocityY = 0;
            this.direction = "right";
        }
        if(e.keyCode === 40 && this.velocityY !== -1){
            this.velocityX = 0;
            this.velocityY = 1;
            this.direction = "down";
        }
    }

    gameOver(score,bestScore,gamer){
        canvas.classList.remove("fadInAnimation")
        canvas.classList.add("fadeOutAnimation")

        scoreTable.classList.remove("fadeOutAnimation")
        scoreTable.classList.add("fadeInAnimation")

        backgroundAudio.pause();

        document.getElementById("gamer").innerHTML = gamer;
        document.getElementById("score").innerHTML = score;
        
        document.getElementById("bestScore").innerHTML = bestScore;
    }

}


function playAgain(){
    scoreTable.classList.remove("fadeInAnimation")
    scoreTable.classList.add("fadeOutAnimation")

    canvas.classList.remove("fadOutAnimation")
    canvas.classList.add("fadeInAnimation")

    if(musicCase){
        backgroundAudio.play();
    }    
}


let form = document.getElementById("form");
let warningText = document.getElementById("warning");


function startGame(){
    let gamerNick = document.getElementById("nickName").value;
    let snakeColorBox = document.getElementById("snakeColor");
    let gameLevel = document.getElementById("gameLevel");
    

    var snakeColor_value = snakeColorBox.options[snakeColorBox.selectedIndex].value; 
    var gameLevel_value = gameLevel.options[gameLevel.selectedIndex].value;

    if(gamerNick != ""){
        form.classList.remove("fadeInAnimation")
        form.classList.add("fadeOutAnimation")

        canvas.classList.remove("fadeOutAnimation")
        canvas.classList.add("fadeInAnimation")

        if(musicCase){
            clearInterval(timer);
            bgSound.pause();
            backgroundAudio.play();
        }
        

        if(a == true){
            SnakeGame.removeProops()
            var game = new SnakeGame(gamerNick,snakeColor_value,gameLevel_value);
            game.init();
        }
        else{
            var game = new SnakeGame(gamerNick,snakeColor_value,gameLevel_value);
            game.init();
        }

        

        if(!localStorage.getItem(gamerNick)){
            localStorage.setItem(gamerNick,0)
        }
    }
    else{
        warningText.classList.add("fadeInAnimation")
    }
} 


var i = 2;

function transition(){
    let login = document.getElementById("login");
    let usersTable = document.getElementById("usersTable");
    let transitionButton = document.getElementById("fontAwesome")
    
    if(i%2 == 0){
        login.style.display = "none"
        usersTable.style.display = "block"
        transitionButton.classList.remove("fa-medal")
        transitionButton.classList.add("fa-gamepad")
        i++
        return;
    }

    if(i%2 == 1){
        login.style.display = "block"
        usersTable.style.display = "none"
        transitionButton.classList.remove("fa-gamepad")
        transitionButton.classList.add("fa-medal")
        i++
        return;
    }
    
}

a = 2
function soundOpnCls(){
    
    if(a%2 == 0){
        musicCase = false;
        sound.classList.remove("fa-volume-up")
        sound.classList.add("fa-volume-mute")
        a++
        return;
    }

    if(a%2 == 1){
        musicCase = true;
        sound.classList.remove("fa-volume-mute")
        sound.classList.add("fa-volume-up")
        a++
        return;
    }
    
}

function backToHome(){
    window.location.reload()
}

 