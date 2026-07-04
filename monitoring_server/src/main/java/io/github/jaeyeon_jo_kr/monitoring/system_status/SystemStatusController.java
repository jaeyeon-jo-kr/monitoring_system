package io.github.jaeyeon_jo_kr.monitoring.system_status;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;



@Controller
public class SystemStatusController {

    private final SystemStatusService statusManager;

    public SystemStatusController(SystemStatusService statusManager) {
        this.statusManager = statusManager;
    }

    @MessageMapping("/request_system_list")
    @SendTo("/topic/system_list")
    public String SystemList(String message)
    {
       return statusManager.getSystemList();
    }


}
