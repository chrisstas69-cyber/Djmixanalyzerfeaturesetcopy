import React, { useState } from 'react';
import { Check, X, ChevronDown } from 'lucide-react';
import { Button } from './ui/Button';

interface PricingPageProps {
  onBack: () => void;
  onSelectPlan: (plan: string) => void;
}

export function PricingPage({ onBack, onSelectPlan }: PricingPageProps) {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "Can I upgrade or downgrade my plan at any time?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at the start of your next billing cycle. You'll receive a prorated credit for any unused time."
    },
    {
      question: "What happens when I reach my monthly track limit?",
      answer: "When you reach your limit, you won't be able to generate new tracks until the next billing cycle. You can upgrade your plan at any time to get more tracks immediately."
    },
    {
      question: "Do the generated tracks include royalty-free licensing?",
      answer: "Free and Starter plans include personal use licenses. Pro plan includes broadcast and streaming licenses. Studio plan includes full commercial licensing with no attribution required."
    },
    {
      question: "What is DNA training?",
      answer: "DNA training analyzes your uploaded tracks to learn your sonic preferences, production style, and genre characteristics. The AI then generates tracks tailored to your unique sound."
    },
    {
      question: "Can I export individual stems?",
      answer: "Yes, all paid plans include stem export. You'll receive separate WAV files for drums, bass, harmony, and FX layers that you can use in your DAW."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, all paid plans include a 7-day free trial. You can cancel anytime during the trial period and you won't be charged."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-6 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-5xl mb-3">Choose Your Plan</h1>
          <p className="text-xl text-gray-400">Start free, upgrade as you grow</p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {/* FREE */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col">
            <h3 className="text-2xl mb-2">Free</h3>
            <div className="text-4xl mb-2">$0<span className="text-lg text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-400 mb-6">Perfect for trying out</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>5 tracks per month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Basic presets</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Watermarked audio</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>No stem export</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>No DNA training</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPlan('free')}
              className="w-full py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Free
            </button>
          </div>

          {/* STARTER */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col">
            <h3 className="text-2xl mb-2">Starter</h3>
            <div className="text-4xl mb-2">$9<span className="text-lg text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-400 mb-6">For hobbyists</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>50 tracks per month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>All presets</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Stem export</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Basic DNA (10 tracks)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Cover art generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-500">
                <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>No cue points</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPlan('starter')}
              className="w-full py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Start Trial
            </button>
          </div>

          {/* PRO */}
          <div className="bg-[#1a1a1a] rounded-xl border-2 border-[#ff6b35] p-6 flex flex-col relative transform scale-105">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#ff6b35] text-sm rounded-full">
              Most Popular
            </div>
            <h3 className="text-2xl mb-2">Pro</h3>
            <div className="text-4xl mb-2">$19<span className="text-lg text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-400 mb-6">For serious producers</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>200 tracks per month</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>All presets</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Stem export</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Full DNA (100 tracks)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Cover art generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Cue point detection</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Priority generation</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPlan('pro')}
              className="w-full py-3 bg-[#ff6b35] rounded-lg hover:bg-[#ff7f4d] transition-colors"
            >
              Start Trial
            </button>
          </div>

          {/* STUDIO */}
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 flex flex-col">
            <h3 className="text-2xl mb-2">Studio</h3>
            <div className="text-4xl mb-2">$49<span className="text-lg text-gray-400">/mo</span></div>
            <p className="text-sm text-gray-400 mb-6">For professionals</p>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Unlimited tracks</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>All presets</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Stem export</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Full DNA (500 tracks)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Cover art generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Cue point detection</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Instant generation</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>API access</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                <span>Commercial license</span>
              </li>
            </ul>
            
            <button
              onClick={() => onSelectPlan('studio')}
              className="w-full py-3 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-8 text-center">Feature Comparison</h2>
        <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#0a0a0a]">
              <tr>
                <th className="text-left p-4 text-gray-400 text-sm font-normal">Feature</th>
                <th className="text-center p-4 text-sm">Free</th>
                <th className="text-center p-4 text-sm">Starter</th>
                <th className="text-center p-4 text-sm bg-[#ff6b35]/10">Pro</th>
                <th className="text-center p-4 text-sm">Studio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="p-4 text-sm text-gray-300">Monthly tracks</td>
                <td className="p-4 text-center text-sm">5</td>
                <td className="p-4 text-center text-sm">50</td>
                <td className="p-4 text-center text-sm bg-[#ff6b35]/5">200</td>
                <td className="p-4 text-center text-sm">Unlimited</td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">DNA training capacity</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center text-sm">10 tracks</td>
                <td className="p-4 text-center text-sm bg-[#ff6b35]/5">100 tracks</td>
                <td className="p-4 text-center text-sm">500 tracks</td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">Stem export</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
                <td className="p-4 text-center bg-[#ff6b35]/5">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">Cover art generation</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
                <td className="p-4 text-center bg-[#ff6b35]/5">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">Cue point detection</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center bg-[#ff6b35]/5">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">Priority generation</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center bg-[#ff6b35]/5">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
                <td className="p-4 text-center text-sm">Instant</td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">API access</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center bg-[#ff6b35]/5">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">Commercial license</td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center bg-[#ff6b35]/5">
                  <X className="w-4 h-4 mx-auto text-gray-600" />
                </td>
                <td className="p-4 text-center">
                  <Check className="w-4 h-4 mx-auto text-[#ff6b35]" />
                </td>
              </tr>
              <tr>
                <td className="p-4 text-sm text-gray-300">Audio quality</td>
                <td className="p-4 text-center text-sm">MP3 (watermarked)</td>
                <td className="p-4 text-center text-sm">WAV 44.1kHz</td>
                <td className="p-4 text-center text-sm bg-[#ff6b35]/5">WAV 48kHz</td>
                <td className="p-4 text-center text-sm">WAV 96kHz</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full p-6 text-left flex items-start justify-between hover:bg-[#1a1a1a]/80 transition-colors"
              >
                <span className="text-lg pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedFAQ === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl mb-4">Still have questions?</h2>
        <p className="text-gray-400 mb-8">Our team is here to help you find the perfect plan</p>
        <button className="px-8 py-3 border border-[#ff6b35] text-[#ff6b35] rounded-lg hover:bg-[#ff6b35]/10 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}
