package com.taskmanager.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
	@NotBlank(message = "Username cannot be empty")
	private String username;

	@NotBlank(message = "Password cannot be empty")
	private String password;
}