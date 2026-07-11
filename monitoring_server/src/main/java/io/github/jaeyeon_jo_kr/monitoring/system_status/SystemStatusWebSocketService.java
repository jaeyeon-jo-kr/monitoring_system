package io.github.jaeyeon_jo_kr.monitoring.system_status;

import org.springframework.stereotype.Component;

import tools.jackson.databind.ObjectMapper;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@Component
public class SystemStatusWebSocketService {

    
    private final SystemStatusService systemStatusService;
    private final ObjectMapper mapper = new ObjectMapper();


    public SystemStatusWebSocketService(SystemStatusService systemStatusService){
        this.systemStatusService = systemStatusService;
    }

    // 정적 마스터 데이터 처리 (CPU 명칭, 코어 개수 등)
    public void handleInfoPacket(String[] tokens) {
        if (tokens.length >= 3) {
            String cpuModel = tokens[1];
            String core = tokens[2];
            System.out.println("📌 [마스터 등록] 사양: " + cpuModel + " / 코어 수: " + core);
        }
    }

    // 동적 시계열 데이터 처리 (실시간 사용량 등 추후 확장용)
    public void handleDataPacket(String[] tokens, SimpMessagingTemplate messagingTemplate) {
        if (tokens.length >= 3) {
            SystemStatus systemStatus = new SystemStatus();
            systemStatus.hostname = tokens[1];
            systemStatus.cpuUsage = Double.parseDouble(tokens[2]);
            systemStatus.memoryUsage = Double.parseDouble(tokens[3]);
            systemStatus.rx = Long.parseLong(tokens[4]);
            systemStatus.tx = Long.parseLong(tokens[5]);
            systemStatusService.updateStatus(systemStatus);
            String response = mapper.writeValueAsString(systemStatus);
            //System.out.println("response:" + response);
            messagingTemplate.convertAndSend("/topic/system_status", response);
        }
    }
}
