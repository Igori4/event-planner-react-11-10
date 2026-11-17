import Button from './Button';
import css from './EventSearchForm.module.css';

interface EventSearchFormProps {
  onSearch: (topic: string) => void;
}

export default function EventSearchForm({ onSearch }: EventSearchFormProps) {
  const handleSubmit = (formData: FormData) => {
    const topic = formData.get('topic') as string;

    // if (topic.trim() === '') {
    //   alert('Введіть пошуковий запит!');
    //   return;
    // }

    onSearch(topic);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <input type="text" name="topic" placeholder="Пошук подій…" />
      <Button variant="primary" text="Знайти" />
    </form>
  );
}
