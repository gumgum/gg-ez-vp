# GG EZ Video Player

Simple video player with minimal setup, intuitive API and straightforward features.

## Features:

- Customizable controls (or use our defaults)
- Lightweight
- Easy setup
- Programmatic access to video playback APIs
- UMD, CommonJS and ES module versions
- VAST / VPAID / MOAT Support, provided by [dailymotion/vast-client-js](https://github.com/dailymotion/vast-client-js)

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
|playback-progress| emitted when the video currentTime changes | `{ readableTime, duration, currentTime }` |
|player-click| emitted when clicks are detected inside the container element | click event |
|pre-destroy| emitted before removing listeners and the container node| `undefined` |
|ready| emitted when the class is ready for playback| `undefined` |
|resize| emitted when video tag changes either width or height | `{ width, height }` |

Custom events are provided by [Nano Events](https://github.com/ai/nanoevents)

## Development

`yarn install` to install dependencies

`yarn start` to fire dev server and node watcher, the server can be accessed at localhost:8080

See scripts section of package.json for all available scripts
