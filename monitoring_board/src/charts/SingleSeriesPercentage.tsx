import { useEffect, useReducer, useState } from 'react';
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from 'recharts';
import { RechartsDevtools } from '@recharts/devtools';

const chartDataReducer = (state, action) => {

}

interface DataType {
  name:string
  val:number
}

// // #region Sample data
// const data = [
//   {
//     name: 'Page A',
//     uv: 400,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 300,
//     pv: 4567,
//     amt: 2400,
//   },
//   {
//     name: 'Page C',
//     uv: 320,
//     pv: 1398,
//     amt: 2400,
//   },
//   {
//     name: 'Page D',
//     uv: 200,
//     pv: 9800,
//     amt: 2400,
//   },
//   {
//     name: 'Page E',
//     uv: 278,
//     pv: 3908,
//     amt: 2400,
//   },
//   {
//     name: 'Page F',
//     uv: 189,
//     pv: 4800,
//     amt: 2400,
//   },
// ];

const getTimeStamp = ():string => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
}

// #endregion
export const SingleSeriesPercentage = ({ newValue }: { newValue: number }) => {
  const [currentData, setCurrentData]= useState<DataType[]>([]);
  const [prevValue, setPrevValue] = useState(newValue);
  useEffect(()=>{
  },[newValue])
  console.debug('prev',prevValue)
  console.debug('new',newValue)

  if (!isNaN(newValue) && prevValue !== newValue) {
    setPrevValue(newValue);
    
    const next = { name: getTimeStamp(), val: newValue } as DataType;
    
    // 콜백 방식을 사용하여 최신 prev 상태를 안전하게 가공합니다.
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
      <Line type="monotone" dataKey="val" stroke="purple" strokeWidth={2} name="CPU　利用率" />
      <XAxis dataKey="name" />
      <YAxis width="auto" 
        label={{ value: 'percent', position: 'insideLeft', angle: -90 }} 
        tickFormatter={(value) => `${value}%`}/>
      <Legend align="right" />
      <RechartsDevtools />
    </LineChart>
  );
}