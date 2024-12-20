'use client';

import { Response } from '@/types/responseTypes';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';

interface ContactProps {
  select?: string;
}

export default function Contact({ select }: ContactProps) {
  const searchParams = useSearchParams();
  const service = searchParams?.get('service') || '';

  const [selectedService, setSelectedService] = useState<string>(service);
  const [fullname, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dataCompleted, setDataCompleted] = useState<boolean>(false);

  const services = [
    'Web Development',
    'Graphic Design',
    'Digital Marketing',
    'Video Editing',
  ];

  const handleServiceClick = (service: string) => {
    setSelectedService(service);
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = 'auto'; // Reset height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post<Response>('/api/clients/create', {
        fullname,
        email,
        budget,
        requiredService: selectedService,
        timeframe,
        clientMsg: message,
      });

      if (response.status === 200) {
        setLoading(false);
        setDataCompleted(true);
        alert(response.data.message);
      }
    } catch (error) {
      setLoading(false);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-8 bg-white p-1 overflow-hidden">
        {/* Left Side Image */}
        <div
          className="hidden lg:block lg:w-1/3 bg-cover bg-center rounded-lg"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          }}
        ></div>

        {/* Form */}
        <div className="w-full lg:w-2/3 p-1 md:p-1">
          <form className="space-y-6">
            {/* Full Name and Email */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-6">
              <div className="lg:w-1/2">
                <label
                  htmlFor="name"
                  className="block text-lg font-medium text-black"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="off"
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black text-lg focus:border-[#557A84] focus:outline-none"
                />
              </div>
              <div className="lg:w-1/2">
                <label
                  htmlFor="email"
                  className="block text-lg font-medium text-black"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black text-lg focus:border-[#557A84] focus:outline-none"
                />
              </div>
            </div>

            {/* Required Service */}
            <div>
              <label
                htmlFor="service"
                className="block text-lg font-medium text-black mb-2"
              >
                Choose Required Service
              </label>
              <div className="flex flex-wrap gap-4">
                {services.map((service) => (
                  <button
                    type="button"
                    key={service}
                    onClick={() => handleServiceClick(service)}
                    className={`px-4 py-2 rounded-md border-2 ${
                      selectedService === service
                        ? 'bg-[#557A84] text-white'
                        : 'text-black'
                    } hover:bg-[#557A84] hover:text-white`}
                  >
                    {service}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget and Timeframe */}
            <div className="space-y-4 lg:space-y-0 lg:flex lg:gap-6">
              <div className="lg:w-1/2">
                <label
                  htmlFor="budget"
                  className="block text-lg font-medium text-black"
                >
                  Budget
                </label>
                <input
                  type="text"
                  id="budget"
                  onChange={(e) => setBudget(e.target.value)}
                  name="budget"
                  autoComplete="off"
                  required
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black text-lg focus:border-[#557A84] focus:outline-none"
                />
              </div>
              <div className="lg:w-1/2">
                <label
                  htmlFor="timeframe"
                  className="block text-lg font-medium text-black"
                >
                  Timeframe
                </label>
                <input
                  type="text"
                  id="timeframe"
                  name="timeframe"
                  onChange={(e) => setTimeframe(e.target.value)}
                  required
                  autoComplete="off"
                  className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black text-lg focus:border-[#557A84] focus:outline-none"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-lg font-medium text-black"
              >
                Message
              </label>
              <textarea
                id="message"
                onChange={(e) => {
                  setMessage(e.target.value);
                  autoResizeTextarea(e);
                }}
                name="message"
                rows={1}
                required
                autoComplete="off"
                className="mt-1 block w-full border-0 border-b-2 border-gray-300 text-black text-lg focus:border-[#557A84] focus:outline-none resize-none overflow-hidden"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-[#557A84] text-white py-3 px-4 rounded-md shadow-md"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
