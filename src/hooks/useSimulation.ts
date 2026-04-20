import { useCallback, useState } from 'react';
import type { WorkflowNode, WorkflowEdge, SimulationResult } from '../types/workflow';
import { simulateWorkflow } from '../api/mockApi';

export const useSimulation = () => {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const simulate = useCallback(
    async (nodes: WorkflowNode[], edges: WorkflowEdge[]) => {
      setIsSimulating(true);
      setError(null);
      setResult(null);

      try {
        const simResult = await simulateWorkflow(nodes, edges);
        setResult(simResult);
        return simResult;
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Simulation failed.';
        setError(msg);
        return null;
      } finally {
        setIsSimulating(false);
      }
    },
    [],
  );

  const clearSimulation = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isSimulating,
    error,
    simulate,
    clearSimulation,
  };
};
