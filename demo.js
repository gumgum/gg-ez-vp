/*global GgEzVp b:true*/

window.onload = function onload() {
    console.log({ GgEzVp });
    const playerInstance1 = new GgEzVp({
        container: 'videoContainer1',
        src: 'https://aba.gumgum.com/13007/8/tiny_video_640x360.mp4'
    });
    playerInstance1.play();
    console.log({ playerInstance1 });
};
