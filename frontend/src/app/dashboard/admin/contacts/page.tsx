'use client';

import { useState, useEffect } from 'react';
import MudLayout from '@/components/MudLayout';
import Cookies from 'js-cookie';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const token = Cookies.get('token');
      console.log('Loading contacts with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:8000/contact/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Contacts data:', data);
        setContacts(data);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
    setLoading(false);
  };

  const markAsRead = async (contactId: number) => {
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8000/contact/${contactId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        loadContacts();
      }
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  const deleteContact = async (contactId: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;
    
    try {
      const token = Cookies.get('token');
      const response = await fetch(`http://localhost:8000/contact/${contactId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        loadContacts();
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Failed to delete contact');
    }
  };

  if (loading) {
    return (
      <MudLayout title="Contact Messages" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading contacts...</p>
          </div>
        </div>
      </MudLayout>
    );
  }

  return (
    <MudLayout title="Contact Messages" subtitle="Manage contact form submissions">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text">Contact Messages</h1>
          <div className="glass-card px-4 py-2 rounded-lg">
            <span className="text-sm font-medium text-primary">Total: {contacts.length}</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm font-medium text-accent">Unread: {contacts.filter(c => !c.is_read).length}</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Contact List */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold gradient-text mb-4">Messages</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg ${
                    selectedContact?.id === contact.id
                      ? 'border-accent bg-gradient-to-r from-blue-50 to-cyan-50 shadow-md'
                      : contact.is_read
                      ? 'border-gray-200 bg-white hover:border-gray-300'
                      : 'border-accent bg-gradient-to-r from-accent/10 to-secondary/10 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary">{contact.name}</h3>
                    {!contact.is_read && (
                      <div className="w-3 h-3 bg-gradient-to-r from-accent to-secondary rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{contact.email}</p>
                  <p className="text-sm font-medium text-gray-800 mb-2">{contact.subject}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(contact.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
              
              {contacts.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">📧</div>
                  <h3 className="text-lg font-semibold gradient-text mb-2">No messages yet</h3>
                  <p className="text-gray-600">Contact messages will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div className="card p-6">
            {selectedContact ? (
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold gradient-text">Message Details</h2>
                  <div className="flex space-x-2">
                    {!selectedContact.is_read && (
                      <button
                        onClick={() => markAsRead(selectedContact.id)}
                        className="btn-primary text-sm px-3 py-1"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => deleteContact(selectedContact.id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm px-3 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="glass-card p-4 rounded-lg">
                    <label className="block text-sm font-medium text-primary mb-1">Name</label>
                    <p className="font-medium gradient-text">{selectedContact.name}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <label className="block text-sm font-medium text-primary mb-1">Email</label>
                    <p className="text-accent font-medium">{selectedContact.email}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <label className="block text-sm font-medium text-primary mb-1">Subject</label>
                    <p className="font-medium text-gray-800">{selectedContact.subject}</p>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <label className="block text-sm font-medium text-primary mb-1">Message</label>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 mt-2">
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                    </div>
                  </div>
                  
                  <div className="glass-card p-4 rounded-lg">
                    <label className="block text-sm font-medium text-primary mb-1">Received</label>
                    <p className="text-gray-600">
                      {new Date(selectedContact.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg inline-flex items-center space-x-2 font-medium"
                    >
                      <span>📧</span>
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold gradient-text mb-2">Select a message</h3>
                <p className="text-gray-600">Choose a contact message to view details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MudLayout>
  );
}