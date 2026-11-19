import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Link as LinkIcon, Mail } from 'lucide-react';
import Button from '../components/Button';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import profile from '../data/profile';
import { photo } from '../data/photos';
import './Contact.css';

const topics = [
  { title: 'Places', text: 'Mountains, waterfalls, beaches and the trails that lead to them. Swap stories, tips and wishlists.', to: '/journeys', cta: 'My journeys' },
  { title: 'Cultures', text: 'Festivals, food, languages and traditions worth understanding. Tell me what I should learn about next.', to: '/cultures', cta: 'Cultural exploration' },
  { title: 'Kabaddi', text: 'Raids, chains, training and teamwork. Always happy to talk about the game.', to: '/kabaddi', cta: 'My Kabaddi story' },
];

export default function Contact() {
  const { email, socials } = profile.contact;
  const [form, setForm] = useState({ name: '', message: '' });
  const [copied, setCopied] = useState(false);
  const hasChannels = Boolean(email) || socials.length > 0;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Opens the visitor's own email app. Nothing is sent to any server.
  const send = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hello${form.name ? ` from ${form.name}` : ''}`);
    const body = encodeURIComponent(form.message);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  const share = async () => {
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: profile.siteName, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      /* sharing cancelled or unavailable */
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about places, cultures and the game."
        image={photo('bali-temple')}
        position="50% 40%"
        alt="A tiered Balinese temple shrine beside a misty lake"
      >
        If something here sparked an idea, a memory or a question, I would love to hear it.
      </PageHero>

      <section className="contact section surface-ivory" aria-labelledby="contact-title">
        <div className="container">
          <SectionHeading id="contact-title" eyebrow="What I like talking about" title="Three good ways to start." />
          <ul className="contact__topics">
            {topics.map((t, i) => (
              <Reveal as="li" key={t.title} delay={i * 80}>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
                <Link to={t.to}>{t.cta}</Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="contact-reach section surface-sand" aria-labelledby="reach-title">
        <div className="contact-reach__grid container">
          <div>
            <SectionHeading id="reach-title" eyebrow={hasChannels ? 'Say hello' : 'Pass it on'} title={hasChannels ? 'Reach me here.' : 'Know someone who would enjoy this?'}>
              {hasChannels
                ? 'The quickest way to reach me is below. I read everything.'
                : 'Share this site with a friend who loves travel, culture or Kabaddi.'}
            </SectionHeading>

            <Reveal className="contact-reach__actions" delay={120}>
              {email && <Button href={`mailto:${email}`}><Mail size={18} aria-hidden="true" /> {email}</Button>}
              {socials.map((s) => (
                <Button key={s.url} href={s.url} variant="outline" target="_blank" rel="noreferrer">{s.label}</Button>
              ))}
              <Button variant={hasChannels ? 'outline' : 'forest'} onClick={share}>
                {copied ? <Check size={18} aria-hidden="true" /> : <LinkIcon size={18} aria-hidden="true" />}
                {copied ? 'Link copied' : 'Share this site'}
              </Button>
            </Reveal>
            <p className="visually-hidden" role="status">{copied ? 'Link copied to clipboard' : ''}</p>
          </div>

          {email && (
            <Reveal as="form" className="contact-form" onSubmit={send} delay={120}>
              <h3>Write a message</h3>
              <label htmlFor="c-name">Your name</label>
              <input id="c-name" type="text" value={form.name} onChange={update('name')} autoComplete="name" />
              <label htmlFor="c-msg">Your message</label>
              <textarea id="c-msg" rows="5" required value={form.message} onChange={update('message')} />
              <Button type="submit"><Mail size={18} aria-hidden="true" /> Open in my email app</Button>
              <p className="contact-form__note">This opens your own email app with the message ready to send. Nothing is stored on this site.</p>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
