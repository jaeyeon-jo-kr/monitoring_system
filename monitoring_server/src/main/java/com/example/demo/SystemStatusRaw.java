package com.example.demo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_status_raw")
public class SystemStatusRaw {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    public String hostname;
    public double cpuUsage;
    public double memoryUsage;
    public long rx;
    public long tx;
}
