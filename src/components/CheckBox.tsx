/* eslint-disable react/jsx-props-no-spreading */
import React, { ComponentPropsWithoutRef, ReactNode } from 'react';

import clsx from 'clsx';

import styles from '../style/Button.module.css';

type Props = {
  children?: ReactNode;
} & ComponentPropsWithoutRef<'button'>;

const CheckBox: React.VFC<Props> = ({ children, className, ...rest }) => {
  const classes = clsx(className, styles.checkbutton);
  return (
    <>
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    </>
  );
};

export default CheckBox;
