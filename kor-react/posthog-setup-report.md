<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog event tracking into the KOR cycling React app. Sixteen events were identified across six key files covering every major user action: shop/personal/family account signups, shop login, demo requests, contact form submissions, push notification sends, bike part replacements, and mileage additions. Each signup flow also calls `posthog.identify()` immediately after account creation, linking the Auth0 user ID to all future events. `posthog.captureException()` was added to all error catch blocks across these flows.

| Event | Description | File |
|---|---|---|
| `demo_request_submitted` | Shop owner submits the demo request form on the Sign Up page | `src/components/pages/SignUp.tsx` |
| `shop_signup_submitted` | Shop owner submits the create-account form to register a new shop | `src/components/shop/ShopSignIn.tsx` |
| `shop_signup_completed` | Shop account creation succeeded and Auth0 redirect was initiated | `src/components/shop/ShopSignIn.tsx` |
| `shop_signup_error` | Shop account creation failed with an error | `src/components/shop/ShopSignIn.tsx` |
| `personal_signup_submitted` | Personal user submits the create-account form to register | `src/components/personal/PersonalSignIn.tsx` |
| `personal_signup_completed` | Personal account creation succeeded and onboard redirect was initiated | `src/components/personal/PersonalSignIn.tsx` |
| `personal_signup_error` | Personal account creation failed with an error | `src/components/personal/PersonalSignIn.tsx` |
| `family_signup_submitted` | Family plan user submits the create-account form | `src/components/pages/FamilyPlanSignUp.tsx` |
| `family_signup_completed` | Family account creation succeeded and Auth0 redirect was initiated | `src/components/pages/FamilyPlanSignUp.tsx` |
| `family_signup_error` | Family account creation failed with an error | `src/components/pages/FamilyPlanSignUp.tsx` |
| `shop_login_initiated` | Shop partner clicks the Sign In button to start Auth0 authentication | `src/components/shop/ShopLogin.tsx` |
| `shop_login_completed` | Shop partner successfully authenticated and data stored in session | `src/components/shop/ShopLogin.tsx` |
| `notification_sent` | Shop sends a push notification to all linked customers | `src/components/shop/SendNotificationsPanel.tsx` |
| `part_replaced` | Shop replaces a customer's bike part via the wear bar modal | `src/components/shop/WearBar/PartReplaceModal.tsx` |
| `mileage_added` | Shop manually adds mileage or hours to a customer's bike part | `src/components/shop/WearBar/PartReplaceModal.tsx` |
| `contact_message_submitted` | Visitor submits the contact form on the Contact page | `src/components/pages/Contact.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/228059/dashboard/1805840)
- **Insight**: [Signup Completions Over Time](https://us.posthog.com/project/228059/insights/4qMEoaU5) — Daily line chart of shop, personal, and family signups
- **Insight**: [Shop Signup Conversion Funnel](https://us.posthog.com/project/228059/insights/iCXer6BC) — 3-step funnel from demo request → signup started → signup completed
- **Insight**: [Notifications Sent Over Time](https://us.posthog.com/project/228059/insights/arNhVDAJ) — Bar chart of push notifications shops send to customers
- **Insight**: [Part Replacements & Mileage Added](https://us.posthog.com/project/228059/insights/fjJYMUZz) — Shop maintenance activity over time
- **Insight**: [Signup Errors Over Time](https://us.posthog.com/project/228059/insights/yLpxwX5z) — Account creation failures across all signup flows

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `REACT_APP_POSTHOG_KEY` and `REACT_APP_POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` only fires on fresh signup/login; returning sessions that bypass these flows will remain on anonymous distinct IDs until they log in again via `ShopLogin`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
