import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Server,
  Database,
  Shield,
  Smartphone,
  Globe,
  Activity
} from 'lucide-react';

type SystemStatusType = 'operational' | 'degraded' | 'outage';

const SystemStatus: React.FC = () => {
  const [currentStatus] = React.useState<SystemStatusType>('operational');
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (email.trim()) {
      // Handle subscription logic here
      console.log('Subscribing email:', email);
      alert('Successfully subscribed to status updates!');
      setEmail('');
    } else {
      alert('Please enter a valid email address');
    }
  };

  const services = [
    {
      name: 'Learning Platform',
      description: 'Core learning application and student portal',
      status: 'operational',
      uptime: '99.98%',
      lastIncident: null
    },
    {
      name: 'Parent Portal',
      description: 'Parent dashboard and progress tracking',
      status: 'operational',
      uptime: '99.95%',
      lastIncident: null
    },
    {
      name: 'Teacher Portal',
      description: 'Teacher dashboard and classroom management',
      status: 'operational',
      uptime: '99.97%',
      lastIncident: null
    },
    {
      name: 'Authentication Service',
      description: 'Login and user authentication',
      status: 'operational',
      uptime: '99.99%',
      lastIncident: null
    },
    {
      name: 'Assessment Engine',
      description: 'AI-powered assessments and adaptive learning',
      status: 'operational',
      uptime: '99.93%',
      lastIncident: null
    },
    {
      name: 'Mobile Application',
      description: 'iOS and Android mobile applications',
      status: 'operational',
      uptime: '99.91%',
      lastIncident: null
    },
    {
      name: 'API Services',
      description: 'Third-party integrations and developer API',
      status: 'operational',
      uptime: '99.96%',
      lastIncident: null
    },
    {
      name: 'Data Analytics',
      description: 'Progress tracking and reporting systems',
      status: 'operational',
      uptime: '99.94%',
      lastIncident: null
    }
  ];

  const metrics = [
    {
      icon: Activity,
      label: 'Response Time',
      value: '127ms',
      trend: 'good',
      description: 'Average API response time'
    },
    {
      icon: Server,
      label: 'Uptime',
      value: '99.96%',
      trend: 'good',
      description: '30-day availability'
    },
    {
      icon: Database,
      label: 'Data Sync',
      value: '< 1s',
      trend: 'good',
      description: 'Real-time data synchronization'
    },
    {
      icon: Shield,
      label: 'Security',
      value: 'A+',
      trend: 'good',
      description: 'SSL Labs rating'
    }
  ];

  const incidents = [
    {
      date: '2024-01-15',
      title: 'Scheduled Maintenance - Database Optimization',
      status: 'resolved',
      duration: '2 hours',
      impact: 'No service interruption',
      description: 'Routine database maintenance to improve performance'
    },
    {
      date: '2024-01-08',
      title: 'Mobile App Update Deployment',
      status: 'resolved',
      duration: '30 minutes',
      impact: 'Brief API slowdown',
      description: 'Deployed mobile app updates with enhanced accessibility features'
    },
    {
      date: '2024-01-02',
      title: 'Load Balancer Configuration Update',
      status: 'resolved',
      duration: '15 minutes',
      impact: 'Minimal service disruption',
      description: 'Updated load balancer configuration for improved reliability'
    }
  ];

  const getStatusIcon = (status: SystemStatusType | string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: SystemStatusType | string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'outage':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallStatusColor = () => {
    switch (currentStatus) {
      case 'operational':
        return 'from-green-500 to-emerald-600';
      case 'degraded':
        return 'from-yellow-500 to-orange-600';
      case 'outage':
        return 'from-red-500 to-pink-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <section className={`py-20 px-6 bg-linear-to-r ${getOverallStatusColor()}`}>
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              {getStatusIcon(currentStatus)}
              <h1 className="text-4xl font-bold">System Status</h1>
            </div>
            <p className="text-xl opacity-90 mb-2">
              All systems operational
            </p>
            <p className="opacity-75">
              Last updated: {new Date().toLocaleString()}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <metric.icon className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
                <p className="font-medium text-gray-700 mb-1">{metric.label}</p>
                <p className="text-sm text-gray-500">{metric.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Service Status
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                    {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Uptime: <span className="font-medium">{service.uptime}</span></span>
                  {service.lastIncident && (
                    <span className="text-gray-500">Last incident: {service.lastIncident}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <motion.h2
            className="text-3xl font-bold text-gray-900 mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Recent Incidents & Maintenance
          </motion.h2>

          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <motion.div
                key={incident.title}
                className="bg-gray-50 rounded-xl p-6 border-l-4 border-gray-300"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{incident.title}</h3>
                    <p className="text-sm text-gray-500">{incident.date}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                    Resolved
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{incident.description}</p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Duration: </span>
                    <span className="font-medium">{incident.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Impact: </span>
                    <span className="font-medium">{incident.impact}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe for Updates */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Stay Updated on System Status
            </h2>
            <p className="text-gray-600 mb-8">
              Subscribe to receive notifications about planned maintenance and service disruptions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button 
                onClick={handleSubscribe}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SystemStatus;