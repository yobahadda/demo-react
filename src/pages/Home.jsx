import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Lock, Menu, X } from 'lucide-react';
import { WavyBackground } from '../components/ui/wavy-background.tsx';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-white bg-opacity-10 backdrop-blur-lg fixed w-full z-20 top-0 left-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">ChatConnect</span>
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X /> : <Menu />}
        </button>
        <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-gray-800 md:bg-transparent border-gray-700">
            <li><a href="#" className="block py-2 pl-3 pr-4 rounded md:p-0 text-white hover:text-blue-500" onClick={() => navigate('/')}>Accueil</a></li>
            <li><a href="#" className="block py-2 pl-3 pr-4 rounded md:p-0 text-white hover:text-blue-500" onClick={() => navigate('/features')}>Fonctionnalités</a></li>
            <li><a href="#" className="block py-2 pl-3 pr-4 rounded md:p-0 text-white hover:text-blue-500" onClick={() => navigate('/pricing')}>Tarifs</a></li>
            <li><a href="#" className="block py-2 pl-3 pr-4 rounded md:p-0 text-white hover:text-blue-500" onClick={() => navigate('/contact')}>Contact</a></li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="relative text-white py-8 mt-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none -top-2">
        <svg
          className="absolute bottom-0 w-full h-20 fill-current text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fillOpacity="1"
            d="M0,224L48,234.7C96,245,192,267,288,261.3C384,256,480,224,576,197.3C672,171,768,149,864,165.3C960,181,1056,235,1152,229.3C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="max-w-screen-xl mx-auto px-4 relative">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h5 className="text-xl font-bold mb-2">ChatConnect</h5>
            <p>Votre plateforme de messagerie sécurisée et intuitive.</p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Liens rapides</h5>
            <ul>
              <li><a href="#" className="hover:text-blue-500">Accueil</a></li>
              <li><a href="#" className="hover:text-blue-500">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-blue-500">Tarifs</a></li>
              <li><a href="#" className="hover:text-blue-500">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h5 className="text-lg font-semibold mb-2">Nous contacter</h5>
            <p>Email: support@chatconnect.com</p>
            <p>Téléphone: +33 1 23 45 67 89</p>
          </div>
          <div className="w-full md:w-1/4">
            <h5 className="text-lg font-semibold mb-2">Suivez-nous</h5>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-500">Facebook</a>
              <a href="#" className="hover:text-blue-500">Twitter</a>
              <a href="#" className="hover:text-blue-500">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 ChatConnect. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};


const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card bg-white bg-opacity-20 backdrop-blur-lg rounded-lg p-6 flex flex-col items-center text-center">
    <div className="icon text-4xl mb-4">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p>{description}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();

  const goToRegister = () => {
    navigate('/register');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <WavyBackground className="min-h-screen flex flex-col justify-between">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <header className="text-center mb-12 mt-24"> {/* Added mt-24 for spacing below the Navbar */}
          <h1 className="text-4xl font-bold mb-4 text-white">Bienvenue sur ChatConnect</h1>
          <p className="text-xl text-gray-200">Votre nouvelle plateforme de messagerie sécurisée et intuitive</p>
        </header>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<MessageCircle size={40} />}
            title="Messagerie instantanée"
            description="Communiquez en temps réel avec vos amis et collègues"
          />
          <FeatureCard
            icon={<Users size={40} />}
            title="Groupes de discussion"
            description="Créez et gérez facilement des conversations de groupe"
          />
          <FeatureCard
            icon={<Lock size={40} />}
            title="Sécurité renforcée"
            description="Vos messages sont protégés par un chiffrement de bout en bout"
          />
        </section>

        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-white">Pourquoi choisir ChatConnect ?</h2>
          <ul className="text-gray-200 space-y-2">
            <li>✓ Interface intuitive et moderne</li>
            <li>✓ Synchronisation sur tous vos appareils</li>
            <li>✓ Appels audio et vidéo HD</li>
            <li>✓ Partage de fichiers sécurisé</li>
            <li>✓ Personnalisation avancée</li>
          </ul>
        </section>

        <div className="text-center">
          <button className="btn-primary mr-4" onClick={goToRegister}>S'inscrire</button>
          <button className="btn-secondary" onClick={goToLogin}>Se connecter</button>
        </div>
      </main>

      <Footer />
    </WavyBackground>
  );
};

export default Home;
