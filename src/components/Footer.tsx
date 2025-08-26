import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Home, Shield, Users, Award, ExternalLink, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--safari-500)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--kilimanjaro-500)_0%,_transparent_50%)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {/* Company info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1 space-y-6">
            <div className="group">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-serengeti-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <Home className="text-white font-bold h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-serengeti-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-serengeti-400 bg-clip-text text-transparent">
                    Nyumba
                  </span>
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-serengeti-400 to-kilimanjaro-400 bg-clip-text text-transparent">
                    Link
                  </span>
              </div>
            </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              {t('footer.description')}
            </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <div className="group flex items-center text-gray-300 hover:text-primary transition-all duration-300">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm sm:text-base">{t('footer.location')}</span>
              </div>
              <div className="group flex items-center text-gray-300 hover:text-primary transition-all duration-300">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+255750929317" className="text-sm sm:text-base hover:underline">
                  +255 750 929 317
                </a>
              </div>
              <div className="group flex items-center text-gray-300 hover:text-primary transition-all duration-300">
                <div className="w-8 h-8 bg-gray-800/50 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:info@nyumbalink.co.tz" className="text-sm sm:text-base hover:underline break-all">
                  info@nyumbalink.co.tz
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg sm:text-xl mb-6 text-white relative">
              {t('footer.importantPages')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-primary to-serengeti-500 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { to: "/", icon: Home, label: t('footer.home') },
                { to: "/browse", icon: Users, label: t('footer.searchHouses') },
                { to: "/signup?type=landlord", icon: Award, label: t('footer.becomeLandlord') },
                { to: "/dashboard", icon: Shield, label: t('footer.dashboard') }
              ].map((item, index) => (
                <li key={index} className="group">
                  <Link 
                    to={item.to} 
                    className="flex items-center text-gray-300 hover:text-primary transition-all duration-300 group-hover:translate-x-1"
                  >
                    <item.icon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-sm sm:text-base">{item.label}</span>
                    <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </li>
              ))}
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg sm:text-xl mb-6 text-white relative">
              {t('footer.supportLegal')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-yellow-500 to-blue-500 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                { href: "#", label: t('footer.faq') },
                { href: "#", label: t('footer.contactUs') },
                { href: "#", label: t('footer.privacyPolicy') },
                { href: "#", label: t('footer.termsOfUse') },
                { href: "#", label: t('footer.safetyGuidelines') }
              ].map((item, index) => (
                <li key={index} className="group">
                  <a 
                    href={item.href} 
                    className="flex items-center text-gray-300 hover:text-yellow-400 transition-all duration-300 group-hover:translate-x-1"
                  >
                    <span className="text-sm sm:text-base">{item.label}</span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
                </a>
              </li>
              ))}
            </ul>
          </div>

          {/* App Features */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg sm:text-xl mb-6 text-white relative">
              {t('footer.ourServices')}
              <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
            </h4>
            <ul className="space-y-4">
              {[
                t('footer.easySearch'),
                t('footer.directCommunication'),
                t('footer.highSecurity'),
                t('footer.customerService'),
                t('footer.modernFilters')
              ].map((feature, index) => (
                <li key={index} className="flex items-start group">
                  <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mt-2.5 mr-3 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm sm:text-base text-gray-300 group-hover:text-green-400 transition-colors duration-300">{feature}</span>
              </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Statistics */}
        <div className="border-t border-gray-700/50 py-8 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { value: "1000+", label: t('footer.registeredHouses'), color: "from-primary to-serengeti-500" },
              { value: "500+", label: t('footer.landlords'), color: "from-kilimanjaro-500 to-safari-500" },
              { value: "50+", label: t('footer.cities'), color: "from-green-500 to-blue-500" },
              { value: "5000+", label: t('footer.users'), color: "from-yellow-500 to-blue-500" }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.value}
            </div>
                <div className="text-gray-400 text-xs sm:text-sm group-hover:text-gray-300 transition-colors duration-300">
                  {stat.label}
            </div>
            </div>
            ))}
          </div>
        </div>

        {/* Bottom section with creator info */}
        <div className="border-t border-gray-700/50 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Nyumba Link. {t('footer.rightsReserved')}
            </div>
            
            {/* Creator Attribution */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
              <div className="flex items-center text-gray-300 text-xs sm:text-sm group">
                <span>{t('footer.createdWith')}</span>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mx-2 fill-current group-hover:scale-110 transition-transform duration-300" />
                <span className="font-semibold text-primary group-hover:text-serengeti-400 transition-colors duration-300">StarLabs AI</span>
              </div>
              
              <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
              
              <div className="flex items-center text-gray-300 text-xs sm:text-sm group">
                <Phone className="h-3 w-3 mr-2 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <a href="tel:+255750929317" className="hover:text-primary transition-colors duration-300">
                  +255 750 929 317
                </a>
              </div>
            </div>
          </div>
          
          {/* Additional creator info */}
          <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-700/50">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-4 px-4 leading-relaxed">
                {t('footer.aiDescription')}
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>React & TypeScript</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Supabase</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Tailwind CSS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;