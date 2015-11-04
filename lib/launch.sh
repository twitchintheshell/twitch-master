#!/bin/bash
qemu-system-x86_64 -cdrom ~/archlinux-2015.10.01-dual.iso -hda ~/Arch.qcow2 -net nic,model=ne2k_pci -net user -m 2G -vnc localhost:0 -monitor stdio -localtime -qmp tcp:localhost:4444,server,nowait -no-shutdown
