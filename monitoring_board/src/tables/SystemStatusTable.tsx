import { Table } from '@mantine/core';
import { useEffect, useState } from 'react';

export const SystemStatusTable = () => {
    const [systemStatus, setSystemStatus] = useState([])
    useEffect(() => {
        const fetchSystemStatus = async () => {
            console.debug('data 획득 시도 : ', )
            const response = await fetch("http://localhost:8080/api/system_status/list?page=0&size=10")
            if(!response.ok)
            {
                console.error('데이터 획득 실패')
                return
            }
            const data = await response.json()
            setSystemStatus(data.content) 
            console.debug('data : ', data)
        }
        fetchSystemStatus()
    }, [])
    const getRows = () => {
        return systemStatus.map(
        (systemStatus) => {
            return (
            <Table.Tr key={systemStatus.hostname}>
                <Table.Td>{systemStatus.id}</Table.Td>
                <Table.Td>{systemStatus.hostname}</Table.Td>
                <Table.Td>{systemStatus.cpuUsage}</Table.Td>
                <Table.Td>{systemStatus.memoryUsage}</Table.Td>
                <Table.Td>{systemStatus.rx}</Table.Td>
                <Table.Td>{systemStatus.tx}</Table.Td>
            </Table.Tr>)
    })
     } 
    return (
    <Table stickyHeader stickyHeaderOffset={60}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>id</Table.Th>
          <Table.Th>HostName</Table.Th>
          <Table.Th>CpuUsage</Table.Th>
          <Table.Th>MemoryUsage</Table.Th>
          <Table.Th>rx</Table.Th>
          <Table.Th>tx</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{getRows()}</Table.Tbody>
      <Table.Caption>CPU Insert</Table.Caption>
    </Table>)
}