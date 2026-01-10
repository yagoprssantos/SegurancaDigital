FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml ./
COPY src ./src
RUN ./mvnw -v >/dev/null 2>&1 || true
RUN apk add --no-cache maven
RUN mvn -q -DskipTests package

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
ENV PORT=8080
COPY --from=build /app/target/demo-backend-0.1.0.jar /app/app.jar
EXPOSE 8080
CMD ["java","-jar","/app/app.jar"]
