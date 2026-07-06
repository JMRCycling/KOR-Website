import React from 'react';
import StructuredData from '../common/StructuredData';

const OurStory: React.FC = () => {
  const baseUrl = process.env.REACT_APP_SITE_URL || 'https://jmrcycling.com';
  return (
    <>
      <StructuredData
        type="website"
        pageTitle="Our Story — KOR"
        pageDescription="Learn how the KOR team started and our mission to keep cyclists rolling with smart maintenance tracking."
        url={`${baseUrl}/our-story`}
      />
      <div className="parallax_parent">
        <div className="parallax_our_story">
          <div style={{ padding: '5%' }}>
            <div className="mobile_textbox">
              <h1>Our Story</h1>
              <p className="paragraph">
                We began with an idea to address the inconvenience of waiting
                weeks for bike parts due to supply chain issues. Jessica Wyman
                initially conceived this idea and later collaborated with Mason
                Tuft and Robert Tuft to develop an app to solve this problem. We
                started working on this project back in June 2020 — and it has
                been a long journey, but we are thrilled to present our app to
                you now.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="parallax_parent">
        <div className="parallax2_our_story">
          <div style={{ padding: '5%' }}>
            <div className="mobile_textbox">
              <h1>Our Audience</h1>
              <p className="paragraph">
                KOR started as a tool for high school mountain bike racers who
                needed to stay on top of their components without a dedicated
                mechanic. Since then we've grown to serve everyone from weekend
                hobbyists to competitive racers — anyone who wants to spend more
                time riding and less time guessing when to wrench.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurStory;
