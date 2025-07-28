import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Heart, Home, Shield, Users, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company info */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                <Home className="text-white font-bold h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold text-primary">Nyumba</span>
                <span className="text-lg sm:text-xl font-bold text-serengeti-400">Link</span>
              </div>
            </div>
            <p className="text-gray-300 mb-4 sm:mb-6 max-w-md leading-relaxed text-sm sm:text-base">
              {t('footer.description')}
            </p>
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="text-sm sm:text-base">{t('footer.location')}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="tel:+255750929317" className="hover:text-primary transition-colors text-sm sm:text-base">
                  +255 750 929 317
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                <a href="mailto:info@nyumbalink.co.tz" className="hover:text-primary transition-colors text-sm sm:text-base break-all">
                  info@nyumbalink.co.tz
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white">{t('footer.importantPages')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary transition-colors flex items-center text-sm sm:text-base">
                  <Home className="h-4 w-4 mr-2" />
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-300 hover:text-primary transition-colors flex items-center text-sm sm:text-base">
                  <Users className="h-4 w-4 mr-2" />
                  {t('footer.searchHouses')}
                </Link>
              </li>
              <li>
                <Link to="/signup?type=landlord" className="text-gray-300 hover:text-primary transition-colors flex items-center text-sm sm:text-base">
                  <Award className="h-4 w-4 mr-2" />
                  {t('footer.becomeLandlord')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-primary transition-colors flex items-center text-sm sm:text-base">
                  <Shield className="h-4 w-4 mr-2" />
                  {t('footer.dashboard')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white">{t('footer.supportLegal')}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">
                  {t('footer.faq')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">
                  {t('footer.contactUs')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">
                  {t('footer.privacyPolicy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">
                  {t('footer.termsOfUse')}
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-primary transition-colors text-sm sm:text-base">
                  {t('footer.safetyGuidelines')}
                </a>
              </li>
            </ul>
          </div>

          {/* App Features */}
          <div>
            <h4 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-white">{t('footer.ourServices')}</h4>
            <ul className="space-y-2 sm:space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">{t('footer.easySearch')}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">{t('footer.directCommunication')}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">{t('footer.highSecurity')}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">{t('footer.customerService')}</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span className="text-sm sm:text-base">{t('footer.modernFilters')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* App Statistics */}
        <div className="border-t border-gray-800 py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">1000+</div>
              <div className="text-gray-400 text-xs sm:text-sm">{t('footer.registeredHouses')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">500+</div>
              <div className="text-gray-400 text-xs sm:text-sm">{t('footer.landlords')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">50+</div>
              <div className="text-gray-400 text-xs sm:text-sm">{t('footer.cities')}</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-primary mb-1">5000+</div>
              <div className="text-gray-400 text-xs sm:text-sm">{t('footer.users')}</div>
            </div>
          </div>
        </div>

        {/* Bottom section with creator info */}
        <div className="border-t border-gray-800 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="text-gray-300 text-xs sm:text-sm text-center sm:text-left">
              © {currentYear} Nyumba Link. {t('footer.rightsReserved')}
            </div>
            
            {/* Creator Attribution */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3 lg:space-x-4">
              <div className="flex items-center text-gray-300 text-xs sm:text-sm">
                <span>{t('footer.createdWith')}</span>
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mx-1 sm:mx-2 fill-current" />
                <span className="font-semibold text-primary">StarLabs AI</span>
              </div>
              
              <div className="hidden sm:block w-px h-4 bg-gray-600"></div>
              
              <div className="flex items-center text-gray-300 text-xs sm:text-sm">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <a href="tel:+255750929317" className="hover:text-primary transition-colors">
                  +255 750 929 317
                </a>
              </div>
            </div>
          </div>
          
          {/* Additional creator info */}
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-800">
            <div className="text-center">
              <p className="text-xs sm:text-sm text-gray-400 mb-2 px-4">
                {t('footer.aiDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;