// HomeLayout.tsx
import "./HomeLayout.css";

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="home-layout-wrapper">
      <div className="home-page">
        <div className="home-container-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}