/**
 * Accessible Components
 */

import { useRef, useEffect } from 'react';
import { useDialog, useFocusTrap, useEscapeKey } from './hooks';
import { srOnlyStyles } from './utils';

/**
 * Screen Reader Only component
 */
export function ScreenReaderOnly({ children, ...props }: React.HTMLProps<HTMLDivElement>) {
  return (
    <div style={srOnlyStyles} {...props}>
      {children}
    </div>
  );
}

/**
 * Skip Link component
 */
export interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 999,
        padding: '1rem',
        background: 'white',
        color: 'black',
        textDecoration: 'none',
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      {children}
    </a>
  );
}

/**
 * Accessible Dialog/Modal
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, description, children }: DialogProps) {
  const dialogRef = useDialog(isOpen);
  const trapRef = useFocusTrap(isOpen);
  useEscapeKey(onClose, isOpen);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? 'dialog-description' : undefined}
      ref={(el) => {
        (dialogRef as any).current = el;
        (trapRef as any).current = el;
      }}
      tabIndex={-1}
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '100%',
        }}
      >
        <h2 id="dialog-title">{title}</h2>
        {description && <p id="dialog-description">{description}</p>}
        {children}
      </div>
    </div>
  );
}

/**
 * Live Region for announcements
 */
export interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function LiveRegion({ message, politeness = 'polite' }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      style={srOnlyStyles}
    >
      {message}
    </div>
  );
}

/**
 * Focus Trap Container
 */
export interface FocusTrapProps {
  active?: boolean;
  children: React.ReactNode;
}

export function FocusTrap({ active = true, children }: FocusTrapProps) {
  const ref = useFocusTrap(active);

  return (
    <div ref={ref as any}>
      {children}
    </div>
  );
}

/**
 * Accessible Button
 */
export interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  'aria-label'?: string;
}

export function AccessibleButton({ children, ...props }: AccessibleButtonProps) {
  return (
    <button
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Accessible Icon Button
 */
export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string;
  children: React.ReactNode;
}

export function IconButton({ 'aria-label': ariaLabel, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      {...props}
    >
      {children}
      <ScreenReaderOnly>{ariaLabel}</ScreenReaderOnly>
    </button>
  );
}

/**
 * Accessible Link
 */
export interface AccessibleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}

export function AccessibleLink({ href, children, external, ...props }: AccessibleLinkProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
      {external && <ScreenReaderOnly>(opens in new tab)</ScreenReaderOnly>}
    </a>
  );
}

/**
 * Accessible Heading
 */
export interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Heading({ level, children, ...props }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag {...props}>{children}</Tag>;
}

/**
 * Accessible Landmark
 */
export interface LandmarkProps extends React.HTMLAttributes<HTMLElement> {
  type: 'banner' | 'navigation' | 'main' | 'complementary' | 'contentinfo' | 'region';
  label?: string;
  children: React.ReactNode;
}

export function Landmark({ type, label, children, ...props }: LandmarkProps) {
  const roleMap = {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    complementary: 'complementary',
    contentinfo: 'contentinfo',
    region: 'region',
  };

  return (
    <div role={roleMap[type]} aria-label={label} {...props}>
      {children}
    </div>
  );
}

/**
 * Visually Hidden component (visible to screen readers)
 */
export function VisuallyHidden({ children, ...props }: React.HTMLProps<HTMLSpanElement>) {
  return (
    <span style={srOnlyStyles} {...props}>
      {children}
    </span>
  );
}
