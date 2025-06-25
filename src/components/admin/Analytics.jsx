import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Code,
  Terminal,
  Database,
  Cpu,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Datos mock para análisis
const mockAnalytics = {
  // Productos más vendidos
  topProducts: [
    { id: 1, name: 'Chaleco de Alpaca', category: 'Chalecos', sales: 245, revenue: 36750, growth: 12.5, rating: 4.8 },
    { id: 2, name: 'Suéter de Alpaca', category: 'Suéteres', sales: 198, revenue: 39600, growth: 8.3, rating: 4.7 },
    { id: 3, name: 'Abrigo de Alpaca', category: 'Abrigos', sales: 156, revenue: 54600, growth: 15.2, rating: 4.9 },
    { id: 4, name: 'Poncho de Alpaca', category: 'Ponchos', sales: 134, revenue: 24120, growth: -2.1, rating: 4.6 },
    { id: 5, name: 'Cárdigan de Alpaca', category: 'Cárdigans', sales: 123, revenue: 27060, growth: 6.7, rating: 4.5 }
  ],

  // Categorías más vendidas
  topCategories: [
    { name: 'Suéteres', sales: 456, revenue: 91200, growth: 18.5, marketShare: 35.2 },
    { name: 'Chalecos', sales: 389, revenue: 58350, growth: 12.3, marketShare: 28.1 },
    { name: 'Abrigos', sales: 234, revenue: 81900, growth: 22.1, marketShare: 18.9 },
    { name: 'Ponchos', sales: 198, revenue: 35640, growth: -5.2, marketShare: 12.3 },
    { name: 'Cárdigans', sales: 156, revenue: 34320, growth: 8.7, marketShare: 5.5 }
  ],

  // Categorías menos vendidas
  lowCategories: [
    { name: 'Bufandas', sales: 45, revenue: 2700, growth: -15.3, marketShare: 1.2 },
    { name: 'Gorros', sales: 67, revenue: 3015, growth: -8.9, marketShare: 2.1 },
    { name: 'Guantes', sales: 34, revenue: 1700, growth: -12.4, marketShare: 0.8 },
    { name: 'Medias', sales: 89, revenue: 2670, growth: -3.2, marketShare: 2.8 },
    { name: 'Faldas', sales: 23, revenue: 3450, growth: -20.1, marketShare: 0.6 }
  ],

  // Tendencia de ventas mensual
  monthlyTrends: [
    { month: 'Ene', sales: 1200, revenue: 180000, orders: 156 },
    { month: 'Feb', sales: 1350, revenue: 202500, orders: 178 },
    { month: 'Mar', sales: 1420, revenue: 213000, orders: 189 },
    { month: 'Abr', sales: 1380, revenue: 207000, orders: 182 },
    { month: 'May', sales: 1520, revenue: 228000, orders: 201 },
    { month: 'Jun', sales: 1680, revenue: 252000, orders: 224 },
    { month: 'Jul', sales: 1750, revenue: 262500, orders: 233 },
    { month: 'Ago', sales: 1890, revenue: 283500, orders: 251 },
    { month: 'Sep', sales: 2010, revenue: 301500, orders: 268 },
    { month: 'Oct', sales: 2180, revenue: 327000, orders: 291 },
    { month: 'Nov', sales: 2340, revenue: 351000, orders: 312 },
    { month: 'Dic', sales: 2680, revenue: 402000, orders: 357 }
  ],

  // Preferencias de clientes
  customerPreferences: {
    ageGroups: [
      { group: '18-25', percentage: 15, growth: 8.5 },
      { group: '26-35', percentage: 32, growth: 12.3 },
      { group: '36-45', percentage: 28, growth: 6.7 },
      { group: '46-55', percentage: 18, growth: -2.1 },
      { group: '55+', percentage: 7, growth: -5.4 }
    ],
    genderPreference: [
      { gender: 'Mujeres', percentage: 68, growth: 15.2 },
      { gender: 'Hombres', percentage: 32, growth: 8.7 }
    ],
    colorPreferences: [
      { color: 'Negro', percentage: 35, growth: 12.5 },
      { color: 'Gris', percentage: 25, growth: 8.9 },
      { color: 'Beige', percentage: 20, growth: 15.3 },
      { color: 'Marrón', percentage: 15, growth: 6.2 },
      { color: 'Otros', percentage: 5, growth: -3.1 }
    ]
  },

  // Métricas de rendimiento
  performanceMetrics: {
    conversionRate: 3.2,
    averageOrderValue: 150.50,
    customerLifetimeValue: 450.75,
    returnRate: 2.1,
    customerSatisfaction: 4.7,
    repeatPurchaseRate: 68.5
  },

  marketTrends: {
    seasonalTrends: [
      { season: 'Primavera', growth: 25.3, topProduct: 'Chalecos ligeros' },
      { season: 'Verano', growth: -15.2, topProduct: 'Ponchos finos' },
      { season: 'Otoño', growth: 45.7, topProduct: 'Suéteres' },
      { season: 'Invierno', growth: 78.9, topProduct: 'Abrigos' }
    ],
    emergingTrends: [
      { trend: 'Sostenibilidad', growth: 156.7, impact: 'Alto' },
      { trend: 'Personalización', growth: 89.3, impact: 'Medio' },
      { trend: 'Comercio electrónico', growth: 234.1, impact: 'Alto' },
      { trend: 'Moda slow', growth: 67.8, impact: 'Medio' }
    ]
  }
};

