# -------- Build stage --------
    FROM maven:3.9-eclipse-temurin-17 AS build
    WORKDIR /app
    
    # 先複製 pom.xml 並預抓依賴，加速後續 build（利用快取）
    COPY pom.xml ./
    RUN mvn -B -q -DskipTests dependency:go-offline
    
    # 再複製原始碼並打包
    COPY src ./src
    # 如有設定 profiles，可用 -Pprod 或由環境變數 SPRING_PROFILES_ACTIVE 控制
    RUN mvn -B -DskipTests package
    
    # -------- Runtime stage --------
    FROM eclipse-temurin:17-jre
    WORKDIR /app
    
    # 推薦：在容器內使用 prod profile；也可由 docker run -e 覆蓋
    ENV SPRING_PROFILES_ACTIVE=prod
    # JVM 記憶體與隨機數優化，可視機器調整
    ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 -XX:InitialRAMPercentage=50 -Djava.security.egd=file:/dev/./urandom"
    
    # 複製可執行 jar
    COPY --from=build /app/target/*.jar /app/app.jar
    
    # 非 root 執行（安全性較佳）
    USER 10001
    
    EXPOSE 8080
    
    # 如需 Actuator 健康檢查，請在專案加入 spring-boot-starter-actuator 並自行加上 curl/wget 後啟用 HEALTHCHECK
    # HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD curl -f http://localhost:8080/actuator/health || exit 1
    
    ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/app.jar"]
    