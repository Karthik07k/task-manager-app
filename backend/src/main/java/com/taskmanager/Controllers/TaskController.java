package com.taskmanager.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.Entities.Task;
import com.taskmanager.Services.TaskService;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
	@Autowired
	private TaskService taskService;

	@GetMapping
	public List<Task> getAllTasks() {
		return taskService.getAllTasks();
	}

	@GetMapping("/getTasksByUserId/{userId}")
	public ResponseEntity<List<Task>> getTasksByUserId(@PathVariable Long userId) {
		List<Task> tasks = taskService.getTasksByUserId(userId);
		if (tasks.isEmpty()) {
			return ResponseEntity.noContent().build();
		}
		return ResponseEntity.ok(tasks);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
		Optional<Task> task = taskService.getTaskById(id);
		return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
	}

	@PostMapping("/createTask/{username}")
	public ResponseEntity<Task> createTask(@RequestBody Task task, @PathVariable String username) {
		Task createdTask = taskService.createTask(task, username);
		return ResponseEntity.ok(createdTask);
	}

	@PutMapping("/updateTask/{taskId}")
	public ResponseEntity<Task> updateTask(@PathVariable Long taskId, @RequestBody Task updatedTask) {
		Task task = taskService.updateTask(taskId, updatedTask);
		return ResponseEntity.ok(task);
	}

	@DeleteMapping("/deleteTask/{id}")
	public ResponseEntity<?> deleteTask(@PathVariable Long id) {
		taskService.deleteTask(id);
		return ResponseEntity.ok().build();
	}
}