import { Skeleton } from '@mui/material';

const CustomerFormSkeleton = () => {
  return (
    <div className="bg-gray-100 p-4 md:p-12 lg:p-24 text-black">
      <div className="w-full xl:w-4/5 mx-auto p-10 bg-white border-gray-100 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="col-span-1 flex flex-col gap-6">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1 flex flex-col items-start">
              <Skeleton variant="text" width="100%" height={30} />
            </div>
            <div className="col-span-1 flex flex-col items-start">
              <Skeleton variant="text" width="100%" height={30} />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>

          {/* City */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>

          {/* Phone */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-6">
          {/* WhatsApp */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>

          {/* Wedding Date */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>

          {/* Wedding Location */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>

          {/* Type (Client/Prospect) */}
          <div className="flex flex-col items-start">
            <Skeleton variant="text" width="100%" height={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFormSkeleton;
