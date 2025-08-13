import React from 'react';
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router';

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Container = ({ fixed, className, ...props }: ContainerProps) => {
  return (
    <main
      className={cn(
        'peer-[.header-fixed]/header:mt-16',
        'px-4 py-6',
        fixed && 'fixed-main flex grow flex-col overflow-hidden',
        className
      )}
      {...props}
    >
      <Outlet />
    </main>
  );
};
