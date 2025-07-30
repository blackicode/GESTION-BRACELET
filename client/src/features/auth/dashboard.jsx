import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Activity, 
  Users, 
  Calendar, 
  Stethoscope, 
  TrendingUp, 
  Bell, 
  Search,
  Plus,
  ChevronRight,
  MapPin,
  Clock,
  Award,
  Globe,
  Zap,
  Shield,
  Star
} from 'lucide-react';

const DashboardMedecin = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      title: "Patients Actifs", 
      value: "2,847", 
      change: "+12%", 
      icon: Users, 
      color: "bg-gradient-to-r from-blue-500 to-cyan-500" 
    },
    { 
      title: "Consultations", 
      value: "156", 
      change: "+8%", 
      icon: Stethoscope, 
      color: "bg-gradient-to-r from-green-500 to-emerald-500" 
    },
    { 
      title: "Urgences", 
      value: "12", 
      change: "-3%", 
      icon: Heart, 
      color: "bg-gradient-to-r from-red-500 to-pink-500" 
    },
    { 
      title: "Satisfaction", 
      value: "98.5%", 
      change: "+2%", 
      icon: Star, 
      color: "bg-gradient-to-r from-yellow-500 to-orange-500" 
    }
  ];

  const recentActivities = [
    { patient: "Aminata Diallo", action: "Consultation cardiologique", time: "Il y a 15 min", status: "completed" },
    { patient: "Mamadou Bah", action: "Téléconsultation", time: "Il y a 32 min", status: "ongoing" },
    { patient: "Fatou Camara", action: "Suivi post-opératoire", time: "Il y a 1h", status: "scheduled" },
    { patient: "Alpha Condé", action: "Analyse médicale", time: "Il y a 2h", status: "completed" }
  ];

  const upcomingAppointments = [
    { time: "09:30", patient: "Dr. Mariama Sow", type: "Réunion équipe", priority: "high" },
    { time: "10:15", patient: "Ibrahim Touré", type: "Consultation", priority: "normal" },
    { time: "11:00", patient: "Aissatou Barry", type: "Télémédecine", priority: "normal" },
    { time: "14:30", patient: "Sékou Conté", type: "Urgence", priority: "high" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-red-600 bg-clip-text text-transparent">
                    ENTACIG
                  </h1>
                  <p className="text-xs text-slate-500">Espace Numérique Médical de Guinée</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher un patient..."
                  className="pl-10 pr-4 py-2 bg-slate-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 w-64"
                />
              </div>
              
              <button className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                    {notifications}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">Dr</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Dr. Mamadou Diallo</p>
                  <p className="text-xs text-slate-500">Cardiologue - Conakry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    Bienvenue, Dr. Diallo 👋
                  </h2>
                  <p className="text-white/90 mb-4">
                    Excellence médicale pour la Guinée et l'Afrique - {currentTime.toLocaleDateString('fr-FR', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>Conakry, Guinée</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="w-4 h-4" />
                      <span>Connecté mondialement</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Activity className="w-16 h-16 text-white animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Animated background elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-white/5 rounded-full animate-bounce"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-white/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-600 text-sm">{stat.title}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50">
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Activités Récentes</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                    <span>Voir tout</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50/50 rounded-xl hover:bg-slate-100/50 transition-colors duration-200">
                      <div className={`w-3 h-3 rounded-full ${
                        activity.status === 'completed' ? 'bg-green-500' :
                        activity.status === 'ongoing' ? 'bg-blue-500' : 'bg-yellow-500'
                      } animate-pulse`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{activity.patient}</p>
                        <p className="text-sm text-slate-600">{activity.action}</p>
                      </div>
                      <span className="text-xs text-slate-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Actions Rapides</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 transform hover:scale-105">
                  <Plus className="w-5 h-5" />
                  <span>Nouveau Patient</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 transform hover:scale-105">
                  <Calendar className="w-5 h-5" />
                  <span>Planifier RDV</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105">
                  <Activity className="w-5 h-5" />
                  <span>Téléconsultation</span>
                </button>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Prochains RDV</h3>
              <div className="space-y-3">
                {upcomingAppointments.map((appointment, index) => (
                  <div key={index} className={`p-3 rounded-xl border-l-4 ${
                    appointment.priority === 'high' ? 'border-red-500 bg-red-50/50' : 'border-blue-500 bg-blue-50/50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">{appointment.time}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {appointment.priority === 'high' ? 'Urgent' : 'Normal'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800">{appointment.patient}</p>
                    <p className="text-xs text-slate-600">{appointment.type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Guinea Health Stats */}
            <div className="bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Santé en Guinée</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Patients ENTACIG</span>
                  <span className="font-bold">15,432</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Médecins connectés</span>
                  <span className="font-bold">1,247</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Téléconsultations</span>
                  <span className="font-bold">8,956</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <p className="text-xs text-center">
                  🇬🇳 Innovation médicale pour l'Afrique et le monde
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardMedecin;