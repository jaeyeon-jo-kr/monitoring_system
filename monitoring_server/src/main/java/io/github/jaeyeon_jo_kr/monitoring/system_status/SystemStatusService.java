package io.github.jaeyeon_jo_kr.monitoring.system_status;

import java.util.Enumeration;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class SystemStatusService {

    private ConcurrentHashMap<String, SystemStatus> deviceStatusMap;

    private final SystemStatusRepositoryJPA systemStatusRepositoryJPA;

    public SystemStatusService(SystemStatusRepositoryJPA systemStatusRepositoryJPA){
       this.deviceStatusMap  = new ConcurrentHashMap<String, SystemStatus>();
       this.systemStatusRepositoryJPA = systemStatusRepositoryJPA;
    }
    
    public synchronized void updateStatus(SystemStatus systemStatus) {
        deviceStatusMap.put(systemStatus.hostname, systemStatus);
        var saveResult = systemStatusRepositoryJPA.save(systemStatus);
        if(saveResult.id <= 0)
        {
            System.err.println("Failed to save.");
        }else{
            System.out.println("Success.");
        }
    }

    public synchronized String getSystemList(){
        StringBuilder stringBuilder = new StringBuilder();
        Enumeration<String> hostnames = deviceStatusMap.keys();

        hostnames.asIterator().forEachRemaining
            (hostname -> stringBuilder.append(hostname).append('|'));
        if(stringBuilder.length() == 0)
            return "";
        stringBuilder.deleteCharAt(stringBuilder.length() - 1);
        System.err.println("Get System List:" + stringBuilder.toString());
        return stringBuilder.toString();
    }

    public synchronized void updateDailyStatus() {
        systemStatusRepositoryJPA.findDailyStatus();
    }

}