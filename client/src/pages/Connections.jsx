import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, MessageSquare, Check, X, Send, Clock, MapPin, 
  Sparkles, ShieldCheck, ArrowRight, UserPlus, Search, 
  Circle, Smile, RefreshCw
} from 'lucide-react';
import { buddiesAPI, messagesAPI, formatDate, imageUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Connections({ initialActiveTab = 'messages', onOpenProfile }) {
  const { user, isAuthenticated, showToast } = useAuth();

  const [activeTab, setActiveTab] = useState(initialActiveTab); // 'messages' | 'incoming' | 'sent' | 'connected'
  const [loading, setLoading] = useState(true);

  // Buddy requests & connected
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connectedBuddies, setConnectedBuddies] = useState([]);

  // Messaging state
  const [conversations, setConversations] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated, activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [reqRes, connRes, convRes] = await Promise.allSettled([
        buddiesAPI.getRequests(),
        buddiesAPI.getConnected(),
        messagesAPI.getConversations()
      ]);

      if (reqRes.status === 'fulfilled' && reqRes.value) {
        setIncomingRequests(reqRes.value.incoming || []);
        setSentRequests(reqRes.value.sent || []);
      }
      if (connRes.status === 'fulfilled' && connRes.value) {
        setConnectedBuddies(connRes.value.buddies || []);
      }
      if (convRes.status === 'fulfilled' && convRes.value) {
        const list = convRes.value.conversations || [];
        setConversations(list);
        if (!activeChatUser && list.length > 0) {
          selectConversation(list[0].user);
        }
      }
    } catch (err) {
      console.error('Failed to load connection data:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectConversation = async (targetUser) => {
    setActiveChatUser(targetUser);
    try {
      const res = await messagesAPI.getThread(targetUser._id);
      if (res.success && res.messages) {
        setMessages(res.messages);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to load thread:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChatUser) return;

    setSendingMessage(true);
    try {
      const text = messageText.trim();
      setMessageText('');
      const res = await messagesAPI.sendMessage({
        recipientId: activeChatUser._id,
        text
      });

      if (res.success && res.message) {
        setMessages((prev) => [...prev, res.message]);
        scrollToBottom();
        // Refresh conversations list to update preview
        const convRes = await messagesAPI.getConversations();
        if (convRes.success) setConversations(convRes.conversations);
      }
    } catch (err) {
      showToast('Could not send message', 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    try {
      const res = await buddiesAPI.respondRequest(requestId, status);
      if (res.success) {
        showToast(`Request ${status}!`, 'success');
        loadAllData();
      }
    } catch (err) {
      showToast('Could not respond to request', 'error');
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#060910] text-white pt-32 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-[#0c111d] rounded-3xl border border-white/10">
          <MessageSquare className="w-12 h-12 text-saffron-400 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect & Chat with Travellers</h2>
          <p className="text-xs text-white/60 mb-6">
            Log in to access your real-time messages, connected travel buddies, and incoming buddy requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] text-white pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Social & Messaging Center</h1>
            <p className="text-xs text-white/50">Manage connections, requests, and direct chats with co-travellers.</p>
          </div>

          <div className="flex items-center gap-2 bg-[#0c111d] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'messages' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Messages</span>
            </button>
            <button
              onClick={() => setActiveTab('incoming')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'incoming' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Incoming</span>
              {incomingRequests.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {incomingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'sent' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Sent Requests</span>
            </button>
            <button
              onClick={() => setActiveTab('connected')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'connected' ? 'bg-saffron-500 text-white shadow-saffron' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>Buddies ({connectedBuddies.length})</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Real-Time Split-Screen Chat */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#0c111d] rounded-3xl border border-white/10 overflow-hidden shadow-2xl h-[640px]">
            {/* Left: Conversation List */}
            <div className="md:col-span-4 border-r border-white/10 flex flex-col h-full bg-[#080d17]">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white/50">Recent Conversations</span>
                <button
                  onClick={loadAllData}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-white/5 p-2">
                {conversations.length === 0 ? (
                  <div className="py-12 text-center text-xs text-white/40 p-4">
                    No active conversations yet. Accept a buddy request or message a connected traveller to start chatting.
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const isSelected = activeChatUser?._id === conv.user._id;
                    return (
                      <div
                        key={conv.user._id}
                        onClick={() => selectConversation(conv.user)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected ? 'bg-white/10 shadow-lg' : 'hover:bg-white/5'
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={conv.user.profileImage || imageUrl()}
                            alt={conv.user.fullName}
                            className="w-11 h-11 rounded-full object-cover border border-white/15"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0c111d]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-bold text-white truncate">{conv.user.fullName}</span>
                            <span className="text-[10px] text-white/40">
                              {conv.lastMessage?.createdAt ? formatDate(conv.lastMessage.createdAt) : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/60 truncate">{conv.lastMessage?.text || 'Connected'}</p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-saffron-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right: Active Chat Stream */}
            <div className="md:col-span-8 flex flex-col h-full bg-[#0c111d]">
              {activeChatUser ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
                    <div className="flex items-center gap-3">
                      <img
                        src={activeChatUser.profileImage || imageUrl()}
                        alt={activeChatUser.fullName}
                        className="w-10 h-10 rounded-full object-cover border border-white/15 cursor-pointer"
                        onClick={() => onOpenProfile && onOpenProfile(activeChatUser)}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-white">{activeChatUser.fullName}</h3>
                          {activeChatUser.verified && (
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-[11px] text-white/50">{activeChatUser.city || 'India'} • Active Traveller</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onOpenProfile && onOpenProfile(activeChatUser)}
                      className="btn-outline text-xs py-1.5 px-3 rounded-xl"
                    >
                      View Profile
                    </button>
                  </div>

                  {/* Messages Bubble Area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-20 text-xs text-white/40">
                        Say hello to {activeChatUser.fullName} and start planning your expedition!
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = String(msg.sender?._id || msg.sender) === String(user?._id);
                        return (
                          <div
                            key={msg._id}
                            className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                          >
                            <div
                              className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                                isMe
                                  ? 'bg-gradient-to-r from-saffron-500 to-amber-500 text-white shadow-lg shadow-saffron-500/20 rounded-br-none'
                                  : 'bg-[#151d2f] text-white/90 border border-white/10 rounded-bl-none'
                              }`}
                            >
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-white/40 mt-1 px-1 font-mono">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Message Input Box */}
                  <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 flex items-center gap-2 bg-black/20">
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder={`Message ${activeChatUser.fullName}...`}
                      className="flex-1 py-3 px-4 bg-[#080d16] border border-white/15 focus:border-saffron-500 rounded-2xl text-white text-xs placeholder-white/40 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !messageText.trim()}
                      className="btn-saffron w-11 h-11 rounded-2xl flex items-center justify-center disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8 text-white/40 text-xs">
                  Select a traveller from the list to start messaging.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Incoming Requests */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            {incomingRequests.length === 0 ? (
              <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8 text-white/50 text-xs">
                No pending incoming requests. Your profile is visible to other explorers!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {incomingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="p-5 bg-[#0c111d] border border-white/10 rounded-2xl flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={req.fromUser?.profileImage || imageUrl()}
                        alt={req.fromUser?.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-white/15"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{req.fromUser?.fullName}</h3>
                        <p className="text-xs text-white/50 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-saffron-400" />
                          {req.fromUser?.city} • Style: {req.fromUser?.travelStyle}
                        </p>
                        {req.destination && (
                          <span className="text-[10px] text-azure-400 font-semibold block mt-1">
                            Interested in: {req.destination}
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-white/70 bg-white/5 p-3 rounded-xl mb-4 italic">
                      "{req.message}"
                    </p>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespondRequest(req._id, 'accepted')}
                        className="flex-1 btn-saffron text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Connect</span>
                      </button>
                      <button
                        onClick={() => handleRespondRequest(req._id, 'rejected')}
                        className="btn-outline text-xs py-2 px-4 rounded-xl text-rose-400 hover:text-rose-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Sent Requests */}
        {activeTab === 'sent' && (
          <div className="space-y-4">
            {sentRequests.length === 0 ? (
              <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8 text-white/50 text-xs">
                No outgoing requests right now. Discover compatible travellers in Find My Buddy!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentRequests.map((req) => (
                  <div key={req._id} className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={req.toUser?.profileImage || imageUrl()}
                        alt={req.toUser?.fullName}
                        className="w-11 h-11 rounded-full object-cover border border-white/15"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{req.toUser?.fullName}</h3>
                        <p className="text-xs text-white/50">{req.toUser?.city} • {req.destination || 'India'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase font-semibold">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Connected Buddies */}
        {activeTab === 'connected' && (
          <div className="space-y-4">
            {connectedBuddies.length === 0 ? (
              <div className="py-20 text-center bg-[#0c111d] rounded-3xl border border-white/10 p-8 text-white/50 text-xs">
                You have not connected with any travel buddies yet. Start matching today!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedBuddies.map((buddy) => (
                  <div key={buddy._id} className="p-4 bg-[#0c111d] border border-white/10 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={buddy.profileImage || imageUrl()}
                        alt={buddy.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-white/15"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-white">{buddy.fullName}</h3>
                        <p className="text-xs text-white/50">{buddy.city} • {buddy.travelStyle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('messages');
                        selectConversation(buddy);
                      }}
                      className="btn-saffron text-xs py-1.5 px-3 rounded-xl flex items-center gap-1 font-semibold"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Chat</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
