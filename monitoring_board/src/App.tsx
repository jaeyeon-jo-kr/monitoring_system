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

const updateSystemListHandler = (setSystemStatusList: React.Dispatch<SetStateAction<Map<string, SystemStatus>>>) => 
{
  return  (messageBody:string) => {
    const metrics = JSON.parse(messageBody)
    console.debug('message body',messageBody)
    
    setSystemStatusList((systemStatusList) => {
      console.debug('metrics.hostname ',metrics.hostname)
      const newMap = new Map(systemStatusList)
        newMap.set(metrics.hostname, {
                    hostname:metrics.hostname,
                    cpuUsage:metrics.cpuUsage,
                    memoryUsage:metrics.memoryUsage,
                    rx:String(metrics.rx),
                    tx:String(metrics.tx)
                })
        return newMap
      }
    )
  }
}


const onConnectHandler = () => {

}

const App = () => {
  const [systemStatusList, setSystemStatusList] = useState<Map<string, SystemStatus>>(new Map())

  const getCpuUsage = ():number =>  {
    const firstValue = systemStatusList.values().next();
    
    return Number(firstValue?.value?.cpuUsage)    
  }
  const cpuUsage = getCpuUsage()

  useEffect(() => {
    subscriptionMap.set(SUBSCRIBE_SYSTEM_STATUS_TOPIC, updateSystemListHandler(setSystemStatusList))
    connectWebSocket(onConnectHandler)

    return () => {
      deactivateWebSocket()
    }
  },[]);
  console.debug('cpuUsage', cpuUsage)
  return (
    <>
      <SingleSeriesPercentage newValue={cpuUsage} />
    </>
  )
}

export default App
