<script setup lang="ts">
import { ref, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { type ChartData } from 'chart.js'
import { LineChart } from 'vue-chart-3'

const props = defineProps<{
    label:string,
    value?:string
}>()

Chart.register(...registerables)
const chartData = ref<ChartData<'line'>>({
    labels: [], // x축: 시간 (예: 15:20:01, 15:20:02 ...)
    datasets: [{
            label: props.label  ,
            backgroundColor: 'rgba(54, 162, 235, 0.1)', // 선 아래 그라데이션 채우기용 색상
            borderColor: 'rgba(54, 162, 235, 1)',     // 메인 꺾은선 색상
            borderWidth: 2,
            pointRadius: 2, // 꺾이는 지점의 점 크기
            data: [],      // y축: 실시간 수치 (0 ~ 100)
            tension: 0.2   // 그래프 선의 부드러운 곡선 정도 (0이면 완전히 꺾은선)
        }
    ]
})

const updateChart = (label:string, newValue:string) => {
    if(!chartData.value.labels)
        return
    if (chartData.value.labels?.length > 20) {
        console.debug("shift chart")
        chartData.value.labels?.shift()
        chartData.value.datasets[0]?.data.shift()
    }
    console.debug("update chart : label", label)
    console.debug("update chart : newValue", newValue)
    chartData.value.labels?.push(label)
    chartData.value.datasets[0]?.data.push(parseInt(newValue))
}

const getTimeStamp = ():string => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

watch(props, (oldProps,newProps) => {
  console.debug('catch data modification')
  console.debug('old value : ', oldProps.value)
  if (!newProps)
    return
  // if there's no value, nothing to update
  if (!newProps.value)
    return
    updateChart(getTimeStamp(), newProps.value)
}, { immediate: true })






const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 100, // CPU는 항상 0~100% 사이이므로 y축 범위를 고정합니다.
      ticks: {
        callback: (value:string) => value + '%' // y축 수치 뒤에 % 붙이기
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
    duration: 1000 // 1초마다 데이터가 바뀌므로 애니메이션 속도를 0.3초로 제한하여 부드럽게 연출
  }
}
</script>


<template>
<div class="chart-wrapper">
      <LineChart :chartData="chartData" :options="chartOptions" />
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
/* 차트 캔버스가 늘어날 운동장 크기 지정 */
.chart-wrapper {
  position: relative;
  height: 350px;
  width: 100%;
}
</style>