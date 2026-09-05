export default function Modal({ title, children, onClose, footer }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {title && <h3 style={{ marginTop: 0, marginBottom: 14 }}>{title}</h3>}
        <div>{children}</div>
        {footer && <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 22 }}>{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmModal({ title, message, details, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel, danger }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>{cancelLabel}</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>{confirmLabel}</button>
        </>
      }
    >
      {details && <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14, marginBottom: 14, fontSize: 13.5 }}>{details}</div>}
      <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{message}</p>
    </Modal>
  );
}
