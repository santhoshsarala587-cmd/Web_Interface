import { useState } from 'react';
import Img from './Img';
import PlaceArt from './PlaceArt';

// Shows the photograph if one exists. If there is none (or a linked photo fails to load),
// shows a clearly labelled illustration instead.
export default function PlacePhoto({ place, eager = false }) {
  const [failed, setFailed] = useState(false);

  if (place.image && !failed) {
    return (
      <>
        <Img src={place.image} alt={place.alt} position={place.position} eager={eager} onFail={() => setFailed(true)} />
        {place.stock && <span className="art-badge">Stock photo</span>}
      </>
    );
  }
  return (
    <>
      <PlaceArt theme={place.art} label={place.alt} />
      <span className="art-badge">Illustration</span>
    </>
  );
}