const MetricCard = ({ title, value, change, icon: Icon, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-pink-500",
    purple: "from-purple-500 to-indigo-500",
    yellow: "from-yellow-500 to-orange-500"
  };

  const bgGradients = {
    blue: "bg-gradient-to-br from-blue-50 to-cyan-50",
    green: "bg-gradient-to-br from-green-50 to-emerald-50",
    red: "bg-gradient-to-br from-red-50 to-pink-50",
    purple: "bg-gradient-to-br from-purple-50 to-indigo-50",
    yellow: "bg-gradient-to-br from-yellow-50 to-orange-50"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6 ${bgGradients[color]}`}
    >
      {/* Efecto de terminal */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-30"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm text-gray-600 font-mono">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              {change > 0 ? (
                <ArrowUpRight size={16} className="text-green-600" />
              ) : (
                <ArrowDownRight size={16} className="text-red-600" />
              )}
              <span className={`text-sm font-mono ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      
      {/* Efecto de scanlines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-100/20 to-transparent opacity-20"></div>
    </motion.div>
  );
};

const TopProductsTable = ({ products }) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
      {/* Header con estilo terminal */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
          <Award size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 font-mono">TOP_PRODUCTS</h3>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">PRODUCT</th>
              <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">CATEGORY</th>
              <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">SALES</th>
              <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">REVENUE</th>
              <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">GROWTH</th>
              <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">RATING</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border border-gray-200">
                      <span className="text-sm font-mono text-gray-700">{index + 1}</span>
                    </div>
                    <span className="font-mono text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm font-mono text-gray-600">{product.category}</td>
                <td className="py-3 px-4 text-sm font-mono text-gray-900">{product.sales}</td>
                <td className="py-3 px-4 text-sm font-mono text-green-600">S/ {product.revenue.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-mono ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-mono text-gray-900">{product.rating}</span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CategoryAnalysis = ({ topCategories, lowCategories }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Categorías más vendidas */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">TOP_CATEGORIES</h3>
        </div>
        <div className="space-y-4">
          {topCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-mono text-white">{index + 1}</span>
                </div>
                <div>
                  <p className="font-mono text-gray-900">{category.name}</p>
                  <p className="text-sm font-mono text-gray-600">{category.sales} units</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-green-600">S/ {category.revenue.toLocaleString()}</p>
                <p className={`text-sm font-mono ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.growth > 0 ? '+' : ''}{category.growth}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Categorías menos vendidas */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
            <TrendingDown size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">LOW_CATEGORIES</h3>
        </div>
        <div className="space-y-4">
          {lowCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-mono text-white">{index + 1}</span>
                </div>
                <div>
                  <p className="font-mono text-gray-900">{category.name}</p>
                  <p className="text-sm font-mono text-gray-600">{category.sales} units</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-red-600">S/ {category.revenue.toLocaleString()}</p>
                <p className={`text-sm font-mono ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.growth > 0 ? '+' : ''}{category.growth}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CustomerPreferences = ({ preferences }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Grupos de edad */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Users size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">AGE_GROUPS</h3>
        </div>
        <div className="space-y-4">
          {preferences.ageGroups.map((group, index) => (
            <motion.div
              key={group.group}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-gray-600">{group.group}</span>
                <span className="text-sm font-mono text-gray-900">{group.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${group.percentage}%` }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preferencias por género */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
            <Heart size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">GENDER_PREF</h3>
        </div>
        <div className="space-y-4">
          {preferences.genderPreference.map((gender, index) => (
            <motion.div
              key={gender.gender}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="font-mono text-gray-900">{gender.gender}</span>
              <div className="text-right">
                <p className="font-mono text-gray-900">{gender.percentage}%</p>
                <p className={`text-sm font-mono ${gender.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {gender.growth > 0 ? '+' : ''}{gender.growth}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preferencias de color */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500">
            <Eye size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">COLOR_PREF</h3>
        </div>
        <div className="space-y-4">
          {preferences.colorPreferences.map((color, index) => (
            <motion.div
              key={color.color}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-gray-300"
                  style={{ 
                    backgroundColor: color.color === 'Negro' ? '#000' : 
                                   color.color === 'Gris' ? '#6B7280' :
                                   color.color === 'Beige' ? '#F5F5DC' :
                                   color.color === 'Marrón' ? '#8B4513' : '#D1D5DB'
                  }}
                ></div>
                <span className="text-sm font-mono text-gray-600">{color.color}</span>
              </div>
              <span className="text-sm font-mono text-gray-900">{color.percentage}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MarketTrends = ({ trends }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tendencias estacionales */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
            <Calendar size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">SEASONAL_TRENDS</h3>
        </div>
        <div className="space-y-4">
          {trends.seasonalTrends.map((season, index) => (
            <motion.div
              key={season.season}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-mono text-gray-900">{season.season}</h4>
                <span className={`text-sm font-mono ${season.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {season.growth > 0 ? '+' : ''}{season.growth}%
                </span>
              </div>
              <p className="text-sm font-mono text-gray-600">TOP: {season.topProduct}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tendencias emergentes */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 font-mono">EMERGING_TRENDS</h3>
        </div>
        <div className="space-y-4">
          {trends.emergingTrends.map((trend, index) => (
            <motion.div
              key={trend.trend}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-mono text-gray-900">{trend.trend}</h4>
                <span className="text-sm font-mono text-green-600">+{trend.growth}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-gray-600">IMPACT:</span>
                <span className={`px-2 py-1 text-xs font-mono rounded-lg border ${
                  trend.impact === 'Alto' ? 'bg-red-50 text-red-700 border-red-200' :
                  trend.impact === 'Medio' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                  'bg-green-50 text-green-700 border-green-200'
                }`}>
                  {trend.impact}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('12m');
  const [selectedView, setSelectedView] = useState('overview');

  const periods = [
    { id: '7d', label: '7 días' },
    { id: '30d', label: '30 días' },
    { id: '3m', label: '3 meses' },
    { id: '6m', label: '6 meses' },
    { id: '12m', label: '12 meses' }
  ];

  const views = [
    { id: 'overview', label: 'OVERVIEW', icon: BarChart3 },
    { id: 'products', label: 'PRODUCTS', icon: Package },
    { id: 'categories', label: 'CATEGORIES', icon: ShoppingBag },
    { id: 'customers', label: 'CUSTOMERS', icon: Users },
    { id: 'trends', label: 'TRENDS', icon: TrendingUp }
  ];

  const totalRevenue = mockAnalytics.monthlyTrends.reduce((sum, month) => sum + month.revenue, 0);
  const totalSales = mockAnalytics.monthlyTrends.reduce((sum, month) => sum + month.sales, 0);
  const totalOrders = mockAnalytics.monthlyTrends.reduce((sum, month) => sum + month.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
      {/* Header con estilo terminal */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Volver a Pedidos"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
            <BarChart3 size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-mono">ANALYTICS_DASHBOARD</h1>
            <p className="text-gray-600 font-mono text-sm">v1.0.0 - Real-time Data Analysis</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-mono flex items-center gap-2 shadow-lg">
            <Download size={16} />
            EXPORT_DATA
          </button>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="TOTAL_REVENUE"
          value={`S/ ${totalRevenue.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="TOTAL_SALES"
          value={totalSales.toLocaleString()}
          change={8.3}
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="TOTAL_ORDERS"
          value={totalOrders.toLocaleString()}
          change={15.2}
          icon={Package}
          color="purple"
        />
        <MetricCard
          title="AVG_ORDER_VALUE"
          value={`S/ ${avgOrderValue.toFixed(2)}`}
          change={-2.1}
          icon={Target}
          color="yellow"
        />
      </div>

      {/* Navegación de vistas */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setSelectedView(view.id)}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 flex items-center gap-2 ${
                selectedView === view.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border border-gray-200'
              }`}
            >
              <view.icon size={16} />
              {view.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido de la vista seleccionada */}
      <AnimatePresence mode="wait">
        {selectedView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <TopProductsTable products={mockAnalytics.topProducts.slice(0, 5)} />
            <CategoryAnalysis 
              topCategories={mockAnalytics.topCategories.slice(0, 3)} 
              lowCategories={mockAnalytics.lowCategories.slice(0, 3)} 
            />
          </motion.div>
        )}

        {selectedView === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TopProductsTable products={mockAnalytics.topProducts} />
          </motion.div>
        )}

        {selectedView === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CategoryAnalysis 
              topCategories={mockAnalytics.topCategories} 
              lowCategories={mockAnalytics.lowCategories} 
            />
          </motion.div>
        )}

        {selectedView === 'customers' && (
          <motion.div
            key="customers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CustomerPreferences preferences={mockAnalytics.customerPreferences} />
          </motion.div>
        )}

        {selectedView === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MarketTrends trends={mockAnalytics.marketTrends} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analytics; 