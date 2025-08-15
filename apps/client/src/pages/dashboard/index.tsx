export const DashBoardNav = [
  {
    title: 'Overview',
    href: 'dashboard',
    disabled: false,
  },
  {
    title: 'UserEvent',
    href: 'dashboard/userEvent',
    disabled: false,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    disabled: true,
  },
];

export default function Dashboard() {
  return <div>Dashboard</div>;
}
