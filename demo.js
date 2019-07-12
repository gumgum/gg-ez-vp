/*global GgEzVp*/

window.onload = function onload() {
    console.log({ GgEzVp });
    const playerInstance1 = new GgEzVp({
        container: 'videoContainer1',
        src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4',
        autoplay: false
    });
    // Controls test
    //playerInstance1.play();
    //setTimeout(() => {
    //    playerInstance1.pause();
    //    setTimeout(() => {
    //        playerInstance1.playPause();
    //        setTimeout(() => {
    //            playerInstance1.playPause();
    //            console.log({ playerInstance1 });
    //        }, 1000);
    //    }, 1000);
    //}, 1000);
    console.log({ playerInstance1 });
};
