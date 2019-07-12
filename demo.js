/*global GgEzVp*/

window.onload = function onload() {
    console.log({ GgEzVp });

    // MP4 test
    //let playerInstance = new GgEzVp({
    //    container: 'videoContainer1',
    //    src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4',
    //    autoplay: false,
    //});

    // VAST test
    let playerInstance = new GgEzVp({
        container: 'videoContainer1',
        src:
            'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]',
        autoplay: false,
        isVAST: true
    });

    // Configure player
    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', () => playerInstance.playPause());

    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => playerInstance.muteUnmute());

    const rmBtn = document.getElementById('destroy-btn');
    rmBtn.addEventListener('click', () => playerInstance.destroy());

    const f5Btn = document.getElementById('reload-btn');
    f5Btn.addEventListener('click', () => location.reload());

    // Set listeners
    playerInstance.on('ready', () => {
        playerInstance.on('play', console.log);
        playerInstance.on('pause', console.log);
        playerInstance.on('timeupdate', console.log);
        playerInstance.on('predestroy', () => {
            console.log('PRE DESTROY LISTENER');
            playerInstance = null;
        });
    });
    playerInstance.on('error', console.log);
};
