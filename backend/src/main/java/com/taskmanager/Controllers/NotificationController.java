package com.taskmanager.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.Entities.Notification;
import com.taskmanager.Services.NotificationService;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	@Autowired
	private NotificationService notificationService;

	@GetMapping
	public List<Notification> getUnreadNotifications() {
		return notificationService.getUnreadNotifications();
	}

	@PostMapping("/mark-read")
	public void markAllAsRead() {
		notificationService.markAllAsRead();
	}

}
