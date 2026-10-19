import type { ElementType, ReactNode } from 'react';
import './Container.css';

interface ContainerProps {
  children: ReactNode;
  width?: 'default' | 'narrow';
  as?: ElementType;
  className?: string;
}

export function Container({ children, width = 'default', as: Tag = 'div', className }: ContainerProps) {
  const classes = ['container', width === 'narrow' && 'container--narrow', className].filter(Boolean).join(' ');
  return <Tag className={classes}>{children}</Tag>;
}
