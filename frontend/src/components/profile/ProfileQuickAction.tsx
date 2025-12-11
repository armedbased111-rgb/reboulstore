import { Link } from 'react-router-dom';

interface ProfileQuickActionProps {
  title: string;
  description: string;
  linkTo?: string;
  buttonText: string;
  disabled?: boolean;
}

export const ProfileQuickAction = ({ 
  title, 
  description, 
  linkTo, 
  buttonText, 
  disabled = false 
}: ProfileQuickActionProps) => (
  <div className="bg-white border border-black p-[25px] h-fit">
    <h3 className="font-[Geist] font-bold text-[16px] leading-[20px] tracking-[-0.3px] uppercase mb-2">
      {title}
    </h3>
    <p className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565] mb-4">
      {description}
    </p>
    
    {linkTo && !disabled ? (
      <Link to={linkTo}>
        <button className="w-full h-12 bg-transparent border border-black rounded-md font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase hover:bg-gray-50 transition-colors">
          {buttonText}
        </button>
      </Link>
    ) : (
      <button 
        disabled={disabled}
        className="w-full h-12 bg-transparent border border-black rounded-md font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase opacity-50 cursor-not-allowed"
      >
        {buttonText}
      </button>
    )}
  </div>
);
