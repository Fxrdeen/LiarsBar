import { Button } from "@/components/ui/button";

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold font-cinzel-decorative text-amber-500">
          Liar's Bar
        </h1>
        <Button
          onClick={onLoginClick}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          Login
        </Button>
      </div>
    </nav>
  );
}
