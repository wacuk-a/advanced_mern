# SilentVoice+ UI/UX Design Guide - CalmUI System

## Design Philosophy

SilentVoice+ uses a **trauma-informed design approach** that prioritizes emotional safety, accessibility, and discretion. The interface is designed to feel like a digital sanctuary - peaceful, secure, and empowering.

## CalmUI Design System

### Color Palette

#### Soft Neutrals
- `--calm-neutral-50`: #F8FAFC (Background)
- `--calm-neutral-100`: #F1F5F9 (Cards, subtle backgrounds)
- `--calm-neutral-200`: #E2E8F0 (Borders, dividers)
- `--calm-neutral-300`: #CBD5E1 (Hover states)
- `--calm-neutral-600`: #475569 (Secondary text)
- `--calm-neutral-800`: #1E293B (Primary text)
- `--calm-neutral-900`: #0F172A (Headings)

#### Calming Teals
- `--calm-teal-100`: #CCFBF1 (Light backgrounds)
- `--calm-teal-200`: #99F6E4 (Hover states)
- `--calm-teal-300`: #5EEAD4 (Primary actions, focus rings)
- `--calm-teal-400`: #2DD4BF (Active states)
- `--calm-teal-500`: #14B8A6 (Accent colors)

#### Gentle Purples
- `--calm-purple-100`: #F3E8FF (Light backgrounds)
- `--calm-purple-200`: #E9D5FF (Subtle highlights)
- `--calm-purple-300`: #DDD6FE (Secondary actions)
- `--calm-purple-400`: #C4B5FD (Interactive elements)

#### Subtle Emergency Signaling
- `--calm-alert-soft`: #FDA4AF (Soft pink for alerts)
- `--calm-alert-gentle`: #FECACA (Gentle alert backgrounds)
- `--calm-alert-subtle`: #FEE2E2 (Very subtle alerts)

### Typography

- **Primary Font**: Inter (system fallback)
- **Display Font**: Poppins (for headings)
- **Comfortable Line Height**: 1.75
- **Relaxed Line Height**: 1.9 (for longer text)

### Spacing System

Based on 6px base unit:
- `--spacing-xs`: 6px
- `--spacing-sm`: 12px
- `--spacing-md`: 18px
- `--spacing-lg`: 24px
- `--spacing-xl`: 30px
- `--spacing-2xl`: 36px
- `--spacing-3xl`: 48px

### Border Radius

- `--radius-sm`: 8px
- `--radius-md`: 12px
- `--radius-lg`: 16px
- `--radius-xl`: 24px
- `--radius-full`: 9999px (circular)

### Shadows

- `--shadow-sm`: Subtle elevation
- `--shadow-md`: Medium elevation
- `--shadow-lg`: High elevation
- `--shadow-soft`: Gentle, diffused shadow

### Transitions

- `--transition-fast`: 150ms
- `--transition-base`: 250ms
- `--transition-slow`: 350ms
- `--transition-bounce`: 400ms (with bounce easing)

## Key Components

### 1. Discreet Panic Button

