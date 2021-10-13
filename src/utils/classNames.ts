// eslint-disable-next-line arrow-body-style
const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(' ');
};

export default classNames;
