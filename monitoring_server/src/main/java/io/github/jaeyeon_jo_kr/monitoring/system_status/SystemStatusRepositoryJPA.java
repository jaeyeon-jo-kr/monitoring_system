package io.github.jaeyeon_jo_kr.monitoring.system_status;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SystemStatusRepositoryJPA extends JpaRepository<SystemStatus, Long>{

    @Query(value="""
        SELECT hostname, AVG(cpu_usage) cpu_avg, MAX(cpu_usage) cpu_max, 
            AVG(memory_usage) memory_avg, MAX(memory_usage) memory_max,
            SUM(rx) network_rx_total, SUM(tx) network_tx_total, CURRENT_DATE log_date
        FROM system_mon.system_status_raw
        GROUP BY hostname
        """, nativeQuery = true)
    List<SystemStatusDaily> findDailyStatus();

    @Modifying(clearAutomatically = true)
    @Query(value = "TRUNCATE TABLE system_mon.system_status_raw", nativeQuery = true)
    void truncateSystemStatus();
} 
