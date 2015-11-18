#!/bin/bash
#qemu-system-x86_64 -cdrom ~/archlinux-2015.10.01-dual.iso -hda ~/Arch.qcow2 -net nic,model=ne2k_pci -net user -m 2G -vnc localhost:0 -monitor stdio -localtime -qmp tcp:localhost:4444,server,nowait -no-shutdown
#qemu-system-x86_64 -cdrom ~/archlinux-2015.10.01-dual.iso -hda ~/Disk1.img -hdb ~/Disk2.img -net nic -net user -m 4G -vnc localhost:0 -monitor stdio -localtime -qmp tcp:localhost:4444,server,nowait -cpu host -smp 4 -no-shutdown -enable-kvm
qemu-system-x86_64 -cdrom ~/archlinux-2015.10.01-dual.iso -hda ~/Disk1.img -hdb ~/Disk2.img -net nic -net user -m 4G -vnc localhost:0 -monitor stdio -localtime -qmp tcp:localhost:4444,server,nowait -cpu core2duo -smp 4 -no-shutdown -enable-kvm
