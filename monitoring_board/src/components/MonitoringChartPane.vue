<script setup lang="ts">
import SingleSeriesChart from './SingleSeriesChart.vue';

const props = defineProps<{
  hostname?: string
  cpuUsage: string
  memoryUsage: string
  rx:string
  tx:string
  connectedStatus:boolean 
}>()


</script>

<template>
  <div class="chart-container">
    <div class="chart-header">
      <h2>🖥️ システムス状態<br/>
           ホスト名 : {{ props.hostname }}
      </h2>
      <span class="status-badge" :class="{ online: connectedStatus }">
        {{ connectedStatus ? '● LIVE' : '○ DISCONNECTED' }}
      </span>
    </div>
    <SingleSeriesChart :label="'CPU 使用率'" :value="cpuUsage"/>
    <SingleSeriesChart :label="'Memory 使用率'" :value="memoryUsage"/>
  </div>
</template>

<style scoped>
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
</style>