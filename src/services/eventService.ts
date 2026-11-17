import axios from 'axios';
import type { Event } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL;

// HTTP-функція пошуку подій
export const fetchEvents = async (topic: string): Promise<Event[]> => {
  const response = await axios.get<Event[]>(`${BASE_URL}/events`, {
    params: { title: topic },
  });

  return response.data;
};
