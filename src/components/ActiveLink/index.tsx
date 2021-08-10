import { ReactElement, cloneElement } from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/dist/client/router';

interface Props extends LinkProps {
  children: ReactElement
  activeClassName: string
}

export function ActiveLink({ children, activeClassName, ...rest }: Props) {
  const { asPath } = useRouter();
  const className = asPath === rest.href ? activeClassName : '';
  return (
    <Link {...rest}>
      {cloneElement(children, { className })}
    </Link>
  );
}
