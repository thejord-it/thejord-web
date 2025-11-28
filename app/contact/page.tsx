'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'question'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Construct email mailto link
    const subject = encodeURIComponent(`[THEJORD.IT] ${formData.type.toUpperCase()}: ${formData.subject}`)
    const body = encodeURIComponent(
      `Nome: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Tipo: ${formData.type}\n\n` +
      `Messaggio:\n${formData.message}\n\n` +
      `---\n` +
      `Inviato da thejord.it/contact`
    )

    window.location.href = `mailto:admin@thejord.it?subject=${subject}&body=${body}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-bg-darkest">
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-6 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Contact Us
            </span>
          </h1>
          <p className="text-base md:text-xl text-text-secondary max-w-2xl mx-auto">
            Questions, feedback, or bug reports? We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 md:mb-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-bg-dark border border-border rounded-xl p-4 md:p-6">
              <h2 className="text-2xl font-bold mb-4 md:mb-6 text-text-primary">Contact Methods</h2>

              <div className="space-y-4">
                <a
                  href="mailto:admin@thejord.it"
                  className="flex items-start gap-4 p-4 bg-bg-darkest border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <span className="text-2xl">📧</span>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">Email</h3>
                    <p className="text-text-secondary text-sm mb-2">Per domande generali e supporto</p>
                    <p className="text-primary">admin@thejord.it</p>
                  </div>
                </a>

                <a
                  href="https://github.com/thejord-it/thejord-tools/issues/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-bg-darkest border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <span className="text-2xl">🐛</span>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">GitHub Issues</h3>
                    <p className="text-text-secondary text-sm mb-2">Segnala bug o richiedi nuove funzionalità</p>
                    <p className="text-primary">github.com/thejord-it/thejord-tools</p>
                  </div>
                </a>

                <a
                  href="https://github.com/thejord-it/thejord-tools/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 bg-bg-darkest border border-border rounded-lg hover:border-primary transition-colors"
                >
                  <span className="text-2xl">💭</span>
                  <div>
                    <h3 className="font-bold text-text-primary mb-1">GitHub Discussions</h3>
                    <p className="text-text-secondary text-sm mb-2">Partecipa alle discussioni della community</p>
                    <p className="text-primary">Join the conversation</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Security Contact */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 md:p-6">
              <h3 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                <span>🔒</span>
                Security Issues
              </h3>
              <p className="text-text-secondary text-sm mb-3">
                Se hai scoperto una vulnerabilità di sicurezza, NON aprire una issue pubblica.
              </p>
              <p className="text-text-secondary text-sm">
                Invia una email a <a href="mailto:security@thejord.it" className="text-red-400 hover:underline">security@thejord.it</a> con i dettagli.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-dark border border-border rounded-xl p-4 md:p-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-6 text-text-primary">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-2">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="question">Question</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-text-secondary mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full bg-bg-darkest border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-light text-bg-darkest font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Send Message
              </button>

              <p className="text-xs text-text-muted text-center">
                Clicking "Send Message" will open your default email client
              </p>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-bg-dark border border-border rounded-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold mb-4 md:mb-6 text-text-primary">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-text-primary mb-2">How can I contribute to the project?</h3>
              <p className="text-text-secondary">
                Visit our GitHub repository, fork it, make your changes, and submit a pull request. We welcome all contributions!
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">How do I report a security vulnerability?</h3>
              <p className="text-text-secondary">
                Please DO NOT open a public issue. Instead, email us at security@thejord.it with details about the vulnerability.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">Can I self-host THEJORD?</h3>
              <p className="text-text-secondary">
                Yes! The project is open source and can be self-hosted. Check our GitHub repository for deployment instructions.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">Is THEJORD really free?</h3>
              <p className="text-text-secondary">
                Yes, 100% free forever. No subscriptions, no hidden costs, no limits.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-text-primary mb-2">Can I request a new tool?</h3>
              <p className="text-text-secondary">
                Absolutely! Open an issue on GitHub with the "feature request" label and describe the tool you'd like to see.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
