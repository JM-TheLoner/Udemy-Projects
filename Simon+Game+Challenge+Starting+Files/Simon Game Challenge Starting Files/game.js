var gamePattern = []
var userClickedPattern=[]
var level = 0
var started = false

var buttonColors = ['red', 'blue', 'green', 'yellow']

function playSound(name){
    var audio = new Audio('./sounds/'+ name +'.mp3')        
    audio.play()
}

function animatePress(CurrentColour){
    $('#'+CurrentColour).addClass('pressed')
    setInterval(() => {
        $('#'+CurrentColour).removeClass('pressed')
    }, 150);
}

$('.btn').on('click', function(){
		var userChosenColor = this.id
        userClickedPattern.push(userChosenColor)
        playSound(userChosenColor)
        animatePress(userChosenColor)
        checkAnswer(userClickedPattern.lastIndexOf(userChosenColor))
})

$('body').keydown(function(){
        if (!started){
            nextSequence()
            $('h1').text('Level '+level)
            started=true
        } else{
            return started
        }
})

function checkAnswer(currentLevel){
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]){
        
        if(gamePattern.length === userClickedPattern.length){
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else{

        playSound('wrong')

        $('body').addClass('game-over')
        setInterval(() => {
            $('body').removeClass('game-over')
        }, 200);
    
        $('h1').text('Game Over. Press Any Key to Restart')

        startOver()
    }
}

function nextSequence(){
    userClickedPattern=[]

    rando = Math.random()
    randomNumber = Math.floor(rando * 4)

    var randomChosenColor = buttonColors[randomNumber]

    $('#'+randomChosenColor).fadeOut(100).fadeIn(100)

    gamePattern.push(randomChosenColor)

    playSound(randomChosenColor)

    level++

    $('h1').text('Level '+level)
}

function startOver(){
    level=0
    gamePattern=[]
    started=false
}
