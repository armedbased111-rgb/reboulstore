import { useState } from 'react';
import { Link } from 'react-router-dom';

export const ContactForm = () => {
  const [email, setEmail] = useState('');
  const [newsletter, setNewsletter] = useState(true);

  return (
    <div className="flex flex-col items-start pt-[9px] text-left text-[21px] text-black">
      <div className="flex flex-col items-start gap-[14px]">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-x-5">
          <span className="relative leading-[25.2px] font-medium">Contact</span>
          <Link to="/login" className="rounded-md flex flex-col items-start text-sm">
            <span className="relative underline leading-[21px]">Sign in</span>
          </Link>
        </div>

        {/* Form fields */}
        <div className="flex flex-col items-start gap-[14px] text-sm text-[#707070]">
          {/* Email input */}
          <div className="flex flex-col items-start relative">
            <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
              <div className="w-[501px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                <div className="overflow-hidden flex flex-col items-start">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                  />
                </div>
              </div>
            </div>
            <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Email</label>
          </div>

          {/* Newsletter checkbox */}
          <div className="flex items-start relative text-black">
            <div className="h-[19px] w-[18px] flex flex-col items-start justify-center py-[1px] pl-[1px] relative">
              <div className={`w-[18px] flex-1 rounded border border-[#dedede] bg-white overflow-hidden flex flex-col items-start justify-center ${newsletter ? 'border-[#592ff4]' : ''}`}>
                <div className="flex-1 rounded-sm bg-transparent opacity-30"></div>
              </div>
              {newsletter && (
                <div className="absolute top-[5px] left-[5px] w-[10px] h-[10px] bg-[#592ff4] rounded-sm"></div>
              )}
            </div>
            <div className="flex flex-col items-start pl-[11px] max-w-[503px]">
              <span className="leading-[21px]">Email me with news and offers</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rectangle spacer */}
      <div className="h-[14px]"></div>
    </div>
  );
};
