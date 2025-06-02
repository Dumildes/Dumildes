import React, { useState, useEffect } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import ScrollSelector from './ScrollSelector';

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
].map((label, index) => ({ label, value: index + 1 }));

const generateDays = (month: number, year: number) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    label: String(i + 1),
    value: i + 1
  }));
};

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  return Array.from(
    { length: currentYear - startYear + 1 },
    (_, i) => ({
      label: String(startYear + i),
      value: startYear + i
    })
  ).reverse();
};

interface CalendarProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect = () => {},
  initialDate = new Date()
}) => {
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [day, setDay] = useState(initialDate.getDate());
  const [year, setYear] = useState(initialDate.getFullYear());
  const [days, setDays] = useState(generateDays(month, year));
  
  const isMobile = useMediaQuery('(max-width:640px)');
  const itemHeight = isMobile ? 48 : 56;
  const visibleItems = 5;
  const years = generateYears();

  useEffect(() => {
    const newDays = generateDays(month, year);
    setDays(newDays);
    if (day > newDays.length) {
      setDay(newDays.length);
    }
  }, [month, year]);

  useEffect(() => {
    const selectedDate = new Date(year, month - 1, day);
    onDateSelect(selectedDate);
  }, [day, month, year, onDateSelect]);

  return (
    <Box className="w-full max-w-md mx-auto px-4 py-6">
      <Box className="text-center mb-6">
        <Typography variant="h4" component="h1" className="text-3xl font-bold mb-2">
          Selecione uma data
        </Typography>
        <Typography variant="body1" className="text-gray-600">
          {new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </Typography>
      </Box>

      <Box className="bg-white rounded-lg p-6">
        <Box className="flex justify-between items-center mb-4">
          <Box className="w-1/3 px-1">
            <Typography variant="body2" className="text-center mb-1 text-gray-600">
              Mês
            </Typography>
          </Box>
          <Box className="w-1/3 px-1">
            <Typography variant="body2" className="text-center mb-1 text-gray-600">
              Dia
            </Typography>
          </Box>
          <Box className="w-1/3 px-1">
            <Typography variant="body2" className="text-center mb-1 text-gray-600">
              Ano
            </Typography>
          </Box>
        </Box>
        
        <Box className="flex justify-between">
          <Box className="w-1/3 px-1">
            <ScrollSelector
              options={months}
              value={month}
              onChange={(value) => setMonth(Number(value))}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          </Box>
          
          <Box className="w-1/3 px-1">
            <ScrollSelector
              options={days}
              value={day}
              onChange={(value) => setDay(Number(value))}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          </Box>
          
          <Box className="w-1/3 px-1">
            <ScrollSelector
              options={years}
              value={year}
              onChange={(value) => setYear(Number(value))}
              itemHeight={itemHeight}
              visibleItems={visibleItems}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;