import "./layout.css";

function PrimaryPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="primary-page-layout" className="flex-column w-100 h-100 overflow-hidden">
      {children}
    </div>
  );
}

export default PrimaryPageLayout;
