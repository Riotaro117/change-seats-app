interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean; // ?を示すことでない場合もあるよ→nullでもいい
}

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...props }) => {
  return (
    <button
      className="cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 bg-wood-600 text-white hover:bg-wood-700 shadow-wood-800/20 w-full py-3 text-lg"
      disabled={isLoading || props.disabled}
    >
      {children}
    </button>
  );
};

export default Button;
