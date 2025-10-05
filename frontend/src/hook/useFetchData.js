import { useState, useEffect } from 'react';

function useFetchData(apiFunction, params = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFunction(...params); // Truyền đối tượng params vào apiFunction
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFunction, JSON.stringify(params)]); // Chuyển params thành chuỗi để theo dõi thay đổi

  return { data, isLoading, error };
}

export default useFetchData;
