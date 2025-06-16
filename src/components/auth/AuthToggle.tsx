
interface AuthToggleProps {
  isLogin: boolean;
  onToggle: () => void;
}

export const AuthToggle = ({ isLogin, onToggle }: AuthToggleProps) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={onToggle}
          className="ml-2 text-pink-600 hover:text-pink-700 dark:text-pink-400 dark:hover:text-pink-300 hover:underline font-medium"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};
