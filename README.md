# twitch-master

Official site: [twitchintheshell](http://twitchintheshell.com/)
Twitter: [@twitchshell](https://twitter.com/twitchshell)

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

Create a file name `config.json`:

```
{
    "nick": "mytwitchinstall",
    "password": "test"
}
```

* "nick": Your twitch username.
* "password": Your twitch oauth token (password).


## Contribution

Please open a pull request as/when you see fit. We will review it and then act accordingly. Also, try to stick to the coding style you see.


## License

GNU GPL v3 or later. Please check the LICENSE file for more information.