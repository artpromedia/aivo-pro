import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const footerNavigation = {
  product: [
    { name: 'Features', href: '/features' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'AIVO Pad', href: '/aivo-pad' },
    { name: 'Enterprise', href: '/products/enterprise' },
    { name: 'School Districts', href: '/products/school-districts' },
    { name: 'API Access', href: '/products/api' },
  ],
  education: [
    { name: 'For Educators', href: '/education/educators' },
    { name: 'For Parents', href: '/education/parents' },
    { name: 'For Students', href: '/education/students' },
    { name: 'Research', href: '/education/research' },
  ],
  support: [
    { name: 'Help Center', href: '/support/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Documentation', href: '/support/documentation' },
    { name: 'System Status', href: '/support/status' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Blog', href: '/company/blog' },
    { name: 'Careers', href: '/company/careers' },
    { name: 'Press', href: '/company/press' },
    { name: 'Tech Stack', href: '/tech-stack' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'FERPA Compliance', href: '/legal/ferpa' },
    { name: 'COPPA Compliance', href: '/legal/coppa' },
  ],
};

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/aivolearning', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/aivolearning', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/aivolearning', icon: Instagram },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-20 sm:pt-24 lg:px-8 lg:pt-32">
        {/* Main navigation */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 xl:col-span-2">
            {/* Product */}
            <div>
              <h3 className="text-sm font-semibold leading-6 text-white">Product</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.product.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Education */}
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm font-semibold leading-6 text-white">Education</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.education.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="mt-10 md:mt-0">
              <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="mt-10 lg:mt-0">
              <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
              <ul role="list" className="mt-6 space-y-4">
                {footerNavigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link 
                      to={item.href}
                      className="text-sm leading-6 text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-10 xl:mt-0">
            <h3 className="text-sm font-semibold leading-6 text-white">
              Subscribe to our newsletter
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              Get the latest updates about new features and educational insights.
            </p>
            <form className="mt-6 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:w-64 sm:text-sm sm:leading-6 xl:w-full"
                placeholder="Enter your email"
              />
              <div className="mt-4 sm:ml-4 sm:mt-0 sm:shrink-0">
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                >
                  Subscribe
                </Button>
              </div>
            </form>

            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <h4 className="text-sm font-semibold leading-6 text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm leading-6 text-gray-300">
                  <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <div>
                    1400 Van Buren St. Suite 200<br />
                    Minneapolis, MN 55413
                  </div>
                </li>
                <li className="flex items-center gap-2 text-sm leading-6 text-gray-300">
                  <Mail className="w-4 h-4" />
                  support@aivolearning.com
                </li>
                <li className="flex items-center gap-2 text-sm leading-6 text-gray-300">
                  <Phone className="w-4 h-4" />
                  1-800-AIVO-LEARN
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 md:flex md:items-center md:justify-between lg:mt-24">
          <div className="flex space-x-6 md:order-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:order-1 md:mt-0 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
                  <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
                  <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
                  <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/>
                  <path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
                  <path d="M19.938 10.5a4 4 0 0 1 .585.396"/>
                  <path d="M6 18a4 4 0 0 1-1.967-.516"/>
                  <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-white">AIVO Learning</span>
            </div>
            <p className="text-xs leading-5 text-gray-400">
              &copy; 2024 AIVO Learning Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
