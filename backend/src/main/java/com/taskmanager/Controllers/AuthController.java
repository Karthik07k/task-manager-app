package com.taskmanager.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskmanager.Services.AuthService;
import com.taskmanager.dto.AuthResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		AuthResponse response = authService.register(request);
		return ResponseEntity.status(201).body(response);
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		AuthResponse response = authService.authenticate(request);
		return ResponseEntity.ok(response);
	}

}