# Build stage
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage (Using supported Eclipse Temurin JRE image instead of deprecated openjdk image)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/sharebite-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]
