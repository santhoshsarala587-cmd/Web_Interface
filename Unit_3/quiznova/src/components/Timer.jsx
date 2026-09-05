import { formatTime } from '../utils/formatters';

export default function Timer({ seconds }) {
  const low = seconds < 60;
  return (
    <div className={`timer-box ${low ? 'low' : ''}`}>
      ⏱ {formatTime(seconds)}
    </div>
  );
}
