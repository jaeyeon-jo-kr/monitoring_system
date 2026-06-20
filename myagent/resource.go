package main

import (
	"fmt"

	"golang.org/x/sys/unix"
)

type cpuInfo struct {
	brand string
	core  uint8
}

func GetCpuInfo() (cpuInfo, error) {
	info := cpuInfo{brand: "", core: 0}

	brand, err := unix.Sysctl("machdep.cpu.brand_string")
	info.brand = brand

	if err == nil {
		fmt.Printf("cpu brand name : %s\n", brand)
	} else {
		fmt.Printf("cpu brand name getting error: %s\n", err)
		return info, err
	}

	core, err := unix.SysctlUint32("hw.logicalcpu")
	if err == nil {
		info.core = uint8(core)
	} else {
		fmt.Printf("cpu core parsing error: %s\n", err)
		return info, err
	}
	return info, nil
}

func CpuInfoToStr(info cpuInfo) string {
	strInfo := ""
	strInfo = fmt.Sprintf("CPU_INFO|%s|%d\n", info.brand, info.core)
	return strInfo
}
