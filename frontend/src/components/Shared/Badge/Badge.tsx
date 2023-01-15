import './Badge.less';

type BadgeProps = {
  number: number;
};

const Badge = ({number}: BadgeProps) => {
  return <div className="badge">{number}</div>;
};

export default Badge;
