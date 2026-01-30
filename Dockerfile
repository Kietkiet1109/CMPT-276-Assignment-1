# ==============================================================================
# STAGE 1: Build the Application
# Using Eclipse Temurin (Official OpenJDK) for Java 25
# ==============================================================================
FROM eclipse-temurin:25-jdk AS build

# 1. Define a VALID Maven Version
# "4.0.2" does not exist yet. We use 3.9.9 (Latest Stable) or 4.0.0-beta-5
ENV MAVEN_VERSION=3.9.9
ENV MAVEN_HOME=/usr/share/maven
ENV PATH="$MAVEN_HOME/bin:$PATH"

# 2. Install dependencies
RUN apt-get update && \
    apt-get install -y curl tar && \
    rm -rf /var/lib/apt/lists/*

# 3. Download and Install Maven
# NOTE: The URL structure relies on the version existing in the Maven 3 or 4 archives
RUN mkdir -p /usr/share/maven && \
    curl -fsSL "https://dlcdn.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" \
    | tar -xzC /usr/share/maven --strip-components=1 && \
    ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

# 4. Copy Project Files
WORKDIR /app
COPY . .

# 5. Build the JAR
RUN mvn clean package -DskipTests

# ==============================================================================
# STAGE 2: Run the Application
# ==============================================================================
FROM eclipse-temurin:25-jre

WORKDIR /app

# 6. Copy the JAR
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
