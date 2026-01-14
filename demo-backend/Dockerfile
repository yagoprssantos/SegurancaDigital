FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./
COPY .mvn ./.mvn
COPY mvnw ./
COPY src ./src
RUN chmod +x mvnw
RUN ./mvnw -B clean package -DskipTests spring-boot:repackage

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ENV PORT=8080
ENV JAVA_OPTS=""
COPY --from=build /app/target/demo-backend-0.1.0.jar /app/app.jar
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar /app/app.jar"]
