'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="card p-8 md:p-12">
          <h1 className="text-4xl font-bold gradient-text mb-8">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>
          
          <div className="prose max-w-none">
            <h2>What Are Cookies</h2>
            <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
            
            <h2>How We Use Cookies</h2>
            <p>We use cookies for several reasons:</p>
            <ul>
              <li>To keep you logged in to your account</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze how our website is used</li>
              <li>To improve our services</li>
              <li>To provide personalized content</li>
            </ul>
            
            <h2>Types of Cookies We Use</h2>
            
            <h3>Essential Cookies</h3>
            <p>These cookies are necessary for the website to function properly. They include:</p>
            <ul>
              <li>Authentication cookies to keep you logged in</li>
              <li>Security cookies to protect against fraud</li>
              <li>Session cookies to maintain your browsing session</li>
            </ul>
            
            <h3>Analytics Cookies</h3>
            <p>We use analytics cookies to understand how visitors interact with our website:</p>
            <ul>
              <li>Google Analytics to track website usage</li>
              <li>Performance monitoring cookies</li>
              <li>User behavior tracking cookies</li>
            </ul>
            
            <h3>Functional Cookies</h3>
            <p>These cookies enhance your experience by remembering your choices:</p>
            <ul>
              <li>Language preferences</li>
              <li>Theme settings</li>
              <li>Recently viewed content</li>
            </ul>
            
            <h2>Third-Party Cookies</h2>
            <p>We may also use third-party services that set cookies on our behalf:</p>
            <ul>
              <li>Social media platforms for sharing content</li>
              <li>Analytics providers for website statistics</li>
              <li>Advertising networks for relevant ads</li>
            </ul>
            
            <h2>Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <ul>
              <li>Browser settings: Most browsers allow you to block or delete cookies</li>
              <li>Opt-out tools: Use industry opt-out tools for advertising cookies</li>
              <li>Privacy settings: Adjust your privacy preferences in your account</li>
            </ul>
            
            <h2>Cookie Retention</h2>
            <p>Different cookies have different lifespans:</p>
            <ul>
              <li>Session cookies: Deleted when you close your browser</li>
              <li>Persistent cookies: Remain until they expire or you delete them</li>
              <li>Authentication cookies: Last for 30 days or until you log out</li>
            </ul>
            
            <h2>Updates to This Policy</h2>
            <p>We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
            
            <h2>Contact Us</h2>
            <p>If you have any questions about our use of cookies, please contact us at cookies@blogplatform.com</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}