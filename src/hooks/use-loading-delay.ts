import { useState, useEffect } from "react";

interface UseLoadingDelayProps {
  isActuallyLoading: boolean;
  minimumLoadingTime?: number;
}

export function useLoadingDelay({
  isActuallyLoading,
  minimumLoadingTime = 500,
}: UseLoadingDelayProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!isActuallyLoading) {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [isActuallyLoading, startTime, minimumLoadingTime]);

  return isLoading || isActuallyLoading;
}
