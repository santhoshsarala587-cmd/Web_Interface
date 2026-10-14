import HomeHero from '../sections/HomeHero';
import HomeIntro from '../sections/HomeIntro';
import HomePassions from '../sections/HomePassions';
import HomeVisited from '../sections/HomeVisited';
import HomeDreams from '../sections/HomeDreams';
import HomeKabaddi from '../sections/HomeKabaddi';
import HomeClosing from '../sections/HomeClosing';
import Marquee from '../components/Marquee';

export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeIntro />
      <HomePassions />
      <Marquee words={['Explore', 'Discover', 'Learn', 'Wander', 'Play', 'Grow']} />
      <HomeVisited />
      <HomeDreams />
      <HomeKabaddi />
      <HomeClosing />
    </>
  );
}
