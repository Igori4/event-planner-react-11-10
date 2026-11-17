import { useState } from 'react';
import EventCard from './EventCard';
import AddEventForm from './AddEventForm';
import Button from './Button';
import css from './App.module.css';
import type { Event } from './types';
import type { DraftEvent } from './AddEventForm';
import EventSearchForm from './EventSearchForm';
import { fetchEvents } from './services/eventService';

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSearch = async (topic: string) => {
    try {
      setIsLoading(true);
      // Скидаємо помилку перед КОЖНИМ запитом, а не лише в catch
      setIsError(false);

      const data = await fetchEvents(topic);
      setEvents(data);
    } catch {
      setIsError(true);
    } finally {
      // finally виконається за будь-якого результату
      setIsLoading(false);
    }
  };

  const handleToggleGoing = (id: string) => {
    setEvents(events.map((event) => (event.id === id ? { ...event, going: !event.going } : event)));
  };

  const handleAddEvent = (draft: DraftEvent) => {
    const newEvent: Event = {
      ...draft,
      id: crypto.randomUUID(),
      isOnline: draft.location.toLowerCase() === 'online',
      going: false,
    };

    setEvents([newEvent, ...events]);
    setIsFormOpen(false);
  };

  const goingCount = events.filter((event) => event.going).length;

  return (
    <>
      <h1>Найближчі події</h1>

      <EventSearchForm onSearch={handleSearch} />

      {isLoading && <p>Завантажуємо події, зачекайте…</p>}
      {isError && <p>Ой, щось пішло не так! Спробуйте ще раз.</p>}

      <div className={css.toolbar}>
        <p>
          Йдете на {goingCount} з {events.length} подій
        </p>
        <Button
          variant="primary"
          text={isFormOpen ? 'Сховати форму' : '+ Додати подію'}
          onClick={() => setIsFormOpen(!isFormOpen)}
        />
      </div>

      {isFormOpen && <AddEventForm onAdd={handleAddEvent} />}

      <div className={css.cards}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} onToggleGoing={handleToggleGoing} />
        ))}
      </div>
    </>
  );
}
