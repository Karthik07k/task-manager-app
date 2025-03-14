package com.taskmanager.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.taskmanager.Entities.User;
import com.taskmanager.Repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	public List<User> getAllUsers() {
		return userRepository.findAll();
	}

	public Optional<User> getUserByUsername(String username) {
		return userRepository.findByUsername(username);
	}

	public User saveUser(User user) {
		return userRepository.save(user);
	}

}