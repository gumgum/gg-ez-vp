/*global GgEzVp*/

window.onload = function onload() {
    console.log({ GgEzVp });

    // MP4 test
    let playerInstance = new GgEzVp({
        container: 'videoContainer1',
        src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4',
        autoplay: false,
        volume: '0.5',
        isAd: true
    });

    // Set listeners
    playerInstance.on('ready', () => {
        playerInstance.on('play', console.log);
        playerInstance.on('pause', console.log);
        playerInstance.on('timeupdate', console.log);
        playerInstance.on('predestroy', () => {
            console.log('DESTROYING FIRST CONTAINER');
            playerInstance = null;
        });
    });
    playerInstance.on('error', console.log);

    // VAST test
    let playerInstance1 = new GgEzVp({
        container: 'videoContainer2',
        src:
            'https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dskippablelinear&correlator=[timestamp]',
        autoplay: false,
        isVAST: true
    });

    // Set listeners
    //playerInstance1.on('ready', () => {
    //    playerInstance1.on('play', console.log);
    //    playerInstance1.on('pause', console.log);
    //    playerInstance1.on('timeupdate', console.log);
    //    playerInstance1.on('predestroy', () => {
    //        console.log('DESTROYING SECOND CONTAINER');
    //        playerInstance1 = null;
    //    });
    //});
    //playerInstance1.on('error', console.log);

    // Configure instance 1 buttons
    const playBtn = document.getElementById('play-btn');
    playBtn.addEventListener('click', () => playerInstance.playPause());

    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => playerInstance.muteUnmute());

    const rmBtn = document.getElementById('destroy-btn');
    rmBtn.addEventListener('click', () => playerInstance.destroy());

    const f5Btn = document.getElementById('reload-btn');
    f5Btn.addEventListener('click', () => location.reload());

    // Configure instance 2 buttons
    const playBtn1 = document.getElementById('play-btn1');
    playBtn1.addEventListener('click', () => playerInstance1.playPause());

    const muteBtn1 = document.getElementById('mute-btn1');
    muteBtn1.addEventListener('click', () => playerInstance1.muteUnmute());

    const rmBtn1 = document.getElementById('destroy-btn1');
    rmBtn1.addEventListener('click', () => playerInstance1.destroy());

    const f5Btn1 = document.getElementById('reload-btn1');
    f5Btn1.addEventListener('click', () => location.reload());
};
