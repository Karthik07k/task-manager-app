package com.taskmanager.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskmanager.Entities.Notification;
import com.taskmanager.Repositories.NotificationRepository;

@Service
public class NotificationService {

	@Autowired
	private NotificationRepository notificationRepository;

	public List<Notification> getUnreadNotifications() {
		return notificationRepository.findByIsReadFalse();
	}

	public void markAllAsRead() {
		List<Notification> notifications = notificationRepository.findAll();
		notifications.forEach(n -> n.setRead(true));
		notificationRepository.saveAll(notifications);
	}

}
