// Icon options and helper functions for blog posts
// This file can be used on both server and client

export interface IconOption {
  id: string
  emoji: string
  label: string
  category: string
}

export const ICON_OPTIONS: IconOption[] = [
  // Announcements & News
  { id: 'announcement', emoji: '📢', label: 'Announcement', category: 'News' },
  { id: 'megaphone', emoji: '📣', label: 'Megaphone', category: 'News' },
  { id: 'news', emoji: '📰', label: 'News', category: 'News' },
  { id: 'bell', emoji: '🔔', label: 'Bell', category: 'News' },
  { id: 'star', emoji: '⭐', label: 'Star', category: 'News' },
  { id: 'sparkles', emoji: '✨', label: 'Sparkles', category: 'News' },

  // Documents & Content
  { id: 'document', emoji: '📄', label: 'Document', category: 'Documents' },
  { id: 'clipboard', emoji: '📋', label: 'Clipboard', category: 'Documents' },
  { id: 'notebook', emoji: '📓', label: 'Notebook', category: 'Documents' },
  { id: 'book', emoji: '📖', label: 'Book', category: 'Documents' },
  { id: 'bookmark', emoji: '🔖', label: 'Bookmark', category: 'Documents' },
  { id: 'scroll', emoji: '📜', label: 'Scroll', category: 'Documents' },

  // Development & Code
  { id: 'code', emoji: '💻', label: 'Code', category: 'Development' },
  { id: 'terminal', emoji: '🖥️', label: 'Terminal', category: 'Development' },
  { id: 'gear', emoji: '⚙️', label: 'Gear', category: 'Development' },
  { id: 'wrench', emoji: '🔧', label: 'Wrench', category: 'Development' },
  { id: 'hammer', emoji: '🔨', label: 'Hammer', category: 'Development' },
  { id: 'package', emoji: '📦', label: 'Package', category: 'Development' },

  // Security & Privacy
  { id: 'lock', emoji: '🔐', label: 'Lock', category: 'Security' },
  { id: 'key', emoji: '🔑', label: 'Key', category: 'Security' },
  { id: 'shield', emoji: '🛡️', label: 'Shield', category: 'Security' },
  { id: 'locked', emoji: '🔒', label: 'Locked', category: 'Security' },
  { id: 'unlocked', emoji: '🔓', label: 'Unlocked', category: 'Security' },

  // Search & Analysis
  { id: 'search', emoji: '🔍', label: 'Search', category: 'Analysis' },
  { id: 'magnifier', emoji: '🔎', label: 'Magnifier', category: 'Analysis' },
  { id: 'chart', emoji: '📊', label: 'Chart', category: 'Analysis' },
  { id: 'graph', emoji: '📈', label: 'Graph Up', category: 'Analysis' },
  { id: 'target', emoji: '🎯', label: 'Target', category: 'Analysis' },

  // Time & Schedule
  { id: 'clock', emoji: '🕐', label: 'Clock', category: 'Time' },
  { id: 'alarm', emoji: '⏰', label: 'Alarm', category: 'Time' },
  { id: 'hourglass', emoji: '⏳', label: 'Hourglass', category: 'Time' },
  { id: 'calendar', emoji: '📅', label: 'Calendar', category: 'Time' },
  { id: 'stopwatch', emoji: '⏱️', label: 'Stopwatch', category: 'Time' },

  // Communication
  { id: 'email', emoji: '📧', label: 'Email', category: 'Communication' },
  { id: 'chat', emoji: '💬', label: 'Chat', category: 'Communication' },
  { id: 'globe', emoji: '🌐', label: 'Globe', category: 'Communication' },
  { id: 'link', emoji: '🔗', label: 'Link', category: 'Communication' },

  // Design & Creative
  { id: 'palette', emoji: '🎨', label: 'Palette', category: 'Design' },
  { id: 'pencil', emoji: '✏️', label: 'Pencil', category: 'Design' },
  { id: 'brush', emoji: '🖌️', label: 'Brush', category: 'Design' },
  { id: 'image', emoji: '🖼️', label: 'Image', category: 'Design' },

  // Status & Info
  { id: 'info', emoji: 'ℹ️', label: 'Info', category: 'Status' },
  { id: 'warning', emoji: '⚠️', label: 'Warning', category: 'Status' },
  { id: 'check', emoji: '✅', label: 'Check', category: 'Status' },
  { id: 'cross', emoji: '❌', label: 'Cross', category: 'Status' },
  { id: 'question', emoji: '❓', label: 'Question', category: 'Status' },
  { id: 'bulb', emoji: '💡', label: 'Idea', category: 'Status' },

  // Misc
  { id: 'rocket', emoji: '🚀', label: 'Rocket', category: 'Misc' },
  { id: 'fire', emoji: '🔥', label: 'Fire', category: 'Misc' },
  { id: 'lightning', emoji: '⚡', label: 'Lightning', category: 'Misc' },
  { id: 'trophy', emoji: '🏆', label: 'Trophy', category: 'Misc' },
  { id: 'gem', emoji: '💎', label: 'Gem', category: 'Misc' },
  { id: 'heart', emoji: '❤️', label: 'Heart', category: 'Misc' },
]

// Helper function to get emoji by icon ID
export function getIconEmoji(iconId: string | null | undefined): string | null {
  if (!iconId) return null
  const icon = ICON_OPTIONS.find(i => i.id === iconId)
  return icon?.emoji || null
}
