package com.taskmanager.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.taskmanager.Entities.Task;
import com.taskmanager.Entities.User;
import com.taskmanager.Repositories.TaskRepository;
import com.taskmanager.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaskService {

	private final TaskRepository taskRepository;
	private final UserRepository userRepository;

	public List<Task> getAllTasks() {
		return taskRepository.findAll();
	}

	public Optional<Task> getTaskById(Long id) {
		return taskRepository.findById(id);
	}

	public List<Task> getTasksByUserId(Long userId) {
		return taskRepository.findByUserId(userId);
	}

	public Task createTask(Task task, String username) {
		User user = userRepository.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		task.setUser(user);
		return taskRepository.save(task);
	}

	public Task updateTask(Long taskId, Task updatedTask) {
		Task existingTask = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Task not found"));

		existingTask.setTitle(updatedTask.getTitle());
		existingTask.setDescription(updatedTask.getDescription());
		existingTask.setStatus(updatedTask.getStatus());
		existingTask.setPriority(updatedTask.getPriority());
		existingTask.setDueDate(updatedTask.getDueDate());

		return taskRepository.save(existingTask);
	}

	public void deleteTask(Long id) {
		taskRepository.deleteById(id);
	}
}
