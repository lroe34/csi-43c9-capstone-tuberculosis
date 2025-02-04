
export default function LoginLayout({ children }) {
  return (
    <div className="flex h-screen">      
      <div className="flex-1 overflow-auto p-5">{children}</div>
    </div>
  );
}
