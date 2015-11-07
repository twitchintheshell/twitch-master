# Changelog

## 0.0.6
* Added a new chaos mode.
  * [issue #26](https://github.com/twitchintheshell/twitch-master/issues/26)
* Fixed a minor bug related to voting mouse movement.
  * [issue #27](https://github.com/twitchintheshell/twitch-master/issues/27)
* Minor code improvements.


## 0.0.5
* Added monarchy mode.
  * [issue #14](https://github.com/twitchintheshell/twitch-master/issues/14)
* Minor code-structure improvement.


## 0.0.4
* A new blacklist mechanism has been added.
  * You can add entries in blacklist.json, if any of those entries occurs in some username on input, the input is simply ignored and not taken into account.
  * [issue #17](https://github.com/twitchintheshell/twitch-master/issues/17)
* A couple additions in ![map.json](map.json).
* A new mouse mechanic is introduced.
  * You can `mouse_move_x`, `mouse_move_y` and `mouse_move_z` to control mouse movement. Upon initiation of those commands, a voting process starts with integers only being accepted as individual votes. Let `i` be the winnning vote of `mouse_move_[x/y/z]`, the mouse will move `i` pixels. You can also `mouse_left`, `mouse_middle` and `mouse_right` to control the mouse buttons. Use `mouse_[left/middle/right]_double` for a double click. Due to security, there is a minimum and maximum of dx, dy and dz which are set at the global variables settings section in `twitch_master.js`. The only downside of this is when some admin interacts with the VM, that would mess the current dx, dy and dz values. I don't believe there is anything we can do about this, feel free to suggest something.