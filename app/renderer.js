const ipc = require('electron').ipcRenderer;
const fs = require('fs');

var image_paths = [];
var time_default = 3000;
var i = 0;
var running = 0;
var flag = 0;

var isPlay = true;
var isPause = false;


document.querySelectorAll('.button').forEach(button => button.innerHTML = '<div><span>' + button.textContent.trim().split('').join('</span><span>') + '</span></div>');



var animations = ['animate__animated animate__bounce', 'animate__animated animate__flash', 'animate__animated animate__pulse', 'animate__animated animate__rubberBand', 'animate__animated animate__shakeX', 'animate__animated animate__shakeY', 'animate__animated animate__headShake', 'animate__animated animate__swing',
'animate__animated animate__tada', 'animate__animated animate__wobble', 'animate__animated animate__jello', 'animate__animated animate__heartBeat'];

const buttonCreated = document.getElementById('upload');

buttonCreated.addEventListener('click', function (event) {
    
    running = 0;

    ipc.send('open-file-dialog-for-file')
});

ipc.on('selected-folder', function (event, path) {
    if(path.length == 0) {
        running = 1;
    }
    else {
        image_paths.length = 0;
        const location = document.querySelector('#folder-location');
        fs.readdir(path, function(err, files) {
            //handling error
            if(err) {
                location.value = 'unable to fetch directory';
                return console.log('unable to scan directory: ' + err);
            }
            location.value = path;
            var j = 0;
            //listening all files using forEach
            files.forEach(function(file) {
                let folder = new String();
                folder = path + "\\" + file;
                image_paths[j++] = folder;
            });
            
            var user_input = document.getElementById('time_interval').value;
            if(user_input.length != 0) {
                time_default = user_input*1000;
            }
            if(running == 0) {
                showImage();
            }
        });
    }
});

const pause = document.getElementById('pausebutton');

pause.addEventListener('click', function (event) {
    if(isPlay == true && isPause == false) {
        running = 0;
        flag = 1;
        isPause = true;
        isPlay = false;
    }
});

const play = document.getElementById('playbutton');

play.addEventListener('click', function(event) {
    if(isPause == true && isPlay == false) {
        flag = 0;
        showImage();
        isPause = false;
        isPlay = true;
    }
});

function dynamic_background() {
    
    //caching body tag to change the background style property.
    const body = document.querySelector('body');
    const direction = Math.round(Math.random() * 360); 

    const r1 = Math.round(Math.random() * 255); 
    const g1 = Math.round(Math.random() * 255); 
    const b1 = Math.round(Math.random() * 255); 
    // to add random transparency to the image;        
    const a1 = Math.round(Math.random() * 10) / 10; 
    const r2 = Math.round(Math.random() * 255);
    const g2 = Math.round(Math.random() * 255);
  
    const b2 = Math.round(Math.random() * 255);
    // to add random transparency to the image;
    const a2 = Math.round(Math.random() * 10) / 10;

    //Giving values to the linear gradiant.
    body.style.background = `linear-gradient(${direction}deg, rgba(${r1},${g1},${b1},${a1}), rgba(${r2},${g2},${b2},${a2}))`;
}

function showImage() {

    dynamic_background();

    running = 1;
    if(running == 1 && flag == 0)
    {
        document.slide.src = image_paths[i];

        if(i < image_paths.length - 1){ 
            i++;
        } else {
            i = 0;
        }
        setTimeout("showImage()", time_default);
    }
}

