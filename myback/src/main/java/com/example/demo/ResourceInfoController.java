package com.example.demo;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ResourceInfoController {

    private final SystemStatusManager statusManager;

    public ResourceInfoController(SystemStatusManager statusManager) {
        this.statusManager = statusManager;
    }

    @MessageMapping("/info")
    @SendTo("/topic/cpu_info")
    public String SystemStatus()
    {
       return statusManager.getStatusMessage();
    }
}
