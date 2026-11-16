/** Photo of the selected place with honest attribution. Renders nothing unless a verified photo exists. */
export default function CityPhotoBanner({ photo, status }) {
  if (status === 'loading') return <div className="photo-banner photo-banner-loading skeleton" aria-hidden="true" style={{ height: 220 }} />
  if (status !== 'ready' || !photo) return null
  return (
    <figure className="photo-banner">
      <img src={photo.url} alt={photo.alt} loading="lazy" referrerPolicy="no-referrer" />
      <figcaption>
        {photo.source === 'nearby' ? `Nearby: ${photo.title} · ` : `${photo.title} · `}
        <a href={photo.creditUrl} target="_blank" rel="noopener noreferrer">{photo.credit}</a>
      </figcaption>
    </figure>
  )
}
