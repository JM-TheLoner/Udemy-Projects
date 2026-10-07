function myfunction (){
    var randomNumber1
    var randomNumber2
    var winner

    var randnum = Math.random()
    var randmult = randnum * 6
    var randomNumber1 = (Math.floor(randmult) + 1)

    var randnum1 = Math.random()
    var randmult1 = randnum1 * 6
    var randomNumber2 = (Math.floor(randmult1) + 1)

    var newimg = ('./images/dice' + randomNumber1 + '.png')
    var newimg1 = ('./images/dice' + randomNumber2 + '.png')

    document.querySelectorAll('.dice img')[0].setAttribute('src', newimg)
    document.querySelectorAll('.dice img')[1].setAttribute('src', newimg1)

    if (randomNumber1 > randomNumber2){
        winner = 'Player One Won'
    } else if (randomNumber1 < randomNumber2){
        winner = 'Player Two Won'
    } else{
        winner = "It's A Tie"
    }

    document.querySelector('h1').textContent=winner
}