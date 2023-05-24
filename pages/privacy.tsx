// components/PrivacyPolicy.js

import React from 'react';
import Layout from "./_layout"

const PrivacyPolicy = () => {
  return (
    <Layout>
    <div>
      <h2>Privacy Policy</h2>
      <p>
        At qaly.shop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website.
      </p>

      <h3>Information We Collect</h3>
      <p>
        We collect logs of your interactions with the service, including changes made to charity descriptions and added charities. These logs help us analyze and improve our services.
      </p>
      <p>
        Additionally, we collect your email address for communication purposes, such as notifying you about important service changes and sending you relevant notifications.
      </p>

      <h3>Security</h3>
      <p>
        We prioritize the security of your information and employ various measures to safeguard it. However, please note that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
      </p>

      <h3>Changes to Our Privacy Policy</h3>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the updated policy on this page. Please review this Privacy Policy periodically for any changes.
      </p>

      <h3>Contact Us</h3>
      <p>
        If you have any questions or concerns regarding our Privacy Policy, please contact us at {process.env.CONTACT_EMAIL}.
      </p>
    </div>
    </Layout>
  );
};

export default PrivacyPolicy;
