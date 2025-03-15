package com.taskmanager.Controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

	@GetMapping
	public Map<String, String> healthCheck() {
		Map<String, String> status = new HashMap<>();
		status.put("status", "UP");
		return status;
	}
}