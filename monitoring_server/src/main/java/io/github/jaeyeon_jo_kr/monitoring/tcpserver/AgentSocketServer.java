package io.github.jaeyeon_jo_kr.monitoring.tcpserver;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import io.github.jaeyeon_jo_kr.monitoring.system_status.SystemStatusWebSocketService;

@Component
public class AgentSocketServer implements CommandLineRunner {

    private static final int PORT = 4567;

    private final ExecutorService threadPool = Executors.newFixedThreadPool(10);

    private final SimpMessagingTemplate messagingTemplate;

    private final SystemStatusWebSocketService systemStatusWebSocketService;

    public AgentSocketServer(
        SimpMessagingTemplate messagingTemplate,
        SystemStatusWebSocketService systemStatusWebSocketService) {
        this.messagingTemplate = messagingTemplate;
        this.systemStatusWebSocketService = systemStatusWebSocketService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Spring Boot 메인 구동 스레드가 블로킹되지 않도록 별도 쓰레드로 서버 기동
        System.out.println("Agent Server Start.");
        new Thread(this::startServer).start();
    }

    private void startServer() {
        try (ServerSocket serverSocket = new ServerSocket(PORT)) {
            System.out.println("[Java 게이트웨이] 🚀 포트 " + PORT + "에서 C 에이전트 연결 대기 중...");

            while (!Thread.currentThread().isInterrupted()) {
                // C 데몬의 connect() 요청을 대기 (블로킹 구간)
                Socket clientSocket = serverSocket.accept();
                System.out.println("[Java 게이트웨이] 🔗 에이전트 접속 감지: " + clientSocket.getRemoteSocketAddress());

                // 접속된 세션을 스레드 풀에 할당하여 비동기로 독립 처리
                threadPool.submit(() -> handleAgentSession(clientSocket));
            }
        } catch (Exception e) {
            System.err.println("[Java 게이트웨이] 서버 소켓 구동 실패: " + e.getMessage());
        } finally {
            threadPool.shutdown();
        }
    }

    private void handleAgentSession(Socket socket) {
        // Java의 자동 자원 해제(Try-with-resources) 문법 적용
        try (
            Socket s = socket;
            BufferedReader reader = new BufferedReader(new InputStreamReader(s.getInputStream(), "UTF-8"))
        ) {
            String rawPacket;
            // C 데몬이 보낸 패킷을 '\n' 단위로 한 줄씩 스트림 독취
            while ((rawPacket = reader.readLine()) != null) {
                System.out.println("[Java 수신 패킷]: " + rawPacket);

                // 문자열 파싱 처리 (| 토큰 분리)
                String[] tokens = rawPacket.split("\\|");
                if (tokens.length > 0) {
                    String packetType = tokens[0];

                    switch (packetType) {
                        case "CPU_INFO":
                            systemStatusWebSocketService.handleInfoPacket(tokens);
                            break;
                        case "DATA":
                            systemStatusWebSocketService.handleDataPacket(tokens, messagingTemplate);
                            break;
                        default:
                            System.out.println("⚠️ 알 수 없는 프로토콜 양식: " + packetType);
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("[Java 게이트웨이] 에이전트 연결 종료 또는 에러: " + e.getMessage());
        }
    }

    
}