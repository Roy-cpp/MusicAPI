var range = document.getElementById('range');
var title = document.getElementById('title');
var singer = document.getElementById('singer');
var img = document.getElementById('cover');
var player = document.getElementById('player');

// 当前播放的音乐索引
var current = 0;

function start() {
    range.value = 0;
    var music = list[current];
    title.innerText = music.name;
    singer.innerText = music.singer;
    player.src = music.src;
    img.src = music.cover;
    // 开始播放
    playMusic();
}

// 播放
function playMusic() {
    player.play()
}

// 暂停
function pauseMusic() {
    // 暂停播放
    player.pause();
}

// 下一首
function nextMusic() {
    if (current >= list.length - 1) {
        current = 0;
    } else {
        current = current + 1
    }
    start();
}

// 上一首
function prevMusic() {
    if (current <= 0) {
        current = list.length - 1;
    } else {
        current = current - 1
    }
    start();
}

// 音量+
function volumeUp() {
    if (player.volume <1.0) {
        player.volume +=0.1
    }
}

// 音量-
function volumeDown() {
    if (player.volume >=0.1) {
        player.volume -=0.1
    }
}

range.addEventListener('change',function () {
  console.log(this.value)  
  //  duration 歌曲的总时间
  //currentTime 当前播放到的时间    
  player.currentTime =this.value/100*player.duration
});

// 歌曲播放时间改变时调用
player.addEventListener('timeupdate',function () {
    var value = player.currentTime/player.duration*100
    if (value) {
        range.value = value;
    }
});

// 歌曲播放结束后调用
player.addEventListener('ended',function () {
    nextMusic();
})