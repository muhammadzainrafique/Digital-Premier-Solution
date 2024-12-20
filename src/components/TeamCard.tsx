import Image from 'next/image';
import { TeamType } from '@/types/teamTypes';

interface TeamCardProps {
  member: TeamType;
}

export default function TeamCard({ member }: TeamCardProps) {
  return (
    <div className="relative max-w-[332px] max-h-[480px] w-[290px] h-[420px] sm:h-[400px] md:h-[360px] lg:h-[480px]">
      <Image
        src={member.image} // Dynamically use the member's image
        alt={member.name}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
      <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-center p-2">
        <h1 className="text-[20px] sm:text-[22px] md:text-[24px] text-white">
          {member.name}
        </h1>
        <p className="text-[16px] sm:text-[17px] md:text-[18px] text-white">
          {member.role}
        </p>
      </div>
    </div>
  );
}
