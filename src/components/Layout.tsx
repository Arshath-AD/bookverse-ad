
import Navbar from './Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background doodles container */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M10 10 Q 50 50 90 10\' stroke=\'black\' fill=\'none\' stroke-width=\'2\'/%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'5\' fill=\'black\'/%3E%3C/svg%3E")',
             backgroundSize: '200px 200px'
           }}>
      </div>
      <Navbar />
      <main className="flex-grow z-10 w-full max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
