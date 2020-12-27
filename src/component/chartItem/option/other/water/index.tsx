import React, { useState,useRef, useEffect } from 'react';
// 水球图只在该组件中用到，不应封装到echarts全局组件中
import   echarts from './echarts.min';
import './echarts-liquidfill.min';
import * as R from 'ramda'; 
import { mock, config,apiConfig, default as getOption } from './water';
export {mock,config,apiConfig};
import elementResizeEvent from 'element-resize-event';

export default ({option:props}) => {
  let watch = R.pick(['data', 'x', 'valueFontSize', 'percentFontSize', 'titleFontSize'], props); 
  const ref = useRef(null);
  const [chart,setChart]=useState(null)

  useEffect(() => {
    if (!ref.current) {
      return;
    }
  
     let  chartInstance = echarts.init(ref.current, { renderer: 'canvas' });
     setChart(chartInstance) 
     elementResizeEvent(ref.current, () => {
      chartInstance.resize();
    });
    return ()=>{
      try{ 
        elementResizeEvent.unbind( ref?.current, () => {});
        ref?.current?.dispose?.()
      }catch(e){}
    }
  }, []);

  useEffect(() => {  
    if(Object.keys(watch).length==0){return}
    let option= getOption(props); 
    chart?.setOption?.(option); 
  }, [watch]); 

  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
};
