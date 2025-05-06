import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  subtitle?: string;
  linkTo?: string;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon, 
  change,
  subtitle,
  linkTo,
  className = ''
}) => {
  const { language } = useAppContext();
  const isPositiveChange = change && !change.startsWith('-');
  const isRtl = language === 'he';
  
  const cardContent = (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 rounded-full bg-indigo-50">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        {change && (
          <p className="mt-1 text-sm text-gray-600">
            <span className={`font-medium ${
              parseFloat(change) < 0 
                ? 'text-green-600' 
                : parseFloat(change) > 0 
                  ? 'text-red-600' 
                  : 'text-gray-600'
            }`}>
              {parseFloat(change) < 0 ? '↓' : parseFloat(change) > 0 ? '↑' : ''}
              {change}
            </span>
          </p>
        )}
      </div>
    </>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className={`card p-5 hover:shadow-md transition-shadow ${className}`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={`card p-5 ${className}`}>
      {cardContent}
    </div>
  );
};

export default DashboardCard;