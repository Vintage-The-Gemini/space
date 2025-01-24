// src/components/mission/MissionObjectives.jsx
import React from 'react';
import { Target, Check } from 'lucide-react';

const MissionObjectives = ({ objectives }) => (
  <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
    <h3 className="text-xl font-light mb-4 flex items-center">
      <Target className="w-5 h-5 mr-2 text-blue-400" />
      Mission Objectives
    </h3>
    <div className="space-y-3">
      {objectives.map((objective, index) => (
        <div key={index} className="flex items-center space-x-3">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">{objective}</span>
        </div>
      ))}
    </div>
  </div>
);