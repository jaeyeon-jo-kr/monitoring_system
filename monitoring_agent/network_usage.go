package main

/*
#include <net/if.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <ifaddrs.h>
*/
import "C"
import (
	"fmt"
	"unsafe"
)

const sampleIfName = "en0"

type NetworkUsage struct {
	RxBytes uint64
	TxBytes uint64
}

func GetNetworkUsage() (NetworkUsage, error) {
	var ifaces *C.struct_ifaddrs

	if getrc, _ := C.getifaddrs(&ifaces); getrc != 0 {
		return NetworkUsage{}, nil
	}
	defer C.freeifaddrs(ifaces)

	for fi := ifaces; fi != nil; fi = fi.ifa_next {

		if_aname := C.GoString(fi.ifa_name)
		sa_family := fi.ifa_addr.sa_family
		if sa_family == C.AF_LINK && if_aname == "en0" {
			ifData := (*C.struct_if_data)(unsafe.Pointer(fi.ifa_data))
			if ifData != nil {

				fmt.Printf("ifData.ifi_ibytes: %d\n", uint64(ifData.ifi_ibytes))
				fmt.Printf("ifData.ifo_ibytes: %d\n", uint64(ifData.ifi_obytes))

				return NetworkUsage{RxBytes: uint64(ifData.ifi_ibytes), TxBytes: uint64(ifData.ifi_obytes)}, nil
			}
		}
	}

	return NetworkUsage{}, fmt.Errorf("No Network Usage Information.\n")
}
