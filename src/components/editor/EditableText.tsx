import React, { useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
}

export function EditableText({
  value,
  onChange,
  className,
  style: propStyle,
  as = 'span',
  placeholder = 'Click to edit...',
  maxLength,
  disabled = false,
}: EditableTextProps) {
  const elementRef = useRef<HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when prop changes (e.g., undo/redo)
  useEffect(() => {
    setLocalValue(value);
    if (elementRef.current && !isEditing) {
      elementRef.current.textContent = value;
    }
  }, [value, isEditing]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    e.stopPropagation();
    setIsEditing(true);
  }, [disabled]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    const newValue = elementRef.current?.textContent || '';
    if (newValue !== value) {
      onChange(newValue);
    }
  }, [onChange, value]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      elementRef.current?.blur();
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      if (elementRef.current) {
        elementRef.current.textContent = value;
      }
      setIsEditing(false);
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (maxLength && elementRef.current) {
      const text = elementRef.current.textContent || '';
      if (text.length > maxLength) {
        elementRef.current.textContent = text.slice(0, maxLength);
        // Move cursor to end
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(elementRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [maxLength]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  // Focus the element when editing starts
  useEffect(() => {
    if (isEditing && elementRef.current) {
      elementRef.current.focus();
      // Move cursor to end
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(elementRef.current);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [isEditing]);

  const displayValue = localValue || placeholder;
  const isEmpty = !localValue;

  const baseClasses = cn(
    'outline-none transition-all cursor-text',
    isEditing && 'ring-2 ring-primary/50 ring-offset-2 rounded-sm bg-white/10',
    !isEditing && !disabled && 'hover:ring-2 hover:ring-primary/30 hover:ring-offset-1 rounded-sm',
    isEmpty && !isEditing && 'opacity-50 italic',
    disabled && 'cursor-default',
    className
  );

  const commonProps = {
    ref: elementRef as any,
    contentEditable: isEditing && !disabled,
    suppressContentEditableWarning: true,
    onClick: handleClick,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    onInput: handleInput,
    onPaste: handlePaste,
    className: baseClasses,
    style: { minWidth: '1em', display: 'inline-block', ...propStyle },
    children: displayValue,
  };

  switch (as) {
    case 'h1':
      return <h1 {...commonProps} />;
    case 'h2':
      return <h2 {...commonProps} />;
    case 'h3':
      return <h3 {...commonProps} />;
    case 'h4':
      return <h4 {...commonProps} />;
    case 'h5':
      return <h5 {...commonProps} />;
    case 'h6':
      return <h6 {...commonProps} />;
    case 'p':
      return <p {...commonProps} />;
    case 'div':
      return <div {...commonProps} />;
    default:
      return <span {...commonProps} />;
  }
}
