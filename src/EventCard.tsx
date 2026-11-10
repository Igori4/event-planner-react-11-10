import css from "./EventCard.module.css";
import clsx from "clsx";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  isOnline?: boolean;
}

export default function EventCard({
  title,
  date,
  location,
  isOnline,
}: EventCardProps) {
  return (
    <div className={clsx(css.card, isOnline ? css.online : "", "clase")}>
      <h2>{title}</h2>
      <p>{date}</p>
      <p>{location}</p>
      <label className={css.going}>
        <input type="checkbox" /> Піду
      </label>
    </div>
  );
}
