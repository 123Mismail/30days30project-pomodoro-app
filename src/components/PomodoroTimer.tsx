 
"use client"

 import React, { useEffect, useRef, useState } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react";

import Link from "next/link";
import { Button } from "./ui/button";

type TimerStatus = "idle" | "running" | "pause";
type SessionType = "work" | "break";

interface PomodorState {
  workDuration: number;
  breakDuration: number;
  currentTime: number;
  currentSession: SessionType;
  timerStatus: TimerStatus;
}

const PomodoroTimer = () => {
  //managing state
  const [state, setState] = useState<PomodorState>({
    workDuration: 25 * 60,
    breakDuration: 5 * 60,
    currentTime: 25 * 60,
    currentSession: "work",
    timerStatus: "idle",
  });
  // managing useRef hook
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // managing logic here

  useEffect(() => {
    if (state.timerStatus === "running" && state.currentTime > 0) {
      timerRef.current = setInterval(() => {
        setState((prevState) => ({
          ...prevState,
          currentTime: state.currentTime - 1,
        }));
      }, 1000);
    } else if(state.currentTime===0){
      clearInterval(timerRef.current as NodeJS.Timeout)
      handleSessionSwitch();
    }
    return ()=>clearInterval(timerRef.current as NodeJS.Timeout)
  },[state.timerStatus,state.currentTime]);

   // handlesession switch

   const handleSessionSwitch =(): void => {
    setState((prevState)=>{

      const isSetSession=prevState.currentSession === "work";
      return {
        ...prevState,
        currentSession : isSetSession ? "break" : "work",
        workDuration :isSetSession ? prevState.breakDuration :prevState.workDuration
      }
    })
   }

   // handling start and pause btns 

   const handleStartPause=() : void  =>{
    if(state.timerStatus === "running"){
      setState((prevState)=>({
        ...prevState,
        timerStatus : "pause",
       
      }));
      clearInterval(timerRef.current as NodeJS.Timeout)
    }else{
       setState((prevState)=>({
        ...prevState,
        timerStatus:"running"
       }))
    }
   };

   // handle reset btn

   const handleResetBtn=():void=>{
    clearInterval (timerRef.current as NodeJS.Timeout);
    setState((prevState)=>({
      ...prevState,
      currentTime:prevState.workDuration,
      currentSession: "work",
       timerStatus: "pause"
    }))
   };

   // handle duration changes

   const handleDurationChange=(type:SessionType ,increment:boolean):void=>{
     setState((prevState)=>{
      const setDuration= increment? 60 : -60;
      if(type==="work"){
        return {
          ...prevState,
          workDuration: Math.max(60, prevState.currentTime + setDuration),
          currentTime: prevState.currentSession === "work" ? Math.max(60, prevState.workDuration + setDuration) : prevState.currentTime,
          
        };
      } else{
        return{
          ...prevState,
          breakDuration:Math.max(60, prevState.breakDuration + setDuration), 
           currentTime: prevState.currentSession === "break" ? Math.max(60 , prevState.breakDuration + setDuration): prevState.currentTime
        }
      }
     })
   }

    // managing timer ti display  
    const formateTime= (second :number):string =>{
      const minutes=Math.floor(second/60);
      const remainingSeconds=second % 60;
      return `${minutes.toString().padStart(2,"0")}:${remainingSeconds.toString().padStart(2,"0")}`;
    }

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="max-w-[500px] w-full min-h-[400px] p-5 shadow-2xl   rounded-2xl">
        <div className="  text-center">
          <h1 className="pt-4 text-4xl font-bold"> Pomodoro Timer</h1>
          <p className="pt-3 text-base font-semibold">
            A timer for the Pomodoro Technique.
          </p>
          <span 
          className="text-3xl font-semibold mt-8"
          >{ state.currentSession ==="work" ? "work" : "break" }</span>
           
        </div>
        <div className="text-center pt-4 text-6xl font-bold">{formateTime(state.currentTime)}</div>
        <div className="text-center flex justify-center gap-2 pt-7 pb-3">
          <Button
            variant={"outline"}
            className="rounded-full hover:border-orange-400"
            onClick={()=>handleDurationChange("work",false)}
          >
            {" "}
            <MinusIcon />
          </Button>
          <Button
            variant={"outline"}
            className="rounded-full hover:border-orange-400" 
            onClick={()=>handleDurationChange("work",true)}
          >
            {" "}
            <PlusIcon />
          </Button>
          <Button
            variant={"outline"}
            className="rounded-full hover:border-orange-400"
            onClick={handleStartPause}
          >
            {state.timerStatus ==="running" ? <PauseIcon /> : <PlayIcon />}
         
          </Button>
           
          <Button
            variant={"outline"}
            className="rounded-full hover:border-orange-400"
            onClick={handleResetBtn} 
          >
            {" "}
            <RefreshCwIcon />{" "}
          </Button>
        </div>
        <div className="text-center p-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="rounded-xl">
                What is Pomodoro Techniques
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ➡️ Explanation of Pomodoro Technique 🔥
                </AlertDialogTitle>
                <AlertDialogDescription>
                  The Pomodoro Technique is a time management method that uses a
                  timer to break work into intervals called Pomodoros. The
                  Pomodoro timer is traditionally set for 25 minutes, but can be
                  customized to fit your needs. The basic steps are:
                  <div className="p-2">
                    <strong>
                      <ol>
                        <li> 1. Select a single task to focus on.</li>
                        <li>
                          {" "}
                          2. Set a timer for 25-30 min. and work continuously
                          until the timer goes off.
                        </li>
                        <li>
                          3. Take a productive 5 min. break-walk around, get a
                          snack, relax.
                        </li>
                        <li>4. Repeat steps 2 & 3 for 4 rounds.</li>
                        <li>5. Take a longer (20-30 min.) break.</li>
                      </ol>
                    </strong>
                  </div>
                  <div className="pt-5">
                    <Link
                      href="https://todoist.com/productivity-methods/pomodoro-technique"
                      target="_blank"
                    >
                      <Button className="w-3/6 rounded-2xl">
                        click here to read more!
                      </Button>
                    </Link>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
