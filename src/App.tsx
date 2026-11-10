import EventCard from "./EventCard";
import "./App.css";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  hasPeople: boolean;
  isOnline?: boolean;
}

const events: Event[] = [
  {
    id: "id-1",
    title: "React Meetup Lviv",
    date: "01.08.2026",
    location: "Lviv",
    hasPeople: true,
  },
  {
    id: "id-2",
    title: "TypeScript Workshop",
    date: "15.08.2026",
    location: "Kyiv",
    hasPeople: true,
    isOnline: true,
  },
  {
    id: "id-3",
    title: "Frontend Conf Kyiv",
    date: "20.09.2026",
    location: "Kyiv",
    hasPeople: false,
  },
];

// Поки без props (наступна тема) — тому картки однакові.
export default function App() {
  return (
    <>
      <h1>Найближчі події</h1>
      <div className="app-cards">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </>
  );
}
