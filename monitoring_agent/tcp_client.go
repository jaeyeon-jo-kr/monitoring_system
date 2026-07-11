package main

import (
	"fmt"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"
)

const connectAddr = "127.0.0.1:4567"

func tryConnect(conn *net.Conn, sigChan chan os.Signal) error {
	var err error

	for {
		connected := false
		select {
		case sig := <-sigChan:
			fmt.Printf("Sig interrupted while dialing: %v\n", sig)
			err = fmt.Errorf("Sig interrupted while dialing: %v\n", err)
			return err
		default:
			*conn, err = net.Dial("tcp", connectAddr)
			if err != nil {
				fmt.Printf("dial error: %v, try to reconnect after 5 sec.\n", err)
				time.Sleep(5 * time.Second)
				continue
			} else {
				connected = true

			}
		}
		if connected {
			break
		}
	}
	return err
}

func RunClient() {
	var conn net.Conn
	var err error
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	ticker := time.NewTicker(3 * time.Second)
	defer ticker.Stop()

	err = tryConnect(&conn, sigChan)
	if err != nil {
		fmt.Printf("Connection error %s\n", err)
		return
	}
	defer conn.Close()

	cpuInfo, err := GetCpuInfo()
	if err != nil {
		fmt.Printf("Cpu Info Getting error %s\n", err)
		return
	}
	cpuInfoMsg := CpuInfoToStr(cpuInfo)
	n, err := conn.Write([]byte(cpuInfoMsg))

	fmt.Printf("Size of sended packet : %d.\n", n)

	for {
		select {
		case <-ticker.C:
			fmt.Printf("Receive Tick\n")
			resourceStatus, err := GetResourceStatus()
			if err != nil {
				fmt.Printf("GetResourceStatus error %s\n", err)
				break
			}
			n, err := conn.Write([]byte(resourceStatus))
			if err != nil {
				fmt.Printf("Write resource status error %s\n", err)
				conn.Close()
				err = tryConnect(&conn, sigChan)
				if err != nil {
					fmt.Printf("Signal Interruped %s\n", err)
					return
				} else {
					defer conn.Close()
				}
			}
			fmt.Printf("sended packet len : %d\n", n)
		case sig := <-sigChan:
			fmt.Printf("Sig interuptted : %v\n", sig)
			return
		}
	}
}
