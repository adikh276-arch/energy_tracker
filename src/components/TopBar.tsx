import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  title: string;
  showBack?: boolean;
  showCalendar?: boolean;
}

const TopBar = ({ title, showBack = false, showCalendar = false }: TopBarProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-5 py-4">
      <div className="w-10">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}
      </div>
      <h1 className="text-lg font-bold text-foreground">{title}</h1>
      <div className="w-10">
        {showCalendar && (
          <button
            onClick={() => navigate("/weekly")}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-secondary"
          >
            <Calendar className="h-5 w-5" />
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
