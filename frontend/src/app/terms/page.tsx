'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-primary">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="card p-8 md:p-12">
          <h1 className="text-4xl font-bold gradient-text mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: December 2024</p>
          
          <div className="prose max-w-none">
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using Blog Platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
            
            <h2>User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
            <ul>
              <li>You are responsible for safeguarding your password</li>
              <li>You must not share your account with others</li>
              <li>You must notify us immediately of any unauthorized use</li>
            </ul>
            
            <h2>Content Guidelines</h2>
            <p>Users are responsible for the content they post. You agree not to post content that:</p>
            <ul>
              <li>Is illegal, harmful, or offensive</li>
              <li>Violates intellectual property rights</li>
              <li>Contains spam or malicious code</li>
              <li>Harasses or threatens others</li>
              <li>Contains false or misleading information</li>
            </ul>
            
            <h2>Intellectual Property</h2>
            <p>The service and its original content are and will remain the exclusive property of Blog Platform and its licensors.</p>
            
            <h2>User-Generated Content</h2>
            <p>By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content.</p>
            
            <h2>Prohibited Uses</h2>
            <p>You may not use our service:</p>
            <ul>
              <li>For any unlawful purpose</li>
              <li>To violate any international, federal, provincial, or state regulations or laws</li>
              <li>To transmit or procure the sending of any advertising or promotional material</li>
              <li>To impersonate or attempt to impersonate the company or other users</li>
            </ul>
            
            <h2>Termination</h2>
            <p>We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms of Service.</p>
            
            <h2>Limitation of Liability</h2>
            <p>In no event shall Blog Platform be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
            
            <h2>Contact Information</h2>
            <p>Questions about the Terms of Service should be sent to us at legal@blogplatform.com</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}