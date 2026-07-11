package io.github.jaeyeon_jo_kr.monitoring.system_status;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/system_status")
public class SystemStatusController {

    private final SystemStatusService statusManager;
    private final SystemStatusRepositoryJPA systemStatusRepositoryJPA;

    public SystemStatusController(SystemStatusService statusManager,
        SystemStatusRepositoryJPA systemStatusRepositoryJPA
    ) {
        this.statusManager = statusManager;
        this.systemStatusRepositoryJPA = systemStatusRepositoryJPA;
    }

    @MessageMapping("/request_system_list")
    @SendTo("/topic/system_list")
    public String SystemList(String message)
    {
       return statusManager.getSystemList();
    }

    @GetMapping("/list")
    public Page<SystemStatus> findSystemStatusList(
        Pageable p )
    {
        return systemStatusRepositoryJPA.findAll(p);
    }
}
