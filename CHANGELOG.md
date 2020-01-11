# Gg-Ez-Vp Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.7.0] - 2020-01-10

-   Bugfix/vpaid rendering 3 (#72)

    -   track VAST errors

    -   prevent early calls to getAdDuration

    -   remove unused import

    -   use playerContainer container for VPAID creatives

    -   add vasttracker as a ggezvp property

    -   Use cached VPAID scripts

    -   Remove VAST load timestamp macros

    -   Guard against undefined VPAID wrapper method calls

    -   Attach VPAID listeners before attempting script load

    -   Reorder vpaid script listeners

    -   Guard against undefined VPAIDWrapper calls

    -   Don't call vpaid methods from instance before data-ready

    -   render VPAID in mobile safari

    -   Fix VPAID clickThrough in iOS, android chrome broken now

    -   Use independent div for VPAID creative slot

## [1.6.0] - 2019-12-26

-   Handle VPAID replay (#58) (#68)

## [1.5.0] - 2019-12-23

-   Prevent VAST load until container is visible (#60) (#67)

## [1.4.3] - 2019-12-20

-   Only last macro was replaced

## [1.4.2] - 2019-12-20

-   Link to demo page

## [1.4.1] - 2019-12-20

-   Change script validation to always use the last gg-ez-vp.js instead of throwing an error
-   Improve demo page with dynamic source edition
-   include and replace VAST [timestamp] macro (#60)

## [1.4.0] - 2019-12-18

-   Prevent context menu over video tag (#40)
-   Fix VAST/VPAID clickthru and tracking (#48)

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
