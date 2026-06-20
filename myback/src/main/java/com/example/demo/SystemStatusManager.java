package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component // 1. Spring이 싱글톤으로 관리해줍니다.
public class SystemStatusManager {

    // 2. 가변 필드들 (record와 달리 변수 수정 가능)
    private String hostname;
    private double cpuUsage;
    private double memoryUsage;

    // 3. 여러 스레드(Go 수신 스레드, 웹소켓 송신 스레드)가 동시에 읽고 쓸 때 
    // 최신 값을 보장하기 위해 synchronized로 데이터 갱신을 동기화합니다.
    public synchronized void updateStatus(String hostname, double cpuUsage, double memoryUsage) {
        System.out.println("갱신: 이전값:" + this.hostname + "," + this.cpuUsage + "," + this.memoryUsage);
        this.hostname = hostname;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        System.out.println("갱신: 이후값:" + this.hostname + "," + this.cpuUsage + "," + this.memoryUsage);
    }

    // 읽기 전용 Getter들
    public synchronized String getHostname() { return hostname; }
    public synchronized double getCpuUsage() { return cpuUsage; }
    public synchronized double getMemoryUsage() { return memoryUsage; }
    public synchronized String getStatusMessage() {
        return getHostname() + "|" + getCpuUsage() + "|" + getMemoryUsage();
    }
}