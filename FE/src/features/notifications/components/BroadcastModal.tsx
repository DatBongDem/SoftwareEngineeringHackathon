import { useState, type FormEvent } from 'react'
import { Megaphone } from 'lucide-react'
import { useBroadcastNotification } from '../hooks/useBroadcastNotification'
import { Alert, Button, Modal, Textarea } from '@/shared/components'
import { getErrorMessage } from '@/shared/lib/getErrorMessage'

export function BroadcastModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const broadcast = useBroadcastNotification()
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!message.trim()) return

    broadcast.mutate(message, {
      onSuccess: () => {
        setMessage('')
        onClose()
      },
    })
  }

  return (
    <Modal open={open} onClose={onClose} title="Broadcast Notification">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {broadcast.isError && <Alert tone="danger">{getErrorMessage(broadcast.error)}</Alert>}

        <p className="text-xs text-slate-500">
          Thông báo này sẽ được phát đi và gửi đến tất cả người dùng trong hệ thống (ban tổ chức, đội thi, giám khảo).
        </p>

        <Textarea
          label="Nội dung thông báo"
          required
          rows={4}
          placeholder="Nhập thông điệp ban tổ chức cần gửi..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Hủy
          </Button>
          <Button type="submit" loading={broadcast.isPending}>
            <Megaphone className="h-4 w-4" />
            Phát thông báo
          </Button>
        </div>
      </form>
    </Modal>
  )
}
