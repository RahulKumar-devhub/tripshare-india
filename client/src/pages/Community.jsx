import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageSquare, Send, Share2, PlusCircle, Sparkles, MapPin, 
  User, Image as ImageIcon, X, ShieldCheck, Calendar, ThumbsUp
} from 'lucide-react';
import { storiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Community({ onOpenProfile, onOpenAuth }) {
  const { user, isAuthenticated, showToast } = useAuth();
  
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [activeCommentStoryId, setActiveCommentStoryId] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // New story state
  const [newStory, setNewStory] = useState({
    title: '',
    location: '',
    coverImage: '',
    content: '',
    tags: ''
  });
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await storiesAPI.getAll();
      if (res && res.stories) {
        setStories(res.stories);
      }
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (storyId) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    try {
      const res = await storiesAPI.like(storyId);
      if (res && res.story) {
        setStories(stories.map(s => s._id === storyId ? res.story : s));
      }
    } catch (err) {
      showToast(err.message || 'Failed to like story', 'error');
    }
  };

  const handleAddComment = async (storyId) => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (!commentInput.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await storiesAPI.addComment(storyId, commentInput.trim());
      if (res && res.story) {
        setStories(stories.map(s => s._id === storyId ? res.story : s));
        setCommentInput('');
        showToast('Comment posted!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to post comment', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handlePublishStory = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (!newStory.title || !newStory.content) {
      showToast('Title and story content are required', 'error');
      return;
    }

    setPublishing(true);
    try {
      const tagsArray = newStory.tags
        ? newStory.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      
      const payload = {
        title: newStory.title,
        location: newStory.location || 'India',
        coverImage: newStory.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        content: newStory.content,
        tags: tagsArray
      };

      const res = await storiesAPI.create(payload);
      if (res && res.story) {
        setStories([res.story, ...stories]);
        setOpenCreateModal(false);
        setNewStory({ title: '', location: '', coverImage: '', content: '', tags: '' });
        showToast('Your travel story has been published to the community!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to publish story', 'error');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-semibold text-saffron-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Community Travel Chronicles</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white">
              Stories From The Indian Trail
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">
              Raw trip logs, serendipitous encounters, and practical trail notes shared by verified travelers.
            </p>
          </div>

          <button
            onClick={() => {
              if (!isAuthenticated) {
                onOpenAuth();
                return;
              }
              setOpenCreateModal(true);
            }}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-saffron-500 to-amber-500 hover:from-saffron-600 hover:to-amber-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-saffron-500/25 transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Share Your Journey</span>
          </button>
        </div>

        {/* Stories Feed */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-[#0e1320] rounded-3xl border border-white/10 p-8">
            <Sparkles className="w-12 h-12 text-saffron-500/40 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">Be the first to share a story</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
              Write about your high-altitude memories in Spiti, sunrise in Varanasi, or coastal road trips in Gokarna.
            </p>
            <button
              onClick={() => {
                if (!isAuthenticated) onOpenAuth();
                else setOpenCreateModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-saffron-500 text-white text-xs font-semibold"
            >
              Write a Field Note
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {stories.map((story) => {
              const hasLiked = user && story.likes && story.likes.includes(user._id);
              const isCommentOpen = activeCommentStoryId === story._id;

              return (
                <article
                  key={story._id}
                  className="rounded-3xl bg-[#0e1320] border border-white/10 overflow-hidden shadow-2xl transition-all"
                >
                  {/* Author Header */}
                  <div className="p-6 flex items-center justify-between">
                    <div 
                      onClick={() => onOpenProfile(story.author)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={story.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                        alt={story.author?.name}
                        className="w-11 h-11 rounded-full object-cover border border-white/10 group-hover:border-saffron-500 transition-colors"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white group-hover:text-saffron-400 transition-colors">
                            {story.author?.name || 'Fellow Traveler'}
                          </h4>
                          <ShieldCheck className="w-3.5 h-3.5 text-saffron-400" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span className="flex items-center gap-1 text-saffron-300">
                            <MapPin className="w-3 h-3" />
                            {story.location || 'India'}
                          </span>
                          <span>•</span>
                          <span>{new Date(story.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Story Cover Image */}
                  {story.coverImage && (
                    <div className="h-72 sm:h-96 w-full overflow-hidden">
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Story Body */}
                  <div className="p-6 sm:p-8">
                    <h2 className="text-2xl font-display font-bold text-white mb-3">
                      {story.title}
                    </h2>
                    <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-line mb-6 font-normal">
                      {story.content}
                    </p>

                    {/* Tags */}
                    {story.tags && story.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {story.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-saffron-300 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action buttons (Like, Comment) */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(story._id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            hasLiked
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white border border-white/5'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${hasLiked ? 'fill-rose-400 text-rose-400' : ''}`} />
                          <span>{story.likes?.length || 0} Likes</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentStoryId(isCommentOpen ? null : story._id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/5 text-xs font-semibold transition-colors"
                        >
                          <MessageSquare className="w-4 h-4 text-cyan-400" />
                          <span>{story.comments?.length || 0} Comments</span>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Comments Drawer */}
                    {isCommentOpen && (
                      <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                          Discussion & Insights ({story.comments?.length || 0})
                        </h4>

                        {story.comments && story.comments.length > 0 ? (
                          <div className="space-y-3">
                            {story.comments.map((c, idx) => (
                              <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                                <img
                                  src={c.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                                  alt={c.user?.name}
                                  className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-white">{c.user?.name || 'Traveler'}</span>
                                    <span className="text-[10px] text-neutral-500">
                                      {new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">{c.comment}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-500 italic">No comments yet. Start the conversation!</p>
                        )}

                        {/* Add Comment Input */}
                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddComment(story._id);
                            }}
                            placeholder={isAuthenticated ? "Add a note or tip..." : "Log in to join the conversation"}
                            disabled={!isAuthenticated}
                            className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60"
                          />
                          <button
                            onClick={() => handleAddComment(story._id)}
                            disabled={submittingComment || !commentInput.trim()}
                            className="p-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 text-white transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PUBLISH STORY MODAL */}
        {openCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-[#0e1320] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setOpenCreateModal(false)}
                className="absolute top-5 right-5 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-1">
                Share a Travel Chronicle or Field Note
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Tell other Indian co-travelers about real road conditions, unmissable homestays, or memorable moments.
              </p>

              <form onSubmit={handlePublishStory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStory.title}
                    onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                    placeholder="e.g. Crossing Rohtang Pass on a Bullet at Sunrise"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Location / Route
                    </label>
                    <input
                      type="text"
                      value={newStory.location}
                      onChange={(e) => setNewStory({ ...newStory, location: e.target.value })}
                      placeholder="e.g. Spiti Valley, Himachal Pradesh"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={newStory.coverImage}
                      onChange={(e) => setNewStory({ ...newStory, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Story & Field Notes *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={newStory.content}
                    onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                    placeholder="Describe your journey, key tips for other travelers, costs, and learnings..."
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newStory.tags}
                    onChange={(e) => setNewStory({ ...newStory, tags: e.target.value })}
                    placeholder="Spiti, RoyalEnfield, HighAltitude, SoloTravel"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-saffron-500/60"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenCreateModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={publishing}
                    className="px-6 py-2.5 rounded-xl bg-saffron-500 hover:bg-saffron-600 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-saffron-500/25 transition-all"
                  >
                    {publishing ? 'Publishing...' : 'Publish to Feed'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
