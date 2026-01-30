# ==============================================================================
# STAGE 1: Build the Application
# ==============================================================================
FROM eclipse-temurin:25-jdk AS build

# We use 3.9.9 (Stable) because 4.0.2 is not released yet.
ENV MAVEN_VERSION=3.9.9
ENV MAVEN_HOME=/usr/share/maven
ENV PATH="$MAVEN_HOME/bin:$PATH"

# Install dependencies
RUN apt-get update && \
    apt-get install -y curl tar && \
    rm -rf /var/lib/apt/lists/*

# FIX: Use 'archive.apache.org' instead of 'dlcdn'
# This bypasses the mirror redirects that were causing your download to fail.
RUN mkdir -p /usr/share/maven && \
    curl -fsSL "https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" \
    | tar -xzC /usr/share/maven --strip-components=1 && \
    ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

# Copy and Build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ==============================================================================
# STAGE 2: Run the Application
# ==============================================================================
FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
