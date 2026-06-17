import React from 'react';
import { Link } from 'react-router-dom';
import StructuredData from '../common/StructuredData';
import { trackAppDownload } from '../common/GoogleAnalytics';

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
              <h1 id="hero-title" className="title_box">KOR (Keep On Rolling)</h1>
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
                <article className="wear-card wear-card--warn" role="listitem">
                  <div className="wear-card-header">
                    <span className="wear-component-name">Chain</span>
                    <span className="wear-badge wear-badge--warn">Replace Soon</span>
                  </div>
                  <div className="wear-bar-track">
                    <div className="wear-bar-fill wear-bar-fill--warn" style={{ width: '81%' }} />
                  </div>
                  <span className="wear-pct">81%</span>
                </article>
                <article className="wear-card wear-card--good" role="listitem">
                  <div className="wear-card-header">
                    <span className="wear-component-name">Brake Pads</span>
                    <span className="wear-badge wear-badge--good">Good</span>
                  </div>
                  <div className="wear-bar-track">
                    <div className="wear-bar-fill wear-bar-fill--good" style={{ width: '45%' }} />
                  </div>
                  <span className="wear-pct">45%</span>
                </article>
                <article className="wear-card wear-card--good" role="listitem">
                  <div className="wear-card-header">
                    <span className="wear-component-name">Cassette</span>
                    <span className="wear-badge wear-badge--good">Good</span>
                  </div>
                  <div className="wear-bar-track">
                    <div className="wear-bar-fill wear-bar-fill--good" style={{ width: '28%' }} />
                  </div>
                  <span className="wear-pct">28%</span>
                </article>
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