**Location**: Fixed bottom-right corner
**Size**: 44px × 44px (WCAG AA compliant)
**Design**: Soft gradient (#FDA4AF to #FECACA)
**Features**:
- Gentle pulse animation when active
- Confirmation dialog to prevent accidents
- Breathing exercise before activation
- Multiple activation methods (button, shake, voice, volume button)

**Accessibility**:
- ARIA labels for screen readers
- Keyboard accessible
- High contrast mode support

### 2. Quick Exit Button

**Location**: Fixed top-right corner
**Size**: 32px × 32px (mobile: 36px)
**Design**: Subtle gray, low opacity
**Features**:
- Double-press Escape to exit
- Shake-to-exit
- Clears history and sensitive data

### 3. Breathing Exercise Component

**Purpose**: Emotional regulation during stressful moments
**Design**: Animated circle with breathing phases
**Phases**:
- Inhale (4s) - Teal, expanding
- Hold (2s) - Purple, static
- Exhale (6s) - Light teal, contracting
- Rest (2s) - Neutral, static

**Integration**: Appears on Dashboard and Reports pages

### 4. Gentle Chat Interface

**Message Bubbles**:
- User messages: Teal background (#CCFBF1)
- Counselor messages: White background with soft shadow
- Max width: 70% of container
- Rounded corners with directional tail

**Typing Indicator**: Three animated dots with wave effect
**Status Indicators**: Soft color changes for sent/delivered/read

### 5. Calm Dashboard

**Layout**: Clean, airy with ample white space
**Stats Cards**: 
- Soft shadows
- Gentle hover elevation
- Teal accent for values
- Icon + value + label structure

**Quick Actions**: Grid layout with hover effects

### 6. Safehouse Interface

**Map Styling**: 
- Soft pastel colors
- Privacy-focused (approximate locations)
- Gentle markers
- Custom Leaflet styling

**Availability Indicators**:
- Color saturation indicates availability
- Soft badges (teal for available, gray for unavailable)

### 7. Report Forms

**Design**: Gentle, non-intimidating
**Features**:
- Soft input borders
- Gentle focus states (teal ring)
- Helpful placeholder text
- Reassuring messages
- Breathing exercise integration

## Interaction Patterns

### Hover States
- Subtle color shifts (10-15% lighter)
- Gentle elevation (2-4px translateY)
- Soft shadow increase

### Focus States
- Teal focus ring (3px, 30% opacity)
- Smooth transitions
- Keyboard navigation friendly

### Loading States
- Gentle pulse animation
- Soft spinner (teal accent)
- Reassuring messages

### Error States
- Soft pink backgrounds
- Helpful, non-blaming messages
- Clear recovery paths

### Success States
- Gentle teal highlights
- Encouraging messages
- Smooth fade-in animations

## Accessibility Features

### WCAG 2.1 AA Compliance

1. **Color Contrast**:
   - Text meets 4.5:1 ratio minimum
   - Large text meets 3:1 ratio
   - Interactive elements clearly distinguishable

2. **Keyboard Navigation**:
   - All interactive elements keyboard accessible
   - Logical tab order
   - Visible focus indicators
   - Skip links for main content

3. **Screen Reader Support**:
   - Semantic HTML
   - ARIA labels and roles
   - Descriptive alt text
   - Live regions for dynamic content

4. **Touch Targets**:
   - Minimum 44px × 44px
   - Adequate spacing between targets
   - Comfortable for one-handed use

5. **Reduced Motion**:
   - Respects `prefers-reduced-motion`
   - Replaces animations with color shifts
   - Maintains functionality without motion

6. **High Contrast Mode**:
   - Alternative color palette
   - Maintains readability
   - Preserves design intent

## Emotional Design Elements

### Breathing Exercises
- Integrated at stress points
- Guided 4-6-2-2 breathing pattern
- Visual and text guidance
- Optional, non-intrusive

### Reassuring Language
- "You're safe here"
- "Take your time"
- "Help is on the way"
- "Your privacy is protected"

### Gentle Confirmations
- Soft success messages
- Encouraging feedback
- No alarming sounds or visuals

### Mood Check-ins
- Optional emotional state indicators
- Calming color responses
- Non-judgmental language

## Responsive Behavior

### Mobile (< 768px)
- Single column layouts
- Larger touch targets (48px)
- Simplified navigation
- Bottom-aligned panic button
- Full-screen modals

### Tablet (768px - 1024px)
- Two-column layouts where appropriate
- Split-screen interfaces
- Comfortable spacing
- Optimized for portrait/landscape

### Desktop (> 1024px)
- Multi-panel layouts
- Sidebar navigation
- Hover states more prominent
- Keyboard shortcuts

## Discreet Safety Features

### App Disguise Mode
- Transforms to meditation app
- Neutral colors and icons
- Generic content
- No obvious safety indicators

### Incognito Mode
- Hides sensitive content
- Replaces with neutral messages
- Auto-activates on inactivity
- Blur effect for privacy

### Quick Exit
- Multiple exit methods
- Instant history clearing
- Redirects to neutral page
- No trace left behind

## Implementation Notes

### CSS Variables
All design tokens are defined in `calm-ui.css` as CSS custom properties for easy theming and maintenance.

### Component Structure
- Functional React components
- TypeScript for type safety
- CSS Modules for scoped styles
- Utility classes for common patterns

### Performance
- Optimized animations (GPU-accelerated)
- Lazy loading for heavy components
- Efficient re-renders
- Smooth 60fps interactions

## Best Practices

1. **Always use CalmUI tokens** - Never hardcode colors or spacing
2. **Test with screen readers** - Ensure all content is accessible
3. **Respect reduced motion** - Provide alternatives
4. **Maintain consistency** - Use established patterns
5. **Prioritize clarity** - Clear over clever
6. **Test on real devices** - Especially mobile
7. **Consider emotional impact** - Every design decision matters

## Future Enhancements

- Dark mode support
- Additional language support
- Customizable color themes
- Advanced animation options
- Enhanced haptic feedback
- Voice interface improvements

---

**Remember**: Every pixel, every interaction, every word should contribute to a sense of safety, calm, and empowerment. This is not just an interface - it's a digital sanctuary.

