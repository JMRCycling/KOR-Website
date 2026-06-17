import React from 'react';
import { Link } from 'react-router-dom';
import StructuredData from '../common/StructuredData';
import { trackAppDownload } from '../common/GoogleAnalytics';
import CountUp from '../common/CountUp';
import SplitText from '../common/SplitText';
import GlareHover from '../common/GlareHover';
import DotField from '../common/DotField';

const Home: React.FC = () => {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';
  return (
    <>
      <StructuredData 
        type="product" 
        pageTitle="KOR - Never Miss Bike Maintenance Again | Free Bike Tracking App"
        pageDescription="Track your bike's component wear automatically with KOR. Integrated with Strava, our intelligent maintenance app alerts you before parts fail. Free download for iOS & Android."
        url={`${baseUrl}/`}
      />
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="parallax_parent">
          <div className="parallax_home">
            <div style={{ padding: '5%' }}>
              <div className="center">
                <img
                  className="app_logo"
                  src="/images/KOR_app_Logo.png"
                  alt="App Logo"
                />
              </div>
              <h1 id="hero-title" className="title_box">
                <SplitText text="KOR (Keep On Rolling)" delay={200} stagger={80} duration={700} />
              </h1>
              <div className="cta-section">
                <p className="cta-heading">Get Started Today - Free Download!</p>
                <p className="paragraph">Show up for every ride with a bike that's ready to roll.</p>
                <div className="app-store-buttons">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.robtuft.newKOR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="store-button-link"
                    onClick={() => trackAppDownload('android')}
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
                    onClick={() => trackAppDownload('ios')}
                  >
                    <img
                      className="store_buttons_large"
                      src="/images/Apple_app_store_button.svg"
                      alt="Download on App Store"
                    />
                  </a>
                </div>
                <div className="secondary-cta">
                  <Link className="personal-cta-button" to="/personal-plans">
                    No bike shop? Try personal plans →
                  </Link>
                </div>
                <p className="cta-trust-signal">
                  Free to download &middot; Secure Strava integration
                </p>
              </div>

              <div className="mobile_textbox">
                <h2 className="hero-subtitle">
                  Spend less time worrying about maintenance and more time enjoying the ride.
                </h2>
                <p className="paragraph">
                  KOR tracks your bike component wear from your Strava rides and alerts
                  you before parts fail, so you never miss a ride to a broken bike again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-row" aria-label="KOR by the numbers">
        <DotField />
        <div className="stats-row-inner">
          <div className="stat-item">
            <span className="stat-number">
              <CountUp to={5200} duration={1800} />+
            </span>
            <span className="stat-label">rides synced</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-number">
              <CountUp to={18500} duration={2000} />+
            </span>
            <span className="stat-label">components tracked</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-number">Free</span>
            <span className="stat-label">to download, always</span>
          </div>
        </div>
      </section>

      <section className="features-section wear-demo-section" aria-labelledby="features-title">
        <div className="parallax_parent">
          <div className="parallax2_home">
            <div style={{ padding: '5%' }}>
              <h2 id="features-title" className="wear-demo-heading">Know before it fails.</h2>
              <p className="wear-demo-subheading">
                KOR reads your Strava ride data and calculates real component wear so you
                can see exactly when to service before something breaks on the trail.
              </p>
              <div className="wear-demo-grid" role="list">
                <GlareHover className="wear-card wear-card--warn" style={{ borderRadius: '8px' }}>
                  <article role="listitem">
                    <div className="wear-card-header">
                      <span className="wear-component-name">Chain</span>
                      <span className="wear-badge wear-badge--warn">Replace Soon</span>
                    </div>
                    <div className="wear-bar-track">
                      <div className="wear-bar-fill wear-bar-fill--warn" style={{ width: '81%' }} />
                    </div>
                    <CountUp to={81} suffix="%" className="wear-pct" />
                  </article>
                </GlareHover>
                <GlareHover className="wear-card wear-card--good" style={{ borderRadius: '8px' }}>
                  <article role="listitem">
                    <div className="wear-card-header">
                      <span className="wear-component-name">Brake Pads</span>
                      <span className="wear-badge wear-badge--good">Good</span>
                    </div>
                    <div className="wear-bar-track">
                      <div className="wear-bar-fill wear-bar-fill--good" style={{ width: '45%' }} />
                    </div>
                    <CountUp to={45} suffix="%" className="wear-pct" duration={1600} />
                  </article>
                </GlareHover>
                <GlareHover className="wear-card wear-card--good" style={{ borderRadius: '8px' }}>
                  <article role="listitem">
                    <div className="wear-card-header">
                      <span className="wear-component-name">Cassette</span>
                      <span className="wear-badge wear-badge--good">Good</span>
                    </div>
                    <div className="wear-bar-track">
                      <div className="wear-bar-fill wear-bar-fill--good" style={{ width: '28%' }} />
                    </div>
                    <CountUp to={28} suffix="%" className="wear-pct" duration={1800} />
                  </article>
                </GlareHover>
              </div>
              <p className="wear-demo-footnote">
                All tracking happens automatically — no manual logging, no guesswork.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
