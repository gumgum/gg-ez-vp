# Gg-Ez-Vp Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.3.0] - 2019-12-13

-   Set volume icons and mute toggle based on muted property (#56)
-   Remove MOAT references and process README with prettier (#54)
-   Bugfix/mobile autoplay electric boogaloo (#52)

## [1.2.1] - 2019-12-09

-   use production script in demo page
-   Prevent ad timestamp display when isNaN (#51)
-   Feature/optional ad controls (#50)
-   Bugfix/firefox fullscreen toggle (#39)

    -   push ad controls to the top #38

    -   toggle expand visibility on ad controls

    -   allow fullscreen when inside iframe

    -   improve moz fullscreen comments

## [1.1.5] - 2019-11-22

-   README URL fixes

## [1.1.2] - 2019-11-22

-   Create workflow to deploy develop to `/vp/beta/`

## [1.1.1] - 2019-11-21

-   Display enabled controls by default in touchscreen devices.
-   Center video in portrait + fullscreen mode

## [1.1.0] - 2019-11-20

### Breaking change

-   Preloads volume/play state icons by reading DOM script tags. This will break compatibility with ESM and CJS modules.
-   Create a changelog
