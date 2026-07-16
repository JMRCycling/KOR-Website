import React, { useState } from 'react';
import ScrollAnimations from '../common/ScrollAnimations';
import ScrollImageSequence from '../common/ScrollImageSequence';
import StructuredData from '../common/StructuredData';

const HERO_CAPTION_REVEAL_FRAME = 265;

const OurApp: React.FC = () => {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';
  const [heroFrame, setHeroFrame] = useState(0);
  const isHeroCaptionVisible = heroFrame >= HERO_CAPTION_REVEAL_FRAME;
  return (
    <>
      <StructuredData
        type="website"
        pageTitle="The KOR App — Intelligent Bike Maintenance Tracking"
        pageDescription="See how KOR uses Strava data to track component wear, alert you before parts fail, and keep you riding."
        url={`${baseUrl}/our-app`}
      />
      <ScrollAnimations />

      {/* Sections 1–2 — alpine golden hour parallax */}
      <div className="parallax-group parallax-group--alpine">
        <section className="app-screen-section app-hero-overlay-section">
          <ScrollImageSequence
            framePathTemplate="/images/app-welcome-sequence/frame_{index}.webp"
            frameCount={338}
            scrollLength={1.3}
            fit="cover"
            lookaheadMargin="600px 0px"
            fallbackImageSrc="/images/Welcome.png"
            fallbackAlt="App Home Screen"
            topOffsetSelector="header"
            runwayClassName="app-hero-sequence-runway"
            stickyClassName="app-hero-sequence-sticky"
            canvasWrapperClassName="app-hero-sequence-canvas-wrapper"
            canvasClassName="app-hero-sequence-canvas"
            onFrameChange={setHeroFrame}
          >
            <div
              className={`our_app_textbox app-hero-overlay-text${isHeroCaptionVisible ? ' is-visible' : ''}`}
            >
              <h1>The Keep On Rolling App</h1>
              <p className="paragraph our-app-intro-text">
                KOR prevents surprise failures, keeps your bike ride-ready, and removes the guesswork from maintenance—so you can focus on riding.
              </p>
              <p className="paragraph">
                This application integrates with a third-party application,
                Strava, a social media platform for athletes. Strava tracks the
                miles you accumulate, and our application utilizes this data to
                calculate the percentage of wear on your bicycle.
              </p>
            </div>
          </ScrollImageSequence>
        </section>

        <section className="app-screen-section app-screen-section--reverse app-hero-overlay-section">
          <ScrollImageSequence
            framePathTemplate="/images/dashboard-sequence/frame_{index}.webp"
            frameCount={121}
            scrollLength={1.3}
            fit="contain"
            focalX={1}
            focalY={0.7}
            zoom={1.12}
            lookaheadMargin="600px 0px"
            fallbackImageSrc="/images/Dashboard.png"
            fallbackAlt="App Dashboard"
            runwayClassName="app-dashboard-sequence-runway"
            stickyClassName="app-dashboard-sequence-sticky"
            canvasWrapperClassName="app-hero-sequence-canvas-wrapper"
            canvasClassName="app-hero-sequence-canvas"
          >
            <div className="our_app_textbox app-dashboard-overlay-text">
              <h2 className="app-section-label">Your ride, at a glance</h2>
              <p className="paragraph">
                See which parts need attention next at a glance, so you can fix issues before they ruin a ride.
              </p>
            </div>
          </ScrollImageSequence>
        </section>
      </div>

      {/* Sections 3–4 — Pacific Northwest forest parallax */}
      <div className="parallax-group parallax-group--forest">
        <section className="app-screen-section">
          <div className="app-content-grid">
            <div className="our_app_textbox slide-in">
              <h2 className="app-section-label">Full part history</h2>
              <p className="paragraph">
                View complete part history and update details in seconds, so you always know when each component was last serviced.
              </p>
            </div>
            <div className="our-app-image-col slide-in">
              <img
                className="our_app_example"
                src="/images/PartPopup.png"
                alt="App Part Screen"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="app-screen-section app-screen-section--reverse">
          <div className="app-content-grid">
            <div className="our_app_textbox slide-in">
              <h2 className="app-section-label">Built for your setup</h2>
              <p className="paragraph">
                Track shock setup, customize parts, and set your default bike — keep all your ride data organized in one place.
              </p>
            </div>
            <div className="our-app-image-col slide-in">
              <img
                className="our_app_example"
                src="/images/BikeReg.png"
                alt="Bike Settings Screen"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Sections 5–6 — Utah canyon sunset parallax */}
      <div className="parallax-group parallax-group--canyon">
        <section className="app-screen-section">
          <div className="app-content-grid">
            <div className="our_app_textbox slide-in">
              <h2 className="app-section-label">Track only what you have</h2>
              <p className="paragraph">
                Show or hide parts based on what's actually on your bike, so your dashboard stays clutter-free and relevant.
              </p>
            </div>
            <div className="our-app-image-col slide-in">
              <img
                className="our_app_example"
                src="/images/PartVis.png"
                alt="App Part Visibility"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="app-screen-section app-screen-section--reverse">
          <div className="app-content-grid">
            <div className="our_app_textbox slide-in">
              <h2 className="app-section-label">Tuned to how you ride</h2>
              <p className="paragraph">
                Adjust wear percentages and lifespan estimates to match your riding style, so alerts fit how you actually use your bike.
              </p>
            </div>
            <div className="our-app-image-col slide-in">
              <img
                className="our_app_example"
                src="/images/Tools.png"
                alt="Part Settings Screen"
                loading="lazy"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Call to Action */}
      <section className="cta-banner">
        <div className="cta-banner-content">
          <p className="cta-banner-eyebrow">
            Join riders already using KOR to keep their bikes dialed in all season.
          </p>
          <h2 className="cta-banner-title">
            Never let maintenance keep you from riding again!
          </h2>
          <p className="cta-banner-text">
            Free to download—only upgrade if it's working for you.
          </p>
          <div className="cta-banner-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.robtuft.newKOR"
              target="_blank"
              rel="noopener noreferrer"
              className="store-button-link"
              aria-label="Download KOR for Android on Google Play"
            >
              <img
                className="store_buttons_large"
                src="/images/Google_play_button.svg"
                alt="Download on Google Play Store"
              />
            </a>
            <a
              href="https://apps.apple.com/us/app/kor-keep-on-rolling/id1599601993"
              target="_blank"
              rel="noopener noreferrer"
              className="store-button-link"
              aria-label="Download KOR for iPhone on the App Store"
            >
              <img
                className="store_buttons_large"
                src="/images/Apple_app_store_button.svg"
                alt="Download on App Store"
              />
            </a>
          </div>
          <div className="cta-banner-secondary">
            <a className="personal-cta-button" href="/personal-plans">
              Personal Plans Available →
            </a>
            <span className="cta-divider">•</span>
            <a className="shop-cta-button" href="/sign-up">
              Bike Shop Partnerships →
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurApp;
