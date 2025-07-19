// client/src/hooks/useApi.js
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const useApi = (apiCall, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiCall(...args);
        setData(result);
        return result; // Return result for caller to use
      } catch (err) {
        setError(err);
        toast.error(err); // Display error using toast
        throw err; // Re-throw to allow component to handle specific errors
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  return { data, loading, error, execute, setData }; // setData to allow manual updates
};

export default useApi;