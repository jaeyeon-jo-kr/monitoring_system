import { useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

interface DataType {
  name:string
  tx:number
  rx:number
}

const getTimeStamp = ():string => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

// #endregion
export const TxRxChart = ({ tx, rx }: { tx: number, rx:number }) => {
  const [currentData, setCurrentData]= useState<DataType[]>([]);
  const [prevTx, setPrevTx] = useState(tx);
  const [prevRx, setPrevRx] = useState(tx);

  if ((!isNaN(tx) && prevTx !== tx) && 
      (!isNaN(rx) && prevRx !== rx)) {
    setPrevTx(tx); 
    setPrevRx(rx);
    const next = { name: getTimeStamp(), tx:tx, rx:rx } as DataType;
    setCurrentData((prev) => {
      if (prev.length >= 20) {
        return [...prev.slice(1), next];
      }
      return [...prev, next];
    });
  }
   
  return (
    <LineChart
      style={{ width: '100%', aspectRatio: 1.618, maxWidth: 600 }}
      responsive
      data={currentData}
      margin={{
        top: 20,
        right: 20,
        bottom: 5,
        left: 0,
      }}
    >
      <CartesianGrid stroke="#aaa" strokeDasharray="5 5" />
      <Line type="monotone" dataKey="tx" stroke="blue" strokeWidth={2} name="tx量" />
      <Line type="monotone" dataKey="rx" stroke="green" strokeWidth={2} name="rx量" />
      <XAxis dataKey="name" />
      <YAxis width="auto" 
        label={{ value: 'bytes', position: 'insideLeft', angle: -90 }} 
        tickFormatter={(value) => `${value}`}/>
      <Legend align="right" />
      <RechartsDevtools />
    </LineChart>
  );
}