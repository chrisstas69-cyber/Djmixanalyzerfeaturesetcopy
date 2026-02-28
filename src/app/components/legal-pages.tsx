import { useState } from "react";
import { FileText, Shield, Cookie, Mail, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";

type LegalPage = "terms" | "privacy" | "cookies" | "dmca" | "contact";

export function LegalPages({ page }: { page: LegalPage }) {
  const [showCookieBanner, setShowCookieBanner] = useState(() => {
    return !localStorage.getItem("cookieConsent");
  });

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem("cookieConsent", accepted ? "accepted" : "rejected");
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setShowCookieBanner(false);
  };

  const renderContent = () => {
    switch (page) {
      case "terms":
        return <TermsOfService />;
      case "privacy":
        return <PrivacyPolicy />;
      case "cookies":
        return <CookiePolicy />;
      case "dmca":
        return <DMCAPolicy />;
      case "contact":
        return <ContactPage />;
      default:
        return <TermsOfService />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0f] overflow-auto">
      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#18181b] border-t border-white/10 p-4 z-50">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm text-white/90 mb-1">
                We use cookies to enhance your experience and analyze site usage.
              </p>
              <p className="text-xs text-white/60">
                By continuing, you agree to our{" "}
                <a href="#cookies" className="text-primary hover:underline">
                  Cookie Policy
                </a>
                {" "}and{" "}
                <a href="#privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCookieConsent(false)}
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                Reject
              </Button>
              <Button
                size="sm"
                onClick={() => handleCookieConsent(true)}
                className="bg-primary hover:bg-primary/80 text-white"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Legal Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto prose prose-invert">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function TermsOfService() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-white">Terms of Service</h1>
      </div>

      <div className="space-y-4 text-white/80">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Syntax Audio Intelligence ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Use License</h2>
          <p>
            Permission is granted to temporarily use the Service for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to reverse engineer any software</li>
            <li>Remove any copyright or proprietary notations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. User Content</h2>
          <p>
            You retain ownership of any content you create, upload, or share through the Service. By using the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and display your content solely for the purpose of providing the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Prohibited Uses</h2>
          <p>You may not use the Service:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>In any way that violates any applicable law or regulation</li>
            <li>To transmit any malicious code or viruses</li>
            <li>To infringe upon intellectual property rights</li>
            <li>To harass, abuse, or harm other users</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for any breach of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Disclaimer</h2>
          <p>
            The Service is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
          <p>
            In no event shall Syntax Audio Intelligence be liable for any damages arising out of the use or inability to use the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the Service after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicy() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-white">Privacy Policy</h1>
      </div>

      <div className="space-y-4 text-white/80">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Account information (email, username, password)</li>
            <li>Profile information (bio, profile picture)</li>
            <li>Content you create (tracks, mixes, comments)</li>
            <li>Usage data (how you interact with the Service)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide, maintain, and improve the Service</li>
            <li>Process transactions and send notifications</li>
            <li>Personalize your experience</li>
            <li>Analyze usage patterns and trends</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information only:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and safety</li>
            <li>With service providers who assist us</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. GDPR Rights</h2>
          <p>If you are in the EU, you have the right to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access your personal data</li>
            <li>Rectify inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
            <li>Withdraw consent</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@syntaxaudio.com" className="text-primary hover:underline">
              privacy@syntaxaudio.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">6. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">7. Children's Privacy</h2>
          <p>
            The Service is not intended for users under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-sm text-white/60">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

function CookiePolicy() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Cookie className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-white">Cookie Policy</h1>
      </div>

      <div className="space-y-4 text-white/80">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit our website. They help us provide, protect, and improve the Service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Types of Cookies We Use</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-white">Essential Cookies</h3>
              <p className="text-sm">Required for the Service to function. Cannot be disabled.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Analytics Cookies</h3>
              <p className="text-sm">Help us understand how visitors use the Service.</p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Preference Cookies</h3>
              <p className="text-sm">Remember your settings and preferences.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of the Service.
          </p>
        </section>
      </div>
    </div>
  );
}

function DMCAPolicy() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-white">DMCA / Copyright Policy</h1>
      </div>

      <div className="space-y-4 text-white/80">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Copyright Infringement</h2>
          <p>
            Syntax Audio Intelligence respects the intellectual property rights of others. If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide the following information:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>A description of the copyrighted work</li>
            <li>The location of the infringing material</li>
            <li>Your contact information</li>
            <li>A statement of good faith belief</li>
            <li>A statement of accuracy under penalty of perjury</li>
            <li>Your signature (electronic or physical)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
          <p>
            Send DMCA notices to:{" "}
            <a href="mailto:dmca@syntaxaudio.com" className="text-primary hover:underline">
              dmca@syntaxaudio.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to backend API
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-semibold text-white">Contact Us</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-white mb-2">Get in Touch</h2>
            <p className="text-white/70 text-sm">
              Have a question or feedback? We'd love to hear from you.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/60 font-['IBM_Plex_Mono']">Email</p>
              <a
                href="mailto:support@syntaxaudio.com"
                className="text-primary hover:underline"
              >
                support@syntaxaudio.com
              </a>
            </div>
            <div>
              <p className="text-sm text-white/60 font-['IBM_Plex_Mono']">Support</p>
              <a
                href="mailto:help@syntaxaudio.com"
                className="text-primary hover:underline"
              >
                help@syntaxaudio.com
              </a>
            </div>
            <div>
              <p className="text-sm text-white/60 font-['IBM_Plex_Mono']">Business</p>
              <a
                href="mailto:business@syntaxaudio.com"
                className="text-primary hover:underline"
              >
                business@syntaxaudio.com
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <div>
            <label className="text-xs text-white/60 mb-1.5 block font-['IBM_Plex_Mono']">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 text-white"
            disabled={submitted}
          >
            {submitted ? "Message Sent!" : "Send Message"}
          </Button>
        </form>
      </div>
    </div>
  );
}

