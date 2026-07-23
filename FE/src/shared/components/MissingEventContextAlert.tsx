import { Link } from 'react-router-dom'
import { Alert } from './Alert'

// Several routes (Track/Round Submissions/Judging/Calibration/Ranking) rely on an
// `?eventId=` query param that's only present when navigated from within an event's
// tabs. A bare bookmark, hand-typed URL, or stale link lands here with no param —
// give the user a way out instead of a dead-end warning.
export function MissingEventContextAlert({ message }: { message: string }) {
  return (
    <Alert tone="warning">
      {message}{' '}
      <Link to="/events" className="font-medium underline">
        Back to events
      </Link>
    </Alert>
  )
}
