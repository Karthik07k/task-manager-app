# Build stage
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app
# Copy pom.xml first for better caching
COPY pom.xml .
# Copy source code
COPY src ./src
# Build the application
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
COPY --from=build /app/target/*.jar app.jar
ENV JAVA_OPTS="-Xmx512m -Xms256m -XX:+UseContainerSupport"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app.jar"]