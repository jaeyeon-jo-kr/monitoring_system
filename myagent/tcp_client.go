package main

import (
	"fmt"
	"net"
	"time"
)

const connectAddr = "127.0.0.1:4567"

func ConnectServer() {
	conn, err := net.Dial("tcp", connectAddr)

	if err != nil {
		fmt.Printf("error %s\n", err)
		return
	}

	defer conn.Close()

	ticker := time.NewTicker(1 * time.Second)
	defer ticker.Stop()
	cpuInfo, err := GetCpuInfo()
	if err != nil {
		fmt.Printf("Cpu Info Getting error %s\n", err)
		return
	}
	cpuInfoMsg := CpuInfoToStr(cpuInfo)
	n, err := conn.Write([]byte(cpuInfoMsg))

	if err != nil {
		fmt.Printf("Cpu Info Sending error %s\n", err)
		return
	}
	fmt.Printf("Size of sended packet : %d.\n", n)

}
