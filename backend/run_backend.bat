@echo off 
SET "PATH=%~dp0..\apache-maven-3.9.6\bin;%PATH%" 
cd /d "%~dp0" 
echo Starting Spring Boot Backend... 
mvn spring-boot:run 
