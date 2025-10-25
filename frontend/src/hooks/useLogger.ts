import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import logService from '../services/logService';

/**
 * Hook para usar o serviço de logging em componentes React
 */
export const useLogger = () => {
  const location = useLocation();

  // Log automático de mudança de página
  useEffect(() => {
    logService.logPageView(location.pathname);
  }, [location.pathname]);

  // Funções para logging
  const logClick = useCallback((element: string, additionalData?: any) => {
    logService.logClick(element, location.pathname, additionalData);
  }, [location.pathname]);

  const logError = useCallback((error: Error, context?: string) => {
    logService.logError(error, context);
  }, []);

  return {
    logClick,
    logError,
    logWorkoutStart: logService.logWorkoutStart.bind(logService),
    logWorkoutComplete: logService.logWorkoutComplete.bind(logService),
    logExerciseSelect: logService.logExerciseSelect.bind(logService),
    logSearch: logService.logSearch.bind(logService),
    logApiCall: logService.logApiCall.bind(logService),
    getLogs: logService.getLogs.bind(logService),
    printSummary: logService.printSummary.bind(logService),
  };
};
