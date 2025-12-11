interface ProfileRoleBadgeProps {
  role: string;
}

export const ProfileRoleBadge = ({ role }: ProfileRoleBadgeProps) => (
  <div className="space-y-[5.5px]">
    <label className="block font-[Geist] font-medium text-[14px] leading-[20px] tracking-[0.35px] uppercase text-[#4a5565]">
      Rôle
    </label>
    <div className="inline-block bg-black px-3 py-1">
      <span className="font-[Geist] text-[12px] leading-[16px] tracking-[0.5px] uppercase text-white">
        {role}
      </span>
    </div>
  </div>
);
