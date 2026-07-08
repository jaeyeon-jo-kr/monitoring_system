import { useEffect, useRef, useState, type SetStateAction } from "react";
import "./App.css";
import { CpuUsageChart } from "./charts/CpuUsageChart";
import {
  connectWebSocket,
  deactivateWebSocket,
  SUBSCRIBE_SYSTEM_STATUS_TOPIC,
  subscriptionMap,
} from "./websocket/websocket";
import "@mantine/core/styles.css";

import { Box, Center, MantineProvider, Paper, SegmentedControl } from "@mantine/core";
import { AppShell } from "@mantine/core";
import { MemoryUsageChart } from "./charts/MemoryUsageChart";
import { TxRxChart } from "./charts/TxRxChart";
import { useIntersection } from '@mantine/hooks';

interface SystemStatus {
  hostname: string;
  cpuUsage: string;
  memoryUsage: string;
  rx: string;
  tx: string;
}

const updateSystemListHandler = (
  setSystemStatusList: React.Dispatch<
    SetStateAction<Map<string, SystemStatus>>
  >,
) => {
  return (messageBody: string) => {
    const metrics = JSON.parse(messageBody);

    setSystemStatusList((systemStatusList) => {
      const newMap = new Map(systemStatusList);
      newMap.set(metrics.hostname, {
        hostname: metrics.hostname,
        cpuUsage: metrics.cpuUsage,
        memoryUsage: metrics.memoryUsage,
        rx: String(metrics.rx),
        tx: String(metrics.tx),
      });
      return newMap;
    });
  };
};

const onConnectHandler = () => {};

const App = () => {
  const [systemStatusList, setSystemStatusList] = useState<
    Map<string, SystemStatus>
  >(new Map());
  const [hostname, setHostname] = useState('')
  const value = systemStatusList.get(hostname)
  const cpuUsage = Number(value?.cpuUsage || 0)
  const memoryUsage = Number(value?.memoryUsage || 0)
  const tx = Number(value?.tx || 0)
  const rx = Number(value?.rx || 0)
  const mainContainer = useRef<HTMLDivElement>(null)
  const { segCtlRef, segCtlRefEntry } = useIntersection({
    threshold: 0.5
  });

  useEffect(() => {
    subscriptionMap.set(
      SUBSCRIBE_SYSTEM_STATUS_TOPIC,
      updateSystemListHandler(setSystemStatusList),
    );
    connectWebSocket(onConnectHandler);

    return () => {
      deactivateWebSocket();
    };
  }, []);
  const getHostNameList = () => {
    return Array.from(systemStatusList.keys()).map((hostname) => {return {label: hostname, value:hostname}})
  }
  useEffect(()=>{
    console.log("intersected?", segCtlRefEntry?.isIntersecting)
  }, [segCtlRefEntry?.isIntersecting])

  return (
    <MantineProvider>
      <AppShell header={{ height:60}} >
        <AppShell.Header>
          <div>Monitoring Board</div>
        </AppShell.Header>
        <AppShell.Navbar>
        </AppShell.Navbar>
        <AppShell.Main>
            <SegmentedControl  data={getHostNameList()} onChange={setHostname} value={hostname}/>
            <CpuUsageChart newValue={cpuUsage}/>
            <MemoryUsageChart newValue={memoryUsage} />
            <TxRxChart tx={tx} rx={rx} />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
