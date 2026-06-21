<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { Client } from '@stomp/stompjs'
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'

// Chart.js에 필요한 내부 엔진(컴포넌트들)을 등록합니다.
Chart.register(...registerables)

const isConnected = ref(false)

const WEBSOCKET_URL = 'ws://localhost:8080/ws-monitoring' 
const SUBSCRIBE_TOPIC = '/topic/cpu_info'
const stompClient = new Client({
    brokerURL: WEBSOCKET_URL,
    debug: function (str) {
      console.log('[STOMP 디버그]: ' + str) // 통신 오가는 로우 로그 확인용
    },
    reconnectDelay: 5000, // 연결 끊기면 5초마다 자동 재접속 시도
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000
  })

// 1. 차트를 구성하는 데이터 구조 선언 (Reactive)
const chartData = reactive({
  labels: [], // x축: 시간 (예: 15:20:01, 15:20:02 ...)
  datasets: [
    {
      label: 'CPU 사용률 (%)',
      backgroundColor: 'rgba(54, 162, 235, 0.1)', // 선 아래 그라데이션 채우기용 색상
      borderColor: 'rgba(54, 162, 235, 1)',     // 메인 꺾은선 색상
      borderWidth: 2,
      pointRadius: 2, // 꺾이는 지점의 점 크기
      data: [],      // y축: 실시간 수치 (0 ~ 100)
      tension: 0.2   // 그래프 선의 부드러운 곡선 정도 (0이면 완전히 꺾은선)
    }
  ]
})

// 2. 차트 세부 옵션 설정 (실시간 최적화)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100, // CPU는 항상 0~100% 사이이므로 y축 범위를 고정합니다.
      ticks: {
        callback: (value) => value + '%' // y축 수치 뒤에 % 붙이기
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      position: 'top'
    }
  },
  animation: {
    duration: 300 // 1초마다 데이터가 바뀌므로 애니메이션 속도를 0.3초로 제한하여 부드럽게 연출
  }
}

// 3. 웹소켓 및 STOMP 연결 설정
const connectWebSocket = () => {

  // 웹소켓 연결 성공 시 콜백
  stompClient.onConnect = () => {
    isConnected.value = true
    console.log('✅ Spring 웹소켓 브로커 연결 성공!')

    // Java 서버가 푸시해주는 토픽 주소를 구독(Subscribe)
    stompClient.subscribe(SUBSCRIBE_TOPIC, (message) => {
      if (message.body) {
        console.log('📩 실시간 데이터 수신:', message.body)
        // Java에서 보낸 JSON 스트링을 객체로 파싱
        const metrics = JSON.parse(message.body)
        
        // 실시간 차트 업데이트 실행
        updateChart(metrics.cpuUsage)
      }
    })
  }

  stompClient.onDisconnect = () => {
    isConnected.value = false
    console.log('❌ 웹소켓 연결 종료')
  }

  stompClient.activate()
}

// 4. 1초마다 들어오는 데이터를 차트에 밀어 넣는 핵심 함수
const updateChart = (cpuValue) => {
  const now = new Date()
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

  // x축 시간 배열에 현재 시간 추가
  chartData.labels.push(timeStr)
  // y축 데이터 배열에 실시간 CPU 값 추가
  chartData.datasets[0].data.push(cpuValue)

  // 🚨 패킷 다이어트 및 메모리 관리: 
  // 데이터가 무한히 쌓이면 브라우저가 멈추므로, 최근 20개 지표만 화면에 유지하고 오래된 것은 밀어냅니다(shift).
  if (chartData.labels.length > 20) {
    chartData.labels.shift()
    chartData.datasets[0].data.shift()
  }
}

// 라이프사이클 관리
onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  if (stompClient) {
    stompClient.deactivate() // 컴포넌트가 꺼질 때 안전하게 커넥션 반납
  }
})
</script>

<template>
  <div class="chart-container">
    <div class="chart-header">
      <h2>🖥️ 실시간 CPU 사용률 관제</h2>
      <span class="status-badge" :class="{ online: isConnected }">
        {{ isConnected ? '● LIVE' : '○ DISCONNECTED' }}
      </span>
    </div>

    <div class="chart-wrapper">
      <LineChart :chartData="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
/* 대시보드 카드 테두리 및 섀도우 기본 인테리어 (정적) */
.chart-container {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 20px auto;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin: 0;
}

/* 실시간 상태 불빛 디자인 (동적 바인딩 대응) */
.status-badge {
  font-size: 0.85rem;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 20px;
  background: #fee2e2;
  color: #ef4444;
  transition: all 0.3s ease;
}

/* 연결 완료 시 실시간으로 바뀔 클래스 모양 */
.status-badge.online {
  background: #dcfce7;
  color: #22c55e;
}

/* 차트 캔버스가 늘어날 운동장 크기 지정 */
.chart-wrapper {
  position: relative;
  height: 350px;
  width: 100%;
}
</style>