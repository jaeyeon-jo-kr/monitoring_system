package io.github.jaeyeon_jo_kr.monitoring.scheduler;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

import io.github.jaeyeon_jo_kr.monitoring.system_status.SystemStatus;
import io.github.jaeyeon_jo_kr.monitoring.system_status.SystemStatusService;

@Component
public class ScheduledTasks {

    private SystemStatusService systemStatusService;
    
    public ScheduledTasks(SystemStatusService systemStatusService) {
        this.systemStatusService = systemStatusService;
    }

    @Scheduled(cron = "0 2 * * * *")
    public void CreateDailyRecord() {
        systemStatusService.updateDailyStatus();
    }
}
