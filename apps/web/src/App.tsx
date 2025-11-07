import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@aivo/auth';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home'
import { Features } from './pages/Features'
import { Pricing } from './pages/Pricing'
import { HowItWorks } from './pages/HowItWorks'
import { Contact } from './pages/Contact'
import { AivoPad } from './pages/AivoPad'
import { AboutUs } from './pages/AboutUs'
import { TechStack } from './pages/TechStack'
import { ResumeSubmission } from './pages/ResumeSubmission'

// Legal Pages
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy'
import { TermsOfService } from './pages/legal/TermsOfService'
import FERPACompliance from './pages/legal/FERPACompliance'
import COPPACompliance from './pages/legal/COPPACompliance'

// Support Pages
import { HelpCenter } from './pages/support/HelpCenter'
import Documentation from './pages/support/Documentation'
import SystemStatus from './pages/support/SystemStatus'
import Downloads from './pages/support/Downloads'
import Community from './pages/support/Community'

// Education Pages
import { ForEducators } from './pages/education/ForEducators'
import { ForParents } from './pages/education/ForParents'
import { ForStudents } from './pages/education/ForStudents'
import Webinars from './pages/education/Webinars'

// Company Pages
import { Careers } from './pages/company/Careers'
import { Press } from './pages/company/Press'
import { Blog } from './pages/company/Blog'
import CaseStudies from './pages/company/CaseStudies'
import Investors from './pages/company/Investors'

// Product Pages
import { Enterprise } from './pages/products/Enterprise'
import { APIAccess } from './pages/products/APIAccess'
import SchoolDistricts from './pages/products/SchoolDistricts'
import Integrations from './pages/products/Integrations'

// Auth Pages
import AuthPage from './pages/auth/AuthPage'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="aivo-pad" element={<AivoPad />} />
            <Route path="how-it-works" element={<HowItWorks />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="tech-stack" element={<TechStack />} />
            <Route path="submit-resume" element={<ResumeSubmission />} />
            
            {/* Legal Routes */}
            <Route path="legal/privacy" element={<PrivacyPolicy />} />
            <Route path="legal/terms" element={<TermsOfService />} />
            <Route path="legal/ferpa" element={<FERPACompliance />} />
            <Route path="legal/coppa" element={<COPPACompliance />} />
            
            {/* Support Routes */}
            <Route path="support/help" element={<HelpCenter />} />
            <Route path="support/documentation" element={<Documentation />} />
            <Route path="support/status" element={<SystemStatus />} />
            <Route path="support/downloads" element={<Downloads />} />
            <Route path="support/community" element={<Community />} />
            
            {/* Education Routes */}
            <Route path="education/educators" element={<ForEducators />} />
            <Route path="education/parents" element={<ForParents />} />
            <Route path="education/students" element={<ForStudents />} />
            <Route path="education/webinars" element={<Webinars />} />
            
            {/* Company Routes */}
            <Route path="company/careers" element={<Careers />} />
            <Route path="company/press" element={<Press />} />
            <Route path="company/blog" element={<Blog />} />
            <Route path="company/case-studies" element={<CaseStudies />} />
            <Route path="company/investors" element={<Investors />} />
            
            {/* Product Routes */}
            <Route path="products/enterprise" element={<Enterprise />} />
            <Route path="products/api" element={<APIAccess />} />
            <Route path="products/school-districts" element={<SchoolDistricts />} />
            <Route path="products/integrations" element={<Integrations />} />
            
            {/* Auth Routes */}
            <Route path="auth/*" element={<AuthPage />} />
            <Route path="login" element={<AuthPage />} />
            <Route path="signup" element={<AuthPage />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
