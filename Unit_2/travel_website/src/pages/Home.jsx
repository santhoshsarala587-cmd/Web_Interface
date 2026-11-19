import HomeHero from '../sections/HomeHero';
import HomeAbout from '../sections/HomeAbout';
import HomePassions from '../sections/HomePassions';
import HomeVisited from '../sections/HomeVisited';
import HomeDreams from '../sections/HomeDreams';
import HomeCulture from '../sections/HomeCulture';
import HomeKabaddi from '../sections/HomeKabaddi';
import HomeClosing from '../sections/HomeClosing';

// The eight sections of the home page, in order.
export default function Home() {
  return (
    <>
      <HomeHero />
      <HomeAbout />
      <HomePassions />
      <HomeVisited />
      <HomeDreams />
      <HomeCulture />
      <HomeKabaddi />
      <HomeClosing />
    </>
  );
}
