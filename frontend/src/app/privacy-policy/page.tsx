import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-6 md:p-12 lg:p-24 overflow-y-auto terminal-scroll">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-weight-heading text-accent-green mb-4">
            Privacy Policy
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">1. Introduction</h2>
          <p className="text-text-muted leading-relaxed">
            Welcome to AutonomiX. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our autonomous AI agent platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">2. Information We Collect</h2>
          <p className="text-text-muted leading-relaxed">
            We collect information that you provide directly to us when using the platform, including:
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
            <li>Account information (name, email address, profile picture)</li>
            <li>Authentication credentials and API keys for third-party integrations</li>
            <li>Usage data, including agent configurations, task definitions, and run history</li>
            <li>Technical data (IP address, browser type, device information)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">3. How We Use Your Information</h2>
          <p className="text-text-muted leading-relaxed">
            We use the collected information for various purposes, such as:
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
            <li>Providing and maintaining the AutonomiX platform</li>
            <li>Executing autonomous tasks on your behalf through connected integrations</li>
            <li>Improving our AI models and service performance</li>
            <li>Communicating with you about updates, security alerts, and support messages</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">4. Data Security</h2>
          <p className="text-text-muted leading-relaxed">
            We implement industry-standard security measures to protect your personal data. All sensitive information, including API keys and authentication tokens, is securely encrypted. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">5. Third-Party Integrations</h2>
          <p className="text-text-muted leading-relaxed">
            AutonomiX allows you to connect third-party services (e.g., Google Workspace, Notion). Our use of information received from these APIs adheres to their respective API Terms of Service. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">6. Your Rights</h2>
          <p className="text-text-muted leading-relaxed">
            You have the right to access, correct, or delete your personal data. You can manage your information directly through your account settings or contact our support team for assistance.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">7. Contact Us</h2>
          <p className="text-text-muted leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at privacy@autonomix.ai.
          </p>
        </section>
        
        <div className="pt-8 mt-8 border-t border-border-soft">
          <a href="/" className="text-accent-blue hover:text-accent-cyan transition-colors">
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
