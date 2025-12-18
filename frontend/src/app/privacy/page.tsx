'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="card p-8 md:p-12">
          <h1 className="text-4xl font-bold gradient-text mb-8">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>
          
          <div className="prose max-w-none">
            <h2>Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, write a blog post, or contact us.</p>
            
            <h3>Personal Information</h3>
            <ul>
              <li>Name and email address</li>
              <li>Username and password</li>
              <li>Profile information</li>
              <li>Content you create (blog posts, comments)</li>
            </ul>
            
            <h3>Automatically Collected Information</h3>
            <ul>
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and preferences</li>
              <li>Cookies and similar technologies</li>
            </ul>
            
            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our services</li>
              <li>Process your transactions</li>
              <li>Send you technical notices and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Improve our services</li>
            </ul>
            
            <h2>Information Sharing</h2>
            <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
            
            <h2>Data Security</h2>
            <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
            
            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Object to processing of your information</li>
            </ul>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@blogplatform.com</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}