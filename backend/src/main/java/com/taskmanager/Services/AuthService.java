package com.taskmanager.Services;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskmanager.Entities.Role;
import com.taskmanager.Entities.User;
import com.taskmanager.Repositories.UserRepository;
import com.taskmanager.Security.JwtUtil;
import com.taskmanager.dto.AuthResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;

	// Register new user
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByUsername(request.getUsername())) {
			throw new RuntimeException("Username is already taken");
		}
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new RuntimeException("Email is already in use");
		}

		User user = new User();
		user.setUsername(request.getUsername());
		user.setEmail(request.getEmail());
		user.setRole(Role.USER);
		user.setPassword(passwordEncoder.encode(request.getPassword())); // Encrypt password

		User savedUser = userRepository.save(user);
		String token = jwtUtil.generateAccessToken(user.getUsername());
		return new AuthResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getEmail(), token,
				"User registered successfully!");

	}

	// Authenticate existing user
	public AuthResponse authenticate(LoginRequest request) {

		User user = userRepository.findByUsername(request.getUsername())
				.orElseThrow(() -> new RuntimeException("User not found"));
		// Compare raw password with encoded password
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BadCredentialsException("Invalid username or password");
		}

		String accessToken = jwtUtil.generateAccessToken(user.getUsername());

		// Optionally include a refresh token
		// String refreshToken =
		// jwtUtil.generateRefreshToken(userDetails.getUsername());

		return new AuthResponse(user.getId(), user.getUsername(), user.getEmail(), accessToken, "Login successful");
	}
}