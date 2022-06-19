// script from https://developers.google.com/youtube/iframe_api_reference

// 1. You need to make a <div id='player'></div> id that will be replaced by this script.

// 2. This code loads the IFrame Player API code asynchronously.
const tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
let player;

// 4. You need to call this function with the video ID as an argument.
function onYouTubeIframeAPIReady(videoId) {
    tag.addEventListener('load', function () {
        YT.ready(async function () {
            player = new YT.Player('player', {
                height: '270',
                width: '480',
                videoId: videoId,
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        })
    })
}

// 5. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 6. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
let done = false;

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.PLAYING && !done) {
        setTimeout(stopVideo, 6000);
        done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}