package io.github.jaeyeon_jo_kr.monitoring.system_status;

import java.sql.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "system_status_daily")
public class SystemStatusDaily {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long id;
    public String hostname;
    public double cpuAvg;
    public double cpuMax;
    public double memoryAvg;
    public double memoryMax;
    public long networkRxTotal;
    public long networkTxTotal;
    public Date logDate;
}
