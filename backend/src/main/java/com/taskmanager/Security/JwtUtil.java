package com.taskmanager.Security;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	private static final String SECRET_KEY = "your_secret_key_which_should_be_very_long";
	private static final long ACCESS_TOKEN_EXPIRATION = 604800000; //900000; // 15 minutes
	private static final long REFRESH_TOKEN_EXPIRATION = 604800000; // 7 days

	private Key getSigningKey() {
		return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
	}

	public String generateAccessToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	public String generateRefreshToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
	}

	public String extractUsername(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody().getSubject();
	}

	public boolean validateToken(String token, String username) {
		return extractUsername(token).equals(username) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody()
				.getExpiration().before(new Date());
	}
}
