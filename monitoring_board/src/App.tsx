import { useEffect, useState, type SetStateAction } from "react";
import "./App.css";
import { CpuUsageChart } from "./charts/CpuUsageChart";
import {
  connectWebSocket,
  deactivateWebSocket,
  SUBSCRIBE_SYSTEM_STATUS_TOPIC,
  subscriptionMap,
} from "./websocket/websocket";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import { AppShell } from "@mantine/core";
import { MemoryUsageChart } from "./charts/MemoryUsageChart";
import { TxRxChart } from "./charts/TxRxChart";

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

  const getCpuUsage = (): number => {
    const firstValue = systemStatusList.values().next();
    return Number(firstValue?.value?.cpuUsage || 0);
  };
  const cpuUsage = getCpuUsage();
  const getMemoryUsage = (): number => {
    const firstValue = systemStatusList.values().next();
    return Number(firstValue?.value?.memoryUsage || 0);
  };
  const memoryUsage = getMemoryUsage();
  const getTx = ():number => {
    const firstValue = systemStatusList.values().next();
    return Number(firstValue?.value?.tx || 0);
  }
  const getRx = ():number => {
    const firstValue = systemStatusList.values().next();
    return Number(firstValue?.value?.tx || 0);
  }
  

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
  return (
    <MantineProvider>
      <AppShell header={{ height:60}}>
        <AppShell.Header>
          <div>Monitoring Board</div>
        </AppShell.Header>
        <AppShell.Navbar>
        </AppShell.Navbar>
        <AppShell.Main>
          <CpuUsageChart newValue={cpuUsage} />
          {/* <MemoryUsageChart newValue={memoryUsage} /> */}
          {/* <TxRxChart tx={getTx()} rx={getRx()} /> */}
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
};

export default App;
