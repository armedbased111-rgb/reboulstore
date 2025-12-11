import { useState } from 'react';

export const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    country: 'France',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    postalCode: '',
    city: '',
    phone: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col items-start">
      <div className="flex flex-col items-start gap-[14px]">
        {/* Delivery title */}
        <div className="flex flex-col items-start">
          <span className="relative leading-[25.2px] font-medium text-base">Delivery</span>
        </div>

        {/* Form section */}
        <div className="flex flex-col items-start gap-[26px] text-sm text-[#707070]">
          {/* Country/Region */}
          <div className="flex flex-col items-start relative text-black">
            <div className="rounded-md bg-white border border-[#dedede] flex items-center justify-center py-[21.5px] pr-[30px] pl-[11px] min-h-[51px]">
              <div className="w-[460px] overflow-hidden flex-shrink-0 flex flex-col items-start">
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                  className="w-full bg-transparent border-0 outline-0 text-black"
                >
                  <option value="France">France</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>
            </div>
            <label className="absolute top-[7px] left-3 text-xs pointer-events-none">Country/Region</label>
            {/* Arrow icon */}
            <div className="absolute top-[28.49%] right-[1px] w-10 h-[42.94%] pointer-events-none">▼</div>
          </div>

          {/* First name & Last name */}
          <div className="flex items-start justify-center gap-[14px]">
            {/* First name */}
            <div className="w-[244.5px] flex flex-col items-start relative">
              <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
                <div className="w-[242.5px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                  <div className="overflow-hidden flex flex-col items-start">
                    <input
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                    />
                  </div>
                </div>
              </div>
              <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">First name</label>
            </div>

            {/* Last name */}
            <div className="w-[244.5px] flex flex-col items-start relative">
              <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
                <div className="w-[242.5px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                  <div className="overflow-hidden flex flex-col items-start">
                    <input
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                    />
                  </div>
                </div>
              </div>
              <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Last name</label>
            </div>
          </div>

          {/* Company (optional) */}
          <div className="flex flex-col items-start relative">
            <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
              <div className="w-[501px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                <div className="overflow-hidden flex flex-col items-start">
                  <input
                    type="text"
                    placeholder="Company (optional)"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                  />
                </div>
              </div>
            </div>
            <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Company (optional)</label>
          </div>

          {/* Address */}
          <div className="flex flex-col items-start relative">
            <div className="h-[51px] relative rounded-md bg-white border border-[#dedede]">
              <div className="absolute top-[1px] left-[1px] rounded-l-md w-[501px] overflow-hidden flex flex-col items-start py-4 pr-[29px] pl-[11px]">
                <div className="overflow-hidden flex flex-col items-start">
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                  />
                </div>
              </div>
              {/* Search icon */}
              <div className="absolute top-[16.5px] right-[1px] w-[18px] h-[18px] pointer-events-none">🔍</div>
            </div>
            <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Address</label>
          </div>

          {/* Apartment (optional) */}
          <div className="flex flex-col items-start relative">
            <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
              <div className="w-[501px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                <div className="overflow-hidden flex flex-col items-start">
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => handleChange('apartment', e.target.value)}
                    className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                  />
                </div>
              </div>
            </div>
            <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Apartment, suite, etc. (optional)</label>
          </div>

          {/* Postal code & City */}
          <div className="flex items-start justify-center gap-[14px]">
            {/* Postal code */}
            <div className="w-[244.5px] flex flex-col items-start">
              <div className="flex flex-col items-start relative">
                <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
                  <div className="w-[242.5px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                    <div className="overflow-hidden flex flex-col items-start">
                      <input
                        type="text"
                        placeholder="Postal code"
                        value={formData.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                      />
                    </div>
                  </div>
                </div>
                <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Postal code</label>
              </div>
            </div>

            {/* City */}
            <div className="w-[244.5px] flex flex-col items-start relative">
              <div className="rounded-md bg-white border border-[#dedede] flex flex-col items-start">
                <div className="w-[242.5px] rounded-md overflow-hidden flex flex-col items-start py-4 px-[11px]">
                  <div className="overflow-hidden flex flex-col items-start">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                    />
                  </div>
                </div>
              </div>
              <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">City</label>
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-start relative">
            <div className="rounded-md bg-white border border-[#dedede] flex items-center justify-center">
              <div className="w-[472px] rounded-l-md overflow-hidden flex-shrink-0 flex flex-col items-start py-4 px-[11px]">
                <div className="overflow-hidden flex flex-col items-start">
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full bg-transparent border-0 outline-0 text-black placeholder:text-black/56"
                  />
                </div>
              </div>
              {/* Info icon */}
              <div className="w-[29px] h-[18px] pointer-events-none">ℹ️</div>
            </div>
            <label className="absolute top-[10px] left-3 opacity-0 text-xs pointer-events-none">Phone</label>
          </div>
        </div>
      </div>
    </div>
  );
};
