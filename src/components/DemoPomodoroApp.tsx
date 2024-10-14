
"use client"
import React, { useEffect, useRef, useState } from 'react'
 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {Button} from "@/components/ui/button"
import { LuPlay,LuMinus,LuPlus,LuPause, LuRefreshCcw } from "react-icons/lu";
import Link from 'next/link';

type TimerStatus= "running" | "pause" | "idle";
type SessionStatus =" work" | "breack";

interface PomodorStateType{
  workDuration:number,
  breakDuration:number,
  currentTime:number,
  currentSession:SessionStatus,
  timerStatus:TimerStatus
};

const DemoPomodoroApp = () => {

  const [state ,setState]=useState<PomodorStateType>({
    workDuration:25 * 60,
    breakDuration:5 * 60,
    currentTime: 25 * 60,
    currentSession:"work",
    timerStatus: "running"
  }); 

  const timerRef=useRef<NodeJS.Timeout | null>(null);

  useEffect(()=>{
    if(state.currentSession ==="work" && state.currentTime > 0){
      timerRef.current= setInterval(()=>{

        setState((prevState)=>({
          ...prevState,
          currentTime :state.currentTime -1,

        }))
      },1000)
    }else if(state.currentTime === 0){
       clearInterval(timerRef.current as NodeJS.Timeout);
       handleSessionSwitch();
    };
    return ()=> clearInterval(timerRef.current as NodeJS.Timeout)
  },[state.timerStatus , state.currentTime]);

 const handleSessionSwitch= ():void =>{
   setState((prevState)=>{
    const isSession=state.currentSession ==="work";
    return{
      ...prevState,
      currentSession: isSession ? "break" : "work", 
      workDuration:isSession ? prevState.breakDuration : prevState.workDuration
    }
   })
 }

// handling pause play btn 
 const handlePauseStart=()=>{
   if(state.timerStatus === "running"){
    setState((prevState)=>({
      ...prevState,
      timerStatus: "pause"
    }))
      clearInterval(timerRef.current as NodeJS.Timeout)
   }else{
    setState((prevState)=>({
      ...prevState,
      timerStatus: "running"
    }))
   }
   return clearInterval(timerRef.current as NodeJS.Timeout)
 }

 // handle refresh btn 

 const handleRefreshBtn=()=>{
   clearInterval(timerRef.current as NodeJS.Timeout) 
   setState((prevState)=>({
    ...prevState,
    currentTime:prevState.workDuration,
    currentSession: "work",
    timerStatus: "pause",
   }))
 }
  
 // handle reset duration 

 const handleChangeDuraion =( type:SessionStatus,increment:boolean):void =>{
    setState((prevState)=>{
      const setDuration =increment ? 60 : -60;
      if(type === "work"){
        return {
          ...prevState,
          workDuration : Math.max(60, prevState.currentTime + setDuration),
          currentTime :  prevState.currentSession === "breack" ? Math.max(60, prevState.workDuration + setDuration) : prevState.currentTime
        } 
      }else{
        return {
          ...prevState,
          breakDuration: Math.max(60, prevState.breakDuration + setDuration),
          currentTime : prevState.currentSession ==="work" ? Math.max(60, prevState.breakDuration + setDuration):prevState.currentTime
        }
      }
    })
 }
  
  // formatting current time 

const formatTime=(seconds:number):string=>{
    const minutes= Math.floor(seconds/60);
    const remaingSecnds= seconds % 60;
    return `${minutes.toString().padStart(2,"0")}:${remaingSecnds.toString().padStart(2,"0")}`
}


  return (
    <div className='flex justify-center items-center h-screen'>
    <div className='max-w-[460px] w-full min-h-[50vh]  rounded-2xl shadow-2xl p-6'>
     <div className='text-center mt-2'>
      <h1 className='text-4xl font-semibold '> Pomodoro Timer App </h1>
      <p className='pt-3 text-base'>A timer for the Pomodoro Technique.</p>
      <span className='text-2xl font-medium text-center mx-auto pt-8'> work </span>
     </div>
    <div className='text-center font-bold text-6xl mt-10'>
      <h2>{formatTime(state.currentTime)}</h2>
    </div>

    <div className='flex justify-center items-center pt-4 gap-2'>
    <Button className='rounded-full' variant={'outline'}
    onClick={()=>handleChangeDuraion(" work" ,false)}
    ><LuMinus className=' text-lg'/></Button>
    <Button className='rounded-full' variant={'outline'}
    onClick={()=>handleChangeDuraion(" work" ,true)}
    ><LuPlus className=' text-lg'/></Button> 

          <Button className='rounded-full' variant={'outline'}
          onClick={handlePauseStart}
          > 
          {state.timerStatus === "running" ? <LuPlay/> : <LuPause/>}
          </Button> 

    <Button className='rounded-full' variant={'outline'} 
    onClick={handleRefreshBtn}
    ><LuRefreshCcw className=' text-lg'/></Button>
    </div>
    <div className='text-center pt-4 mt-6'>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className='rounded-2xl'>What is Pomodoro Techniques?</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>➡️ Explanation of Pomodoro Technique 🔥</AlertDialogTitle>
          <AlertDialogDescription>
          The Pomodoro Technique is a time management method that uses a timer to break work into intervals called Pomodoros. The Pomodoro timer is traditionally set for 25 minutes, but can be customized to fit your needs. The basic steps are:
          <div>
            <ol>
              <strong><li>1. Select a single task to focus on.</li></strong>
              <strong><li>1. Select a single task to focus on.</li></strong>
              <strong><li>1. Select a single task to focus on.</li></strong>
              <strong><li>1. Select a single task to focus on.</li></strong>
              <strong><li>1. Select a single task to focus on.</li></strong>
            </ol>
          </div>
          <Link href={'https://todoist.com/productivity-methods/pomodoro-technique ' } target='_blank'><Button className='rounded-2xl mt-7'> more about pomodoro technique</Button></Link>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='bg-black rounded-2xl text-white'>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
    </div>
    </div>
  )
}

export default DemoPomodoroApp