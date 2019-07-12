/*global GgEzVp*/

window.onload = function onload() {
    console.log({ GgEzVp });

    let playerInstance = new GgEzVp({
        container: 'videoContainer1',
        src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4',
        autoplay: false
    });

    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', () => playerInstance.playPause());

    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => playerInstance.muteUnmute());

    const rmBtn = document.getElementById('destroy-btn');
    rmBtn.addEventListener('click', () => playerInstance.destroy());

    const f5Btn = document.getElementById('reload-btn');
    f5Btn.addEventListener('click', () => location.reload());

    playerInstance.on('ready', () => {
        playerInstance.on('play', console.log);
        playerInstance.on('pause', console.log);
        playerInstance.on('timeupdate', console.log);
        playerInstance.on('predestroy', () => {
            console.log({ playerInstance });
            playerInstance = null;
            console.log({ playerInstance });
        });

        console.log({ playerInstance });
    });
};
