/**
 * Enhancement Showcase
 * Demonstrates new packages: animations, collaboration, and accessibility
 */

import { useState } from 'react';
import {
  AnimatedCard,
  FadeInContainer,
  AnimatedButton,
  AnimatedList,
  AnimatedListItem,
  AnimatedToast,
  useScrollAnimation,
} from '@aivo/animations';
import {
  ScreenReaderOnly,
  SkipLink,
  useAnnounce,
  useReducedMotion,
  AccessibleButton,
  IconButton,
} from '@aivo/accessibility';
import { VideoCall, useWebRTC } from '@aivo/collaboration';
import { Play, Pause, Bell, Users, Accessibility } from 'lucide-react';

export function EnhancementShowcase() {
  const [showToast, setShowToast] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const { ref: scrollRef, controls } = useScrollAnimation();
  const announce = useAnnounce();
  const shouldReduceMotion = useReducedMotion();

  const handleAction = (action: string) => {
    announce(`${action} activated`, 'polite');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      <div id="main-content" className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <FadeInContainer delay={0}>
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AIVO Enhancement Showcase
            </h1>
            <p className="text-gray-600 text-lg">
              Demonstrating animations, collaboration, and accessibility features
            </p>
            {shouldReduceMotion && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  ♿ Reduced motion mode detected - animations are simplified
                </p>
              </div>
            )}
          </div>
        </FadeInContainer>

        {/* Animations Section */}
        <FadeInContainer delay={0.1}>
          <AnimatedCard className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Play className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Advanced Animations
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              Smooth, performant animations built with Framer Motion
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AnimatedButton
                onClick={() => handleAction('Animation')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
              >
                Click Me!
              </AnimatedButton>

              <AnimatedButton
                onClick={() => handleAction('Card Hover')}
                className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
              >
                Hover Effect
              </AnimatedButton>

              <AnimatedButton
                onClick={() => handleAction('Tap Animation')}
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow"
              >
                Tap Animation
              </AnimatedButton>
            </div>

            <AnimatedList className="mt-6 space-y-2">
              {['Page Transitions', 'Card Animations', 'Button Interactions', 'List Stagger'].map(
                (item) => (
                  <AnimatedListItem
                    key={item}
                    className="bg-purple-50 p-3 rounded-lg text-gray-700"
                  >
                    ✨ {item}
                  </AnimatedListItem>
                )
              )}
            </AnimatedList>
          </AnimatedCard>
        </FadeInContainer>

        {/* Collaboration Section */}
        <FadeInContainer delay={0.2}>
          <AnimatedCard className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Real-time Collaboration
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              WebRTC video calls and collaborative editing
            </p>

            {!showVideo ? (
              <AnimatedButton
                onClick={() => {
                  setShowVideo(true);
                  handleAction('Video Call Started');
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-shadow w-full"
              >
                <Users className="inline w-5 h-5 mr-2" />
                Start Video Call Demo
              </AnimatedButton>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    Video call component would appear here
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Requires WebRTC signaling server setup
                  </p>
                </div>
                <AnimatedButton
                  onClick={() => {
                    setShowVideo(false);
                    handleAction('Video Call Ended');
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 w-full"
                >
                  End Call
                </AnimatedButton>
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Features</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>✓ Video/Audio calls</li>
                  <li>✓ Screen sharing</li>
                  <li>✓ Real-time chat</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Collaboration</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>✓ Shared documents</li>
                  <li>✓ Presence tracking</li>
                  <li>✓ Cursor sync</li>
                </ul>
              </div>
            </div>
          </AnimatedCard>
        </FadeInContainer>

        {/* Accessibility Section */}
        <FadeInContainer delay={0.3}>
          <AnimatedCard className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Accessibility className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Accessibility Features
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              WCAG 2.1 AA/AAA compliance built-in
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AccessibleButton
                  onClick={() => handleAction('Screen Reader Announcement')}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                  aria-label="Trigger screen reader announcement"
                >
                  <Bell className="inline w-5 h-5 mr-2" />
                  Announce Message
                  <ScreenReaderOnly>
                    This button will announce a message to screen readers
                  </ScreenReaderOnly>
                </AccessibleButton>

                <IconButton
                  aria-label="Toggle accessibility features"
                  onClick={() => handleAction('Accessibility Toggle')}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600"
                >
                  <Accessibility className="w-5 h-5" />
                </IconButton>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-3">
                  Accessibility Features:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-800">
                  <li>♿ Keyboard navigation</li>
                  <li>🎯 Focus management</li>
                  <li>📢 Screen reader support</li>
                  <li>🎨 Color contrast checking</li>
                  <li>⚡ Reduced motion support</li>
                  <li>🔍 Skip links</li>
                  <li>🏷️ ARIA labels</li>
                  <li>📋 Form field helpers</li>
                </ul>
              </div>
            </div>
          </AnimatedCard>
        </FadeInContainer>

        {/* Scroll Animation Demo */}
        <div
          ref={scrollRef as any}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Scroll-Triggered Animation
          </h2>
          <p className="text-gray-600">
            This section animates when it enters the viewport!
          </p>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-4 right-4 z-50">
            <AnimatedToast className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-lg shadow-2xl">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <span>Action completed successfully!</span>
              </div>
            </AnimatedToast>
          </div>
        )}
      </div>
    </div>
  );
}
