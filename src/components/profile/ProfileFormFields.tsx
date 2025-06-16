
import { Input } from "@/components/ui/input";

interface ProfileFormFieldsProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  email: string;
}

export const ProfileFormFields = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email
}: ProfileFormFieldsProps) => {
  return (
    <>
      {/* Name Fields */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            First Name
          </label>
          <Input
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            maxLength={30}
            placeholder="Enter your first name"
            className="rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-700/50"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Last Name
          </label>
          <Input
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            maxLength={30}
            placeholder="Enter your last name"
            className="rounded-xl border-2 border-gray-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 transition-colors duration-200 bg-white/50 dark:bg-gray-700/50"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
          Email Address
        </label>
        <Input
          value={email}
          readOnly
          className="rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
          type="email"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          🔒 Email cannot be changed for security reasons
        </p>
      </div>
    </>
  );
};
