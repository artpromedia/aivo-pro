import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, User, Clock, Award, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useChildren } from '../../hooks/useChildren';
import { ChildCard } from '../../components/ChildCard';
import { Button } from '@aivo/ui';

export const ChildrenIndex: React.FC = () => {
  const { children, isLoading } = useChildren();

  return (
    <div className="p-8">
      <div className="container mx-auto max-w-6xl">

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Your Children
            </h1>
            <p className="text-gray-600">
              Manage your children's profiles and track their learning progress
            </p>
          </div>
          
          <Link 
            to="/children/add" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-coral-500 to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-coral-500/25 transition-all duration-300 hover:scale-105 hover:from-coral-600 hover:to-purple-600 border border-white/20 backdrop-blur-sm"
          >
            <Plus className="w-6 h-6" />
            Add Child
          </Link>
        </motion.div>

        {/* Stats Overview */}
        {children && children.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-coral-100 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-coral-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Children</p>
                  <p className="text-2xl font-bold text-gray-900">{children.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(children.reduce((sum, child) => sum + child.progress.overall, 0) / children.length)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hours This Week</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {children.reduce((sum, child) => sum + child.weeklyStats.hoursLearned, 0).toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills Mastered</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {children.reduce((sum, child) => sum + child.weeklyStats.skillsMastered, 0)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Children Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : children?.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm p-12 text-center rounded-3xl shadow-lg border-2 border-dashed border-coral-200"
          >
            <div className="w-16 h-16 bg-aivo-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Add Your First Child
            </h3>
            <p className="text-gray-600 mb-6">
              Start by adding your child's profile to create their personalized AI learning experience
            </p>
            <Button variant="gradient" asChild>
              <Link to="/children/add">
                Add Child Profile
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {children?.map((child) => (
              <ChildCard key={child.id} child={child} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};