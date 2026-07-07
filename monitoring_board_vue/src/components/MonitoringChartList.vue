<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { requestLatestStatus, connectWebSocket, deactivateWebSocket, isConnected, SUBSCRIBE_SYSTEM_LIST_TOPIC, subscriptionMap, SUBSCRIBE_CPU_INFO_TOPIC } from '../websocket/websocket.ts'
import MonitoringChartPane from './MonitoringChartPane.vue'
interface SystemStatus {
    hostname:string
    cpuUsage:string
    memoryUsage:string
    rx:string
    tx:string
}
const connectedStatus = ref(false)
const hostNameList = ref<SystemStatus[]>([])

const updateSystemList = (messageBody:string) => {
    console.debug("Receive message : ", messageBody)

    const hostnames = messageBody.split('|')
    hostNameList.value = hostnames.map
        ((hostname) => {
            return {hostname: hostname, cpuUsage:'0', memoryUsage:'0', rx:'0', tx:'0'} as SystemStatus})
}


const updateSystemCharts = (messageBody:string) => {
    const metrics = JSON.parse(messageBody)
    console.debug('message body',messageBody)
   
    hostNameList.value = hostNameList.value.map((system) => 
        {
            if(system.hostname === metrics.hostname)
            {
                return {
                    hostname:system.hostname,
                    cpuUsage:String(metrics.cpuUsage),
                    memoryUsage:String(metrics.memoryUsage),
                    rx:String(metrics.rx),
                    tx:String(metrics.tx)
                }
            }else{
                return system
            }
        }
    )
}

onMounted(() => {
    subscriptionMap.set(SUBSCRIBE_SYSTEM_LIST_TOPIC, updateSystemList)
    subscriptionMap.set(SUBSCRIBE_CPU_INFO_TOPIC, updateSystemCharts)
    connectWebSocket(() => {
        connectedStatus.value = isConnected()
        requestLatestStatus()
    }) 
})

onUnmounted(() => {
    deactivateWebSocket()
})

</script>

<template>
    <v-card>
        <MonitoringChartPane v-for="({hostname, cpuUsage, memoryUsage, rx, tx}, index) in hostNameList"  
        :key="index" :hostname="hostname" :cpu-usage="cpuUsage" :memory-usage="memoryUsage" :rx="rx" :tx="tx"
        :connected-status = "connectedStatus"
        />
    </v-card>
</template>

<style scoped>
</style>