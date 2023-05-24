// components/TermsOfService.js

import React from 'react';
import Layout from "./_layout"

const TermsOfService = () => {
  return (
    <Layout>
    <div>
      <h2>Terms of Service</h2>
      <p>
        Welcome to qaly.shop! These Terms of Service govern your use of our website. Please read these terms carefully before accessing or using our services.
      </p>

      <h3>Acceptance of Terms</h3>
      <p>
        By accessing or using qaly.shop, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please refrain from using our services.
      </p>

      <h3>Intellectual Property</h3>
      <p>
        The content, features, and functionality provided by qaly.shop are owned by or licensed to us and are protected by intellectual property rights. The source code of qaly.shop is licensed under the MIT License. You may obtain a copy of the MIT License at <a href="https://github.com/Hazelfire/qaly.shop">https://github.com/Hazelfire/qaly.shop</a>.
      </p>

      <h3>Intellectual Property</h3>
      <p>
        The content, features, and functionality provided by qaly.shop are owned by or licensed to us and are protected by intellectual property rights. You may not modify, reproduce, distribute, or create derivative works based on our content without our explicit permission.
      </p>

      <h3>Disclaimer</h3>
      <p>
        The information provided on qaly.shop is for general informational purposes only. We do not guarantee the accuracy, completeness, or usefulness of any information on the website. Your use of the website and reliance on any information is solely at your own risk.
      </p>

      <h3>Limitation of Liability</h3>
      <p>
        To the fullest extent permitted by law, qaly.shop and its affiliates, officers, employees, agents, partners, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses arising from your use of our services.
      </p>

      <h3>Changes to Terms of Service</h3>
      <p>
        We reserve the right to modify or replace these Terms of Service at any time. Changes will be effective immediately upon posting the updated terms on this page. Your continued use of qaly.shop after any such changes constitutes acceptance of the modified terms.
      </p>

      <h3>Contact Us</h3>
      <p>
        If you have any questions or concerns regarding our Terms of Service, please contact us at {process.env.CONTACT_EMAIl}.
      </p>
    </div>
    </Layout>
  );
};

export default TermsOfService;
