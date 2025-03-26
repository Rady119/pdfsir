'use client';

import { FormEvent, useState } from 'react';
import { EnvelopeIcon, UserIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus({
        type: 'success',
        message: 'Message sent successfully! We will get back to you soon.',
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container px-4 mx-auto min-h-screen">
      <div className="max-w-xl mx-auto pt-20">
        <div className="mt-[1cm] backdrop-blur-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-6">Contact Us</h2>
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  status.type === 'success'
                    ? 'bg-green-100/80 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}
              >
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2" htmlFor="name">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 transition duration-300"
                    placeholder="Enter your name"
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2" htmlFor="email">
                  Your Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 transition duration-300"
                    placeholder="Enter your email"
                    name="email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2" htmlFor="message">
                  Your Message
                </label>
                <textarea
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:focus:ring-yellow-600 transition duration-300"
                  rows={4}
                  placeholder="Enter your message"
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                ></textarea>
              </div>
              <button
                className={`w-full py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center space-x-2 ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed dark:bg-gray-600'
                    : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 dark:bg-yellow-500 dark:hover:bg-yellow-600'
                }`}
                type="submit"
                disabled={isSubmitting}
              >
                <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                {!isSubmitting && <PaperAirplaneIcon className="h-5 w-5 inline-block" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}