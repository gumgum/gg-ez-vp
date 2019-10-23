# GG EZ Video Player

Simple video player with minimal setup, intuitive API and straightforward features.

## Features:

- Easy setup
- Customizable controls (or use our defaults)
- Lightweight
- Programmatic access to video playback APIs
- UMD, CommonJS and ES module versions
- VAST / VPAID / MOAT Support for a single Linear Creative. Parsing is provided by [dailymotion/vast-client-js](https://github.com/dailymotion/vast-client-js). *Note* that at the time, only one Ad is loaded, and only Linear Creatives are played and tracked.

## Installation

There is no package available, but in the meantime, we provide different builds in the `dist/` directory:

```
gg-ez-vp.umd.js // Browser
gg-ez-vp.cjs.js // CommonJs
gg-ez-vp.esm.js // ES Module

```

## Usage

First import or load the library:

```
// Browser
<script src="dist/gg-ez-vp.umd.js">

//CJS
const GgEzVp = require('gg-ez-vp')

// ES
import GgEzVp from 'gg-ez-vp'
```

GgEzVp works by attaching itself to a unique container, ideally an empty `<div>` with a unique id:

```
<body>
    <div>
        <div class="randomContent">
            Some content
        </div>
        <div id="myVideo" class="myVideoStyles"></div>
    </div>
</body>
```

Then, to create a player instance:
```
// js
const minimalConfiguration = {
    container: 'myVideo',
    src: 'https://aba.gumgum.com/13861/8/big_buck_bunny_640x360.mp4'
};

const ggEzVpInstance = new GgEzVp(minimalConfiguration);
```

This minimal configuration will create a unique video player instance using the defaults set by GgEzVp.

**note**: `src` and `container` are the only required options in the configuration object.

## Customization

### Options:

|key|defaultValue|required|description|
|---|---|---|---|
|container|null|true| id of the DOM node where the player will be attached|
|src|null|true| string or array of strings used to retrieve video and/or VAST
| width  |null   |false| by default the player will take available space, unless width is specified |
| height  |null   |false| by default the player will take available space, unless height is specified |
| controls  |object   |false| specific controls configurations, see Customizing Controls below |
| autoplay  |false   |false | whether to play the video automatically or not  |
| volume  |1   |false | initial volume for playback must be between 0.0 and 1  |
| muted  |true   |false | video will be muted by default  |
| playsinline  | true   |false | [A Boolean attribute indicating that the video is to be played within the element's playback area.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-playsinline) |
| poster  |null   |false | source for an image to be used as video poster  |
| preload  |'auto'   |false | standard HTML values for preload (none|metadata|auto)  |
| loop  | false   |false | whether to loop video or not  |
| isVAST  | false   |false | enables support for a single VAST / VPAID / MOAT TAG to be parsed and used as source  |

### Controls

TBD

## Public methods
|method name|parameters|description|
|---|---|---|
|destroy|none|removes all instance and video tag listeners, removes the player from the DOM leaving behind the original container|
|fullscreenToggle|none|toggles the fullscreen mode|
|getCurrentTime|none|returns the currentTime from the video tag, this data is also provided by the playback-progress event|
|muteUnmute|none|toggle video sound on/off|
|mute|none|disable video sound|
|on|`eventName, listenerFn`|attaches a listener function to either the video tag or the player instance, the function will be run every time the event is fired, [see events](#events)|
|once|`eventName, listenerFn`|attaches a listener function to either the video tag or the player instance, the function will fire just on time, [see events](#events)|
|pause|none|stop video playback|
|playPause|none|toggle pause state on/off|
|play|none|start video playback|
|unmute|none|enable video sound|
|volume|float number|sets the video volume, [see volume configuration](#customization)|

## Accessible properties
All properties are read-only:

|property name|type|description|
|---|---|---|
|ready|boolean|helps identify when the video/ad is rendered and ready for playback|
|dataReady|boolean|helps identify when the player has all the data it needs to render the video and all listeners have been set|
|config|object|current player's configuration, see Options|
|player|DOM node|current video tag, it is not recommended to interact directly with it, and instead rely on the player's methods, but is provided if necessary|
|dimensions|object|current player dimensions|
|VPAIDWrapper|object|wrapper that allows direct interaction with a VPAID creative if available, it is not recommended to interact directly with it, but it is possible if necessary|

## Events

Listen for any `<video>` tag [events](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#Events) or GgEzVp events:

```
ggEzVpInstance.on('play', myPlayListener);
ggEzVpInstance.on('playback-progress', myPlaybackListener);
```

Listen to them only once:

```
ggEzVpInstance.once('play', myPlayListener);
ggEzVpInstance.once('playback-progress', myProgressListener);
```


The player also emits custom events to extend the video tag behavior:

|event name|description|payload|
|---|---|---|
|data-ready| emitted when a source for the video is received, either by configuration or after asynchronous VAST parsing | `undefined` |
|playback-progress| emitted when the video currentTime changes | `{ remainingTime, readableTime, duration, currentTime }` |
|player-click| emitted when clicks are detected inside the container element | click event |
|pre-destroy| emitted before removing listeners and the container node| `undefined` |
|ready| emitted when the class is ready for playback| `undefined` |
|resize| emitted when video tag changes either width or height | `{ width, height }` |
|error| emitted when player encounters an error | error message or object |

Custom events are provided by [Nano Events](https://github.com/ai/nanoevents)

## VAST
VAST 3.0 is supported, thanks to [dailymotion/vast-client-js](https://github.com/dailymotion/vast-client-js) for the playback of a **single Linear Creative**.
If a VPAID is detected, it will be loaded and executed, otherwise, the player will track and emit all the events in the VAST tag.

## VPAID
The player is capable of playing VPAID 2.0 if the `src` is a VAST tag and `isVAST` is set to `true` in the configuration.
Player events will not be set immediately, instead they will be stored and attached after the VPAID has emitted the `onAdLoaded` event.

### Event mapping
Some VPAID events are mapped as follows:

|VPAID event name| GgEzVp event name|
|---|---|
|AdLoaded|data-ready|
|AdStarted|play|
|AdPlaying|play|
|AdVideoStart|play|
|AdPaused|pause|
|AdStopped|ended|
|AdRemainingTimeChange|playback-progress|
|AdError|error|

It is encouraged to use these events mapped by the player, but if you require listening to other events, [all VPAID events](https://www.iab.com/wp-content/uploads/2015/06/VPAID_2_0_Final_04-10-2012.pdf) are emitted as well with exception of the `AdRemainingTimeChange` event (use `playback-progress` instead).
All data is retrieved from the VPAID creative, not the video tag itself.

## Development

`yarn install` to install dependencies

`yarn start` to fire dev server and node watcher, the server can be accessed at localhost:8080

See scripts section of package.json for all available scripts
