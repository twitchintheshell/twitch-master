# twitch-master
[![Version](https://img.shields.io/badge/version-0.0.5-green.svg)](VERSION)
[![License](https://img.shields.io/badge/license-GNU%20GPL%20v3%2B-blue.svg)](LICENSE)

[twitchintheshell.com](http://twitchintheshell.com/) | [@twitchshell](https://twitter.com/twitchshell)

The code is currently running on our [stream](http://www.twitch.tv/twitchinstallsarchlinux), feel free to drop by and say hi!


## About

This is the user interaction backbone of our back-end. It is built to take inputs from a Twitch channel's chat, and send them to a QEMU virtual machine (if they are appropriate, see map.json for that).


Specifically, it is accomplished with a multiprocess system, comprised of 5 functional portions:

* client_console: Shows the parsed votes from chat.
* client_status: Shows the results of each voting period.
* client_vnc: Runs the VNC client that connects to QEMU to act as the VM's display.
* twitch_master: Connects to twitch chat, and processes messages in chat. The real meat of the code base as it stands.
* qemu: Starts the QEMU process and restarts it if it dies.


## Configuration

Create a file with name `config.json` in the root directory of the source code and content-structure as the following:

```
{
    "nick": "my_twitch_username",
    "password": "oauth:6vgm8nZzzZ1337mine"
}
```

Then you can launch the files `qemu.js`, `client_console.js`, `client_status.js` and `twitch_master.js`.

If you're running this on a Mac, npm will not be able to install zmq without first running:

`brew install pkg-config icu4c`

and then:

`brew link icu4c --force`


## Contribution

Please open a pull request as/when you see fit. We will review it and then act accordingly.
**If you want to contribute many lines of code at once**, and more importantly, if they are addressing **crucial parts of the code** such as **input parsing** please open up an issue first for discussion. Do not proceed into writing what you got in mind because it might get turned down.
Also, stick to the coding style you see.


## License

GNU GPL v3 or later. Please check the LICENSE file for more information.
