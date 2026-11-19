import Button from '../components/Button';
import './NotFound.css';

export default function NotFound() {
  return (
    <section className="notfound surface-forest">
      <div className="container">
        <p className="eyebrow">Off the map</p>
        <h1>This page doesn’t exist.</h1>
        <p>The path you followed does not lead anywhere, but there is plenty to explore.</p>
        <div className="notfound__actions">
          <Button to="/">Back home</Button>
          <Button to="/dream-destinations" variant="ghost">Dream destinations</Button>
        </div>
      </div>
    </section>
  );
}
