import React from "react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary p-6 md:p-12 lg:p-24 overflow-y-auto terminal-scroll">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-weight-heading text-accent-blue mb-4">
            Terms of Service
          </h1>
          <p className="text-text-muted text-sm md:text-base">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">1. Acceptance of Terms</h2>
          <p className="text-text-muted leading-relaxed">
            By accessing or using AutonomiX ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">2. Description of Service</h2>
          <p className="text-text-muted leading-relaxed">
            AutonomiX provides a platform for building, configuring, and deploying autonomous AI agents. The platform integrates with various third-party APIs to execute tasks based on user-defined configurations and prompts.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">3. User Responsibilities</h2>
          <p className="text-text-muted leading-relaxed">
            As a user of the Platform, you agree to:
          </p>
          <ul className="list-disc list-inside text-text-muted space-y-2 ml-4">
            <li>Provide accurate account information and maintain the security of your credentials</li>
            <li>Use the platform only for lawful purposes</li>
            <li>Not use the autonomous agents to generate malicious, spam, or abusive content</li>
            <li>Respect the terms of service of any third-party APIs you connect to the platform</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">4. AI and Automation Risks</h2>
          <p className="text-text-muted leading-relaxed">
            You acknowledge that AI models and autonomous agents can sometimes produce unpredictable, inaccurate, or unintended results. You are solely responsible for reviewing the actions taken by your agents and mitigating any potential risks associated with automated execution.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">5. Intellectual Property</h2>
          <p className="text-text-muted leading-relaxed">
            The platform, including its original content, features, and functionality, are owned by AutonomiX and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of the specific task prompts and agent configurations you create.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">6. Limitation of Liability</h2>
          <p className="text-text-muted leading-relaxed">
            In no event shall AutonomiX, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform or the actions of your configured autonomous agents.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">7. Changes to Terms</h2>
          <p className="text-text-muted leading-relaxed">
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant changes. Your continued use of the platform after such modifications constitutes your acceptance of the new terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-text-secondary">8. Contact Information</h2>
          <p className="text-text-muted leading-relaxed">
            If you have any questions about these Terms, please contact us at support@autonomix.ai.
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
