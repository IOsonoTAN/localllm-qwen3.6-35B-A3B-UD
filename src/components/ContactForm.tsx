'use client';

import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ToastContext';
import type { ContactPayload } from '@/types/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactPayload>({
    name: '',
    email: '',
    message: '',
  });
  const { showToast, dismissToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressLocked = useRef(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!isSubmitting) return;
    progressLocked.current = false;
    const started = Date.now();
    const timer = setInterval(() => {
      if (progressLocked.current) return;
      const elapsed = Date.now() - started;
      setProgress(Math.min(90, 8 + (elapsed / 2800) * 82));
    }, 50);
    return () => clearInterval(timer);
  }, [isSubmitting]);

  const finishSubmit = async (loadingToastId: number, type: 'success' | 'error', message: string) => {
    progressLocked.current = true;
    setProgress(100);
    dismissToast(loadingToastId);
    await new Promise((resolve) => setTimeout(resolve, 280));
    showToast(type, message);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsSubmitting(false);
    setProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setProgress(8);
    const loadingToastId = showToast('loading', 'Sending your message...');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', email: '', message: '' });
        await finishSubmit(loadingToastId, 'success', 'Your message has been sent successfully!');
      } else {
        const error = await response.json();
        console.error('Error:', error);
        await finishSubmit(loadingToastId, 'error', `Error: ${error.error || 'Failed to send message'}`);
      }
    } catch (error) {
      console.error('Failed to submit form:', error);
      await finishSubmit(loadingToastId, 'error', 'Failed to submit form. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-black"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-black"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Message *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none resize-none text-black"
          placeholder="Write your message here..."
        />
      </div>

      {isSubmitting && (
        <div className="space-y-2" aria-live="polite">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sending... {Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-purple-600 transition-[width] duration-150 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-all duration-200 ${
          isSubmitting
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02]'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
