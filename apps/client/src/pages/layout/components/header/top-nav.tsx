import { IconMenu } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useLocation } from 'react-router';

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    title: string;
    href: string;
    disabled?: boolean;
  }[];
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const location = useLocation();

  // Function to check if a link is active
  const isActiveLink = (href: string) => {
    const currentPath = location.pathname;
    // Remove leading slash if present for comparison
    const normalizedHref = href.startsWith('/') ? href : `/${href}`;
    const normalizedCurrent = currentPath.endsWith('/')
      ? currentPath.slice(0, -1)
      : currentPath;

    return (
      normalizedCurrent === normalizedHref ||
      normalizedCurrent.startsWith(normalizedHref + '/')
    );
  };

  return (
    <>
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <IconMenu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {links.map(({ title, href }) => {
              const isActive = isActiveLink(href);
              return (
                <DropdownMenuItem key={`${title}-${href}`} asChild>
                  <Link
                    to={href}
                    className={!isActive ? 'text-muted-foreground' : ''}
                  >
                    {title}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn(
          'hidden items-center space-x-4 md:flex lg:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href }) => {
          const isActive = isActiveLink(href);
          return (
            <Link
              key={`${title}-${href}`}
              to={href}
              className={`hover:text-primary text-sm font-medium transition-colors ${isActive ? '' : 'text-muted-foreground'}`}
            >
              {title}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
