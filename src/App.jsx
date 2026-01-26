import React, { useState, useEffect } from 'react';
import SwitchApp from './SwitchApp.jsx';
import EmployerApp from './EmployerApp.jsx';

function App() {
  // Check for saved mode preference
  const [appMode, setAppMode] = useState(() => {
    const savedMode = localStorage.getItem('switch_app_mode');
    return savedMode || 'worker'; // Default to worker mode
  });

  // Save mode preference when it changes
  useEffect(() => {
    localStorage.setItem('switch_app_mode', appMode);
  }, [appMode]);

  const switchToEmployer = () => setAppMode('employer');
  const switchToWorker = () => setAppMode('worker');

  if (appMode === 'employer') {
    return <EmployerApp onSwitchToWorker={switchToWorker} />;
  }

  return <SwitchApp onSwitchToEmployer={switchToEmployer} />;
}

export default App;


