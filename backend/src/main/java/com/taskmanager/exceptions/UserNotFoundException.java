package com.taskmanager.exceptions;

public class UserNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L; // Unique identifier for serialization

	public UserNotFoundException(String message) {
		super(message);
	}
}
