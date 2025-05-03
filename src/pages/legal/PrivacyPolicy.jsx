import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../hero/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Privacy Policy | Travel Book</title>
      </Helmet>
      
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 py-12 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Last Updated: May 1, 2025</p>
          
          <div className="space-y-8 text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">1. Introduction</h2>
              <p className="mb-3">
                Welcome to Travel Book. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you how we look after your personal data when you visit our website and 
                tell you about your privacy rights and how the law protects you.
              </p>
              <p>
                This privacy policy applies to all users of Travel Book, including those who register to use our services, 
                contribute content, or simply view our website.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">2. Information We Collect</h2>
              <p className="mb-3">We collect several types of information from and about users of our website, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personal identifiers, such as name and email address when you register for an account</li>
                <li>Profile information that you provide for your user profile</li>
                <li>Content you post, upload, or otherwise contribute to the platform</li>
                <li>Usage data and analytics about how you interact with our service</li>
                <li>Location data, when you share travel stories with location information</li>
                <li>Device and connection information, including IP address, browser type, and operating system</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Create and maintain your account</li>
                <li>Process and fulfill your requests</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Communicate with you about products, services, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                <li>Personalize your experience by providing content tailored to your interests</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">4. Sharing Your Information</h2>
              <p className="mb-3">
                We do not sell your personal information. However, we may share your information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations or enforce our terms of service</li>
                <li>To protect the rights, property, or safety of Travel Book, our users, or others</li>
                <li>With your consent or at your direction</li>
                <li>As part of a merger, acquisition, or other business transfer</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">5. Your Rights and Choices</h2>
              <p className="mb-3">Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Restriction or objection to certain processing activities</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p className="mt-3">
                You can exercise many of these rights through your account settings. For other requests, please contact us using the information provided below.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">6. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against 
                unauthorized access, accidental loss, or destruction. However, no internet transmission is ever completely secure, 
                and we cannot guarantee the security of information transmitted through our platform.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">7. Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13 years of age, and we do not knowingly collect personal 
                information from children under 13. If we learn we have collected personal information from a child under 13, 
                we will delete that information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">8. Changes to This Privacy Policy</h2>
              <p>
                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, 
                legal, or regulatory reasons. We will notify you of any material changes through a notice on our website or by email.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
                <br />
                <a href="mailto:privacy@travelbook.com" className="text-cyan-500 hover:underline">privacy@travelbook.com</a>
              </p>
            </section>
          </div>
          
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Link to="/" className="text-cyan-500 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;