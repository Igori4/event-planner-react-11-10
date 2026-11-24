import { useId } from 'react';
import Button from './Button';
import css from './AddEventForm.module.css';

export interface DraftEvent {
  title: string;
  date: string;
  location: string;
  description: string;
}

interface AddEventFormProps {
  onAdd: (draft: DraftEvent) => void;
}

export default function AddEventForm({ onAdd }: AddEventFormProps) {
  const fieldId = useId();

  const handleSubmit = (formData: FormData) => {
    const draft: DraftEvent = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      description: formData.get('description') as string,
    };

    if (!draft.title.trim()) return;

    onAdd(draft);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <label htmlFor={`${fieldId}-title`}>Назва події</label>
      <input type="text" name="title" id={`${fieldId}-title`} />

      <label htmlFor={`${fieldId}-date`}>Дата</label>
      <input type="text" name="date" id={`${fieldId}-date`} placeholder="01.08.2026" />

      <label htmlFor={`${fieldId}-location`}>Місце проведення</label>
      <input type="text" name="location" id={`${fieldId}-location`} />

      <label htmlFor={`${fieldId}-description`}>Опис</label>
      <textarea name="description" id={`${fieldId}-description`} />

      <Button variant="primary" text="Зберегти подію" />
    </form>
  );
}
