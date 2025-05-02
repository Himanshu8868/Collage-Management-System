import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const NoticeContext = createContext();

export const NoticeProvider = ({ children }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notice/getNotices', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotices(res.data.data || []);
    } catch (err) {
      console.error('Error fetching notices', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const CreateNotice = async (noticeData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/notice/createNotice', noticeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setNotices((prevNotices) => [res.data.data, ...prevNotices]);
      }
    } catch (err) {
      console.error('Error creating notice', err);
    }
  }

  return (
    <NoticeContext.Provider value={{ notices, fetchNotices, loading , CreateNotice }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => useContext(NoticeContext);
 