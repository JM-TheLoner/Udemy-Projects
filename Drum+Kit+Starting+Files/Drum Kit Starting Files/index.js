var buts = document.querySelectorAll('button')
var butnum = buts.length

for (var i=0; i<butnum; i++){
    buts[i].addEventListener('click', function (){
        clicked(this.innerHTML)
        buttan(this.innerHTML)
    })
}

document.addEventListener('keydown', function (){
        clicked(event.key)
        buttan(event.key)
    })  

function clicked (word) {

    switch (word) {
        case 'w':
            var audio = new Audio('./sounds/tom-1.mp3')
            audio.play()
            break;
        case 'a':
            var audio = new Audio('./sounds/tom-2.mp3')
            audio.play()
            break;
        case 's':
            var audio = new Audio('./sounds/tom-3.mp3')
            audio.play()
            break;
        case 'd':
            var audio = new Audio('./sounds/tom-4.mp3')
            audio.play()
            break;
        case 'j':
            var audio = new Audio('./sounds/snare.mp3')
            audio.play()
            break;
        case 'k':
            var audio = new Audio('./sounds/crash.mp3')
            audio.play()
            break;
        case 'l':
            var audio = new Audio('./sounds/kick-bass.mp3')
            audio.play()
            break;
    
        default:
           console.log(this.innerHTML);
            break;
    }
}

function buttan (clickedThing){
    var active = document.querySelector('.'+clickedThing)

    active.classList.add('pressed')

    setTimeout(function() {
        active.classList.remove('pressed')
    }, 100);
}
