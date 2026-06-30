package com.example.demo;

public record DeviceStatus(String hostname, double cpuUsage,double memoryUsage, long rx, long tx) {
    
}
