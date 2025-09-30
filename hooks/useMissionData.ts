import { useState } from 'react';

const staticMissionData = {
  workoutPlan: [
    { id: 'dl', name: 'Resistive Deadlift 3x5', duration: 25 },
    { id: 'sq', name: 'Advanced Resistive Squat 5x5', duration: 25 },
    { id: 'bp', name: 'Zero-G Bench Press 5x5', duration: 20 },
    { id: 'op', name: 'Treadmill Run (30 min)', duration: 30 },
  ],
  missionCadence: [
    { time: '08:00', name: 'Morning Briefing' },
    { time: '11:30', name: 'Systems Check' },
    { time: '14:00', name: 'EVA Prep' },
    { time: '17:00', name: 'Geology Survey' },
  ]
};

export const useMissionData = () => {
  const [missionData] = useState(staticMissionData);

  return { missionData };
};
