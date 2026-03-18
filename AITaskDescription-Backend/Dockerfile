FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app
COPY . .

# Build Spring Boot JAR
RUN mvn clean package -DskipTests

# ---- Step 2: Run the app ----
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy built JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]