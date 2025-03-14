package com.taskmanager.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskmanager.Entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
	List<Notification> findByIsReadFalse();
}
