import Button from './Button';
import css from './EventSearchForm.module.css';

interface EventSearchFormProps {
  initialTopic: string;
  onSearch: (topic: string) => void;
}

export default function EventSearchForm({ initialTopic, onSearch }: EventSearchFormProps) {
  const handleSubmit = (formData: FormData) => {
    const topic = formData.get('topic') as string;

    onSearch(topic);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      {/* defaultValue показує останній збережений пошук */}
      <input type="text" name="topic" placeholder="Пошук подій…" defaultValue={initialTopic} />
      <Button variant="primary" text="Знайти" />
    </form>
  );
}
