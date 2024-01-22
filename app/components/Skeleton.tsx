export default function Skeleton({
  className,
  children,
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      role="status"
      className={`animate-pulse rounded-md bg-light-grey dark:bg-medium-grey ${className}`}
    >
      {children}
    </div>
  );
}
