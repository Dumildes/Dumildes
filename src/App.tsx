import React from 'react';
import Calendar from './components/Calendar/Calendar';
import './components/Calendar/styles.css';

function App() {
  const handleDateSelect = (selectedDate: Date) => {
    console.log(`Data selecionada: ${selectedDate.toLocaleDateString('pt-BR')}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Calendar onDateSelect={handleDateSelect} />
    </div>
  );
}

export default App;