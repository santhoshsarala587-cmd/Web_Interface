import Img from '../components/Img';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import { photo } from '../data/photos';
import './HomeIntro.css';

export default function HomeIntro() {
  return (
    <section id="intro" className="intro section surface-ivory" aria-labelledby="intro-title">
      <div className="intro__grid container">
        <Reveal className="intro__art">
          <figure className="intro__img intro__img--main wipe">
            <Img src={photo('fuji')} alt="Snow-capped Mount Fuji rising above a pagoda and town" position="50% 30%" />
          </figure>
          <figure className="intro__img intro__img--small wipe wipe--delay">
            <Img src={photo('kyoto')} alt="A quiet lane in Kyoto at dusk" position="62% 50%" />
          </figure>
          <span className="intro__block" aria-hidden="true" />
        </Reveal>

        <div className="intro__text">
          <SectionHeading
            id="intro-title"
            eyebrow="A little about me"
            title="Curious about the world. Passionate about life."
          />
          <Reveal className="intro__copy" delay={120}>
            <p>
              Three things keep me moving: new places, different cultures, and Kabaddi. I love the
              excitement of arriving somewhere I have never been, and I am endlessly curious about
              how people live, eat, build, and celebrate.
            </p>
            <p>
              On the Kabaddi court I enjoy the mix of teamwork, strategy, and determination. I have
              already travelled to Munnar in Kerala and to Tada, and there are many more places on
              my list.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
