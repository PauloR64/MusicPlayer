
const song = document.getElementById('audio');
const effects = document.getElementById('effects');
const cover = document.getElementById('cover');
const songName = document.getElementById('song-name');
const bandName = document.getElementById('band-name');
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const botão = document.getElementById('play');
const shuffle = document.getElementById('shuffle');
const currentprogress = document.getElementById('current-progress');
const containerprogress = document.getElementById('container-progress');
const repeatButton = document.getElementById('repeat');
const songTime = document.getElementById('song_time');
const totalTime = document.getElementById('total_time');
const likeButton = document.getElementById('like');

const playList = [
    {
        songName :"Castlevania II 'Bloody Tears'",
        artist:'Castlevania',
        file :"🎵 Castlevania II 'Bloody Tears' ｜ NES vs. Famicom Remix",
        liked: false
    },
    {
        songName :"At the Bottom of Night",
        artist:'Chrono Trigger',
        file :"Chrono Trigger OST_ At the Bottom of Night",
        liked: false
    },
    {
        songName :"Captain of Shooting Stars",
        artist:'live-a-live',
        file :"Live A Live Music Captain of Shooting Stars",
        liked: false
    },
    {
        songName :"Frozen Flame",
        artist:'Chrono Cross',
        file :"Radical Dreamers - Frozen Flame",
        liked: false
    }
];

const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? playList;

let index = 0;
let isShuffle = false;
let repeatOn = false;
let sortedPlayList = [...originalPlaylist];

const PlayPause = () => {
    if (botão.innerHTML !== '<i class="bi bi-pause-circle-fill"></i>'){
        botão.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
        song.play();
    }else {
        botão.innerHTML = '<i class="bi bi-play-circle-fill">';
        song.pause();
    };
    
};

const initializeSong = () => {
    cover.src = `./capas/${sortedPlayList[index].artist}.jpg`;
    song.src = `./songs/${sortedPlayList[index].file}.mp3`;
    songName.innerText = sortedPlayList[index].songName;
    bandName.innerText = sortedPlayList[index].artist;
    likeButtonAct();
};

const preSong = () => {
    if (index === 0) {
        index = sortedPlayList.length - 1;
    }else {
        index -= 1;
    }
    initializeSong();
    song.play()
    botão.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
};

const nextSong = () => {
    if (index === sortedPlayList.length -1) {
        index = 0;
    }else {
        index += 1;
    }
    initializeSong();
    song.play()
    botão.innerHTML = '<i class="bi bi-pause-circle-fill"></i>';
};


const updateProgressBar = () => {
    const barWidth = (song.currentTime/song.duration)*100;
    currentprogress.style.setProperty("--progress",`${barWidth}%`);
    songTime.innerHTML = toHHMMSS(song.currentTime)
};

const jumpTo = (event) => {
    const width = containerprogress.clientWidth;
    const clickPosition = event.offsetX
    const jumpToTime = (clickPosition/width) *song.duration
    song.currentTime = jumpToTime
};

const shuffleArray = (preShuffleArray)=>{
    const size = preShuffleArray.length;
    let currentIndex = size -1
    while (currentIndex > 0) {
        let random = Math.floor(Math.random()*size) 
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[random];
        preShuffleArray[random] = aux;
        currentIndex -= 1
    }
}

const shuffleButtonClicked = () => {
    if (isShuffle === false) {
        shuffle.classList.add('button-activated')
        isShuffle = true;
        shuffleArray(sortedPlayList);
    } else {
        shuffle.classList.remove('button-activated')
        isShuffle = false;
        sortedPlayList = [...playList];
    }
};

const repeatButtonClicked = () => {
    if (repeatOn === false) {
        repeatOn = true;
        repeatButton.classList.add('button-activated')
    } else {
        repeatOn = false;
        repeatButton.classList.remove('button-activated')
    };
};

const nextOrRepeat = () => {
    if (repeatOn === false) {
        nextSong();
    } else {
        song.play();
    };
};

const formatTime = (time) => (time >= 0 && time < 10) ? time = `0${time}` : time  

const toHHMMSS = (up) => {
    const hours = Math.floor(up/3600)
    const min =Math.floor(((up - hours * 3600)/60))
    const seg = Math.floor(up - hours*3600 - min*60)
    return `${formatTime(hours)}:${formatTime(min)}:${formatTime(seg)}`
};

const totalSongTime = () => {
    totalTime.innerHTML = toHHMMSS(song.duration)
};

const likeButtonAct = () => {
    if(originalPlaylist[index].liked === true) {
        document.querySelector('.bi').classList.remove('bi-heart')
        document.querySelector('.bi').classList.add('bi-heart-fill')
        likeButton.classList.add('button-activated')
    }else {
        document.querySelector('.bi').classList.add('bi-heart')
        document.querySelector('.bi').classList.remove('bi-heart-fill')
        likeButton.classList.remove('button-activated')
    }
};

const likeButtonClicked = () => {
    if (originalPlaylist[index].liked === false) {
        originalPlaylist[index].liked = true;
        effects.play()
    } else {
        originalPlaylist[index].liked = false;
        effects.play()
    }
    likeButtonAct();
    localStorage.setItem('playlist',JSON.stringify(originalPlaylist));
}

initializeSong();

botão.addEventListener('click', PlayPause);
   
previous.addEventListener('click',preSong);

next.addEventListener('click',nextSong);

song.addEventListener('timeupdate',updateProgressBar);

song.addEventListener('ended',nextOrRepeat)

song.addEventListener("loadedmetadata",totalSongTime)

containerprogress.addEventListener('click',jumpTo)

shuffle.addEventListener('click',shuffleButtonClicked);

repeatButton.addEventListener('click',repeatButtonClicked);

likeButton.addEventListener('click',likeButtonClicked);



