import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - THEJORD',
  description: 'Privacy policy and data protection information for THEJORD web platform',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg-darkest py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-primary hover:text-primary-light transition-colors text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        <article className="bg-bg-dark border border-border rounded-xl p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Privacy Policy</h1>
          <p className="text-text-muted text-sm mb-8">Last updated: November 20, 2025</p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Introduction</h2>
              <p className="text-text-secondary mb-4">
                At THEJORD, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, and protect your personal information when you visit our website. We are committed
                to GDPR compliance and transparency in all our data practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Our Privacy-First Approach</h2>
              <p className="text-text-secondary mb-4">
                THEJORD is built with privacy as a core principle:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>All developer tools process data 100% client-side in your browser</li>
                <li>Tool data never leaves your device or reaches our servers</li>
                <li>No user accounts or personal data storage required</li>
                <li>Minimal analytics with IP anonymization enabled</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Information We Collect</h2>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">Analytics Data (Google Analytics 4)</h3>
              <p className="text-text-secondary mb-4">
                We use Google Analytics 4 to understand how visitors use our site. The following
                information is collected with IP anonymization enabled:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>Pages you visit and time spent on each page</li>
                <li>Browser type and version</li>
                <li>Device type and screen resolution</li>
                <li>Anonymized IP address (last octet removed)</li>
                <li>Referrer URL (where you came from)</li>
                <li>General geographic location (country/region level only)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">Tool Usage Data</h3>
              <p className="text-text-secondary mb-4">
                Our developer tools (JSON formatter, Base64 encoder, regex tester, etc.) process
                all data entirely in your browser. We do not collect, store, or transmit any data
                you input into these tools.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Cookies We Use</h2>
              <p className="text-text-secondary mb-4">
                We use minimal cookies for essential functionality:
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">Analytics Cookies (Google Analytics)</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><code className="bg-bg-darkest px-2 py-1 rounded text-primary-light">_ga</code> - Distinguishes users (expires: 2 years)</li>
                <li><code className="bg-bg-darkest px-2 py-1 rounded text-primary-light">_ga_*</code> - Maintains session state (expires: 2 years)</li>
              </ul>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">Preference Cookies</h3>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><code className="bg-bg-darkest px-2 py-1 rounded text-primary-light">cookie_consent</code> - Stores your cookie preferences (expires: 1 year)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">How We Use Your Information</h2>
              <p className="text-text-secondary mb-4">
                The limited data we collect is used exclusively for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>Understanding which pages and tools are most popular</li>
                <li>Improving user experience based on usage patterns</li>
                <li>Identifying and fixing technical issues</li>
                <li>Analyzing traffic sources to guide content creation</li>
              </ul>
              <p className="text-text-secondary mb-4">
                We never sell, rent, or share your data with third parties for marketing purposes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Your Rights Under GDPR</h2>
              <p className="text-text-secondary mb-4">
                If you are in the European Union, you have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><strong>Right to Access:</strong> Request a copy of data we hold about you</li>
                <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
                <li><strong>Right to Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
                <li><strong>Right to Restrict Processing:</strong> Request limitation on how we use your data</li>
                <li><strong>Right to Data Portability:</strong> Request data transfer in a machine-readable format</li>
                <li><strong>Right to Object:</strong> Object to data processing for specific purposes</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for analytics at any time</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">How to Opt Out of Analytics</h2>
              <p className="text-text-secondary mb-4">
                You can opt out of Google Analytics tracking in several ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>Use the cookie consent banner to disable analytics cookies</li>
                <li>Install the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline">Google Analytics Opt-out Browser Add-on</a></li>
                <li>Enable "Do Not Track" in your browser settings</li>
                <li>Use browser extensions that block analytics scripts</li>
                <li>Browse in private/incognito mode</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Data Security</h2>
              <p className="text-text-secondary mb-4">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>HTTPS encryption for all connections</li>
                <li>HTTP Strict Transport Security (HSTS) enabled</li>
                <li>Content Security Policy (CSP) headers</li>
                <li>Regular security audits and updates</li>
                <li>IP anonymization in Google Analytics</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Third-Party Services</h2>
              <p className="text-text-secondary mb-4">
                We use the following third-party services:
              </p>

              <h3 className="text-xl font-semibold text-text-primary mb-3 mt-6">Google Analytics 4</h3>
              <p className="text-text-secondary mb-4">
                For website analytics with IP anonymization enabled. View Google's privacy policy at{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-light underline">
                  https://policies.google.com/privacy
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Children's Privacy</h2>
              <p className="text-text-secondary mb-4">
                Our services are not directed at children under 16. We do not knowingly collect
                personal information from children. If you believe a child has provided us with
                personal information, please contact us to have it removed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">International Data Transfers</h2>
              <p className="text-text-secondary mb-4">
                Analytics data may be processed by Google in countries outside the EU/EEA.
                Google is certified under the EU-US Data Privacy Framework and provides
                appropriate safeguards for data protection.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Changes to This Policy</h2>
              <p className="text-text-secondary mb-4">
                We may update this Privacy Policy from time to time. Changes will be posted on
                this page with an updated "Last updated" date. Significant changes will be
                prominently announced on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Contact Us</h2>
              <p className="text-text-secondary mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li>Visit our <Link href="/contact" className="text-primary hover:text-primary-light underline">Contact page</Link></li>
                <li>Refer to our <Link href="/changelog" className="text-primary hover:text-primary-light underline">Changelog</Link> for privacy-related updates</li>
              </ul>
            </section>

            <section className="mb-4">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Legal Basis for Processing</h2>
              <p className="text-text-secondary mb-4">
                Under GDPR, our legal basis for processing your data is:
              </p>
              <ul className="list-disc list-inside space-y-2 text-text-secondary mb-4">
                <li><strong>Legitimate Interest:</strong> For analytics to improve our service</li>
                <li><strong>Consent:</strong> For optional analytics cookies (via cookie consent banner)</li>
              </ul>
              <p className="text-text-secondary mb-4">
                You can withdraw consent at any time through the cookie consent banner or by
                contacting us.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="px-6 py-3 bg-primary hover:bg-primary-light text-bg-darkest font-semibold rounded-lg transition-colors text-center"
              >
                Back to Home
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 border-2 border-border hover:border-primary text-text-primary font-semibold rounded-lg transition-colors text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
