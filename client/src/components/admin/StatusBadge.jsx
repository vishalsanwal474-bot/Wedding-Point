import { formatStatusLabel } from '../../utils/adminHelpers';
import './StatusBadge.css';

function StatusBadge({ status }) {
  const safeStatus = status || 'new';

  return (
    <span className={`status-badge status-badge--${safeStatus}`}>
      {formatStatusLabel(safeStatus)}
    </span>
  );
}

export default StatusBadge;
