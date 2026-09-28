import { useCallback, useEffect, useState } from 'react';
import { blogApi } from '../services/api';
import { errorMessage } from '../utils/helpers';

export default function useBlogs(params) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const key = JSON.stringify(params || {});
  const load = useCallback(() => {
    setLoading(true); setError('');
    blogApi.list(params).then(setBlogs).catch((e) => setError(errorMessage(e))).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => { load(); }, [load]);
  return { blogs, setBlogs, loading, error, reload: load };
}
