import { useEffect, useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import EventCard from './EventCard';
import EventSearchForm from './EventSearchForm';
import AddEventForm from './AddEventForm';
import type { DraftEvent } from './AddEventForm';
import Button from './Button';
import css from './App.module.css';
import type { Event } from './types';
import { fetchEvents, fetchEventsByLocation } from './services/eventService';
import Modal from './Modal';
import SimilarEvents from './SimilarEvents';
import Pagination from './Pagination';
// import EventFeed from './EventFeed';

export default function App() {
  const [topic, setTopic] = useState(() => {
    const saved = window.localStorage.getItem('event-planner-topic');
    return saved !== null ? (JSON.parse(saved) as string) : '';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingEvent, setPendingEvent] = useState<Event | null>(null);
  // Позначки «Піду» — ЛОКАЛЬНИЙ стан. Дані з сервера ми поки лише читаємо.
  const [goingIds, setGoingIds] = useState<string[]>([]);

  // У ключі — і тема, і сторінка: кожна сторінка кешується окремо
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', topic, currentPage],
    queryFn: () => fetchEvents(topic, currentPage),
    // Показуємо попередню сторінку, поки вантажиться нова — без «блимання»
    placeholderData: keepPreviousData,
  });

  // Місце події, для якої відкрито модалку. Порожній рядок = модалка закрита.
  const pendingLocation = pendingEvent?.location ?? '';

  // Залежний запит: хук змонтований завжди, але виконується лише тоді,
  // коли є подія для підтвердження.
  const { data: similarEvents, isLoading: isSimilarLoading } = useQuery({
    queryKey: ['events', 'byLocation', pendingLocation],
    queryFn: () => fetchEventsByLocation(pendingLocation),
    enabled: pendingEvent !== null,
  });

  // Ефект збереження пошуку лишається: topic — локальний стан, не серверний
  useEffect(() => {
    localStorage.setItem('event-planner-topic', JSON.stringify(topic));
  }, [topic]);

  // Накладаємо локальні позначки «Піду» на дані, що прийшли з сервера
  const totalPages = data?.totalPages ?? 0;

  const events: Event[] = (data?.events ?? []).map((event) => ({
    ...event,
    going: goingIds.includes(event.id),
  }));

  const handleSearch = (nextTopic: string) => {
    setTopic(nextTopic);
    // Новий пошук — завжди з першої сторінки
    setCurrentPage(1);
  };

  const handleToggleGoing = (id: string) => {
    setGoingIds(
      goingIds.includes(id) ? goingIds.filter((goingId) => goingId !== id) : [...goingIds, id],
    );
  };

  const handleConfirmToggle = () => {
    if (pendingEvent) {
      handleToggleGoing(pendingEvent.id);
    }
    setPendingEvent(null);
  };

  const handleAddEvent = (draft: DraftEvent) => {
    // ⚠️ Тимчасово. Список тепер належить серверу, тож нову подію треба
    // відправити на бекенд POST-запитом — це мутація, тема заняття 7.
    console.log('Нова подія:', draft);
    setIsFormOpen(false);
  };

  const goingCount = events.filter((event) => event.going).length;

  return (
    <>
      <h1>Найближчі події</h1>

      <EventSearchForm initialTopic={topic} onSearch={handleSearch} />

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

      {isFormOpen && (
        <>
          <AddEventForm onAdd={handleAddEvent} />
          <p className={css.notice}>
            Створення події поки не зберігається на сервері — для цього потрібна мутація. Це тема
            заняття 7.
          </p>
        </>
      )}

      {isLoading && <p>Завантажуємо події, зачекайте…</p>}
      {isError && <p>Ой, щось пішло не так: {error.message}</p>}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {events.length > 0 && (
        <div className={css.cards}>
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRequestToggle={setPendingEvent} />
          ))}
        </div>
      )}
      {/* <EventFeed /> */}

      {pendingEvent && (
        <Modal onClose={() => setPendingEvent(null)}>
          <h2>{pendingEvent.going ? 'Скасувати участь?' : 'Підтвердити участь?'}</h2>
          <p>{pendingEvent.title}</p>

          <SimilarEvents
            events={similarEvents ?? []}
            isLoading={isSimilarLoading}
            currentId={pendingEvent.id}
          />

          <div className={css.modalActions}>
            <Button variant="secondary" text="Скасувати" onClick={() => setPendingEvent(null)} />
            <Button
              variant="primary"
              text={pendingEvent.going ? 'Так, не піду' : 'Так, піду'}
              onClick={handleConfirmToggle}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
