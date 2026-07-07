import { useEffect, useState, type SetStateAction } from 'react'
import './App.css'
import { SingleSeriesPercentage } from './charts/SingleSeriesPercentage'
import { connectWebSocket, deactivateWebSocket, SUBSCRIBE_SYSTEM_LIST_TOPIC, SUBSCRIBE_SYSTEM_STATUS_TOPIC, subscriptionMap } from './websocket/websocket';


interface SystemStatus {
  hostname:string
  cpuUsage:string
  memoryUsage:string
  rx:string
  tx:string
}

const updateSystemListHandler = (systemStatus: SystemStatus[], 
  setSystemStatus: React.Dispatch<SetStateAction<SystemStatus[]>>) => 
{
  return  (messageBody:string) => {
    const metrics = JSON.parse(messageBody)
    console.debug('message body',messageBody)
    setSystemStatus(
      systemStatus.map((system) => {
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
    )
  }
}


const onConnectHandler = () => {

}

const App = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([])

  useEffect(() => {
    subscriptionMap.set(SUBSCRIBE_SYSTEM_STATUS_TOPIC, updateSystemListHandler(systemStatus, setSystemStatus))
    connectWebSocket(onConnectHandler)

    return () => {
      deactivateWebSocket()
    }
  },[]);
  return (
    <>
      <SingleSeriesPercentage newValue={systemStatus.length > 0 ? Number(systemStatus[0].cpuUsage) : 0} />
    </>
  )
}

export default App
