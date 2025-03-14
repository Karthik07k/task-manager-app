package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
	private Long userId;
	private String username;
	private String email;
	private String accessToken;
	private String message;
}
