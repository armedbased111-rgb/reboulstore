interface ProfileInfoFieldProps {
  label: string;
  value: string | number;
  spacing?: 'normal' | 'tight';
}

export const ProfileInfoField = ({ label, value, spacing = 'normal' }: ProfileInfoFieldProps) => (
  <div className={spacing === 'normal' ? 'space-y-1' : 'space-y-[5.5px]'}>
    <label className="block font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase text-[#4a5565]">
      {label}
    </label>
    <p className="font-[Geist] text-[16px] leading-[24px]">{value}</p>
  </div>
);
