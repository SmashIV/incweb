import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  DollarSign,
  ShoppingCart,
  Package,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  RefreshCw,
  ArrowLeft,
  Loader2,
  Terminal,
  ShoppingBag
} from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, color = "blue", subtitle = "vs last month" }) => {
  const colorClasses = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500", 
    purple: "from-purple-500 to-indigo-500",
    yellow: "from-yellow-500 to-orange-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-mono text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 font-mono">{value}</p>
          <div className="flex items-center gap-1 mt-2">
            <span className={`text-sm font-mono ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 font-mono">{subtitle}</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const TopProductsTable = ({ products, title = "TOP_PERFORMING_PRODUCTS" }) => (
  <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
    <div className="flex items-center gap-3 p-6 border-b border-gray-200">
      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
        <TrendingUp size={20} className="text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 font-mono">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">RANK</th>
            <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">PRODUCT</th>
            <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">CATEGORY</th>
            <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">SALES</th>
            <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">REVENUE</th>
            <th className="text-left py-3 px-4 text-sm font-mono text-gray-600">GROWTH</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <motion.tr
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="py-3 px-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-mono text-white">{index + 1}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span className="font-mono text-gray-900">{product.name}</span>
              </td>
              <td className="py-3 px-4 text-sm font-mono text-gray-600">{product.category}</td>
              <td className="py-3 px-4 text-sm font-mono text-gray-900">{product.sales.toLocaleString()}</td>
              <td className="py-3 px-4 text-sm font-mono text-green-600">S/ {product.revenue.toLocaleString()}</td>
              <td className="py-3 px-4">
                <span className={`text-sm font-mono ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const CategoryAnalysis = ({ topCategories, lowCategories, title = "CATEGORIES_BY_SALES" }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
          <TrendingUp size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 font-mono">TOP_CATEGORIES</h3>
      </div>
      <div className="p-6">
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
                  <p className="text-sm font-mono text-gray-600">{category.sales.toLocaleString()} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-green-600">S/ {category.revenue.toLocaleString()}</p>
                <p className={`text-sm font-mono ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
      <div className="flex items-center gap-3 p-6 border-b border-gray-200">
        <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
          <TrendingDown size={20} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 font-mono">LOW_CATEGORIES</h3>
      </div>
      <div className="p-6">
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
                  <p className="text-sm font-mono text-gray-600">{category.sales.toLocaleString()} units sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-red-600">S/ {category.revenue.toLocaleString()}</p>
                <p className={`text-sm font-mono ${category.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {category.growth > 0 ? '+' : ''}{category.growth.toFixed(1)}%
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const CustomerPreferences = ({ preferences }) => (
  <div className="space-y-6">
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 font-mono mb-6">CUSTOMER_PREFERENCES</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="font-mono text-gray-700 mb-4">AGE_GROUPS</h4>
          <div className="space-y-3">
            {preferences.ageGroups?.map((group, index) => (
              <div key={group.group} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-gray-900">{group.group}</span>
                <span className="font-mono text-blue-600">{group.percentage.toFixed(1)}%</span>
              </div>
            )) || <p className="text-gray-500 font-mono">No data available</p>}
          </div>
        </div>

        <div>
          <h4 className="font-mono text-gray-700 mb-4">GENDER_PREFERENCE</h4>
          <div className="space-y-3">
            {preferences.genderPreference?.map((gender, index) => (
              <div key={gender.gender} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-gray-900">{gender.gender}</span>
                <span className="font-mono text-purple-600">{gender.percentage.toFixed(1)}%</span>
              </div>
            )) || <p className="text-gray-500 font-mono">No data available</p>}
          </div>
        </div>

        <div>
          <h4 className="font-mono text-gray-700 mb-4">COLOR_PREFERENCES</h4>
          <div className="space-y-3">
            {preferences.colorPreferences?.map((color, index) => (
              <div key={color.color} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-gray-900">{color.color}</span>
                <span className="font-mono text-green-600">{color.percentage.toFixed(1)}%</span>
              </div>
            )) || <p className="text-gray-500 font-mono">No data available</p>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MarketTrends = ({ trends }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 font-mono mb-6">SEASONAL_TRENDS</h3>
        <div className="space-y-4">
          {trends.seasonalTrends?.map((trend, index) => (
            <div key={trend.season} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-mono text-gray-900">{trend.season}</p>
                <p className="text-sm font-mono text-gray-600">{trend.topProduct}</p>
              </div>
              <span className={`font-mono ${trend.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
              </span>
            </div>
          )) || <p className="text-gray-500 font-mono">No data available</p>}
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 font-mono mb-6">EMERGING_TRENDS</h3>
        <div className="space-y-4">
          {trends.emergingTrends?.map((trend, index) => (
            <div key={trend.trend} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-mono text-gray-900">{trend.trend}</p>
                <p className="text-sm font-mono text-gray-600">Impact: {trend.impact}</p>
              </div>
              <span className="font-mono text-blue-600">{trend.growth.toFixed(1)}%</span>
            </div>
          )) || <p className="text-gray-500 font-mono">No data available</p>}
        </div>
      </div>
    </div>
  </div>
);

const Analytics = () => {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedView, setSelectedView] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    topProducts: [],
    lowProducts: [],
    topCategories: [],
    lowCategories: [],
    topProductsBySales: [],
    lowProductsBySales: [],
    topCategoriesBySales: [],
    lowCategoriesBySales: [],
    totalRevenue: 0,
    totalSales: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    monthlyTrends: [],
    customerPreferences: {
      ageGroups: [],
      genderPreference: [],
      colorPreferences: []
    },
    performanceMetrics: {
      conversionRate: 0,
      averageOrderValue: 0,
      customerLifetimeValue: 0,
      returnRate: 0,
      customerSatisfaction: 0,
      repeatPurchaseRate: 0
    },
    marketTrends: {
      seasonalTrends: [],
      emergingTrends: []
    }
  });

  const getOrdersMetrics = (ordersData) => {
    if (!ordersData || ordersData.length === 0) {
      return {
        totalOrders: 0,
        totalRevenue: 0,
        totalSales: 0,
        avgOrderValue: 0
      };
    }

    const totalOrders = ordersData.length;
    const totalRevenue = ordersData
      .filter(order => order.estado === 'pagado')
      .reduce((sum, order) => sum + parseFloat(order.total_pago || 0), 0);
    const totalSales = ordersData
      .reduce((sum, order) => sum + (order.cantidad_total_productos || 0), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      totalSales,
      avgOrderValue
    };
  };

  const mapBackendData = (data) => {
    const productsByRevenue = [...(data.top_products || [])].sort((a, b) => b.revenue - a.revenue);
    
    const productsBySales = [...(data.top_products || [])].sort((a, b) => b.sales - a.sales);
    const lowProductsBySales = [...(data.low_products || [])].sort((a, b) => a.sales - b.sales);
    
    const categoriesBySales = [...(data.top_categories || [])].sort((a, b) => b.sales - a.sales);
    const lowCategoriesBySales = [...(data.low_categories || [])].sort((a, b) => a.sales - b.sales);
    
    const colorPreferencesByPercentage = [...(data.customer_preferences?.color_preferences || [])].sort((a, b) => b.percentage - a.percentage);
    
    return {
      topProducts: productsByRevenue,
      lowProducts: data.low_products || [],
      topCategories: data.top_categories || [],
      lowCategories: data.low_categories || [],
      
      topProductsBySales: productsBySales,
      lowProductsBySales: lowProductsBySales,
      
      topCategoriesBySales: categoriesBySales,
      lowCategoriesBySales: lowCategoriesBySales,
      
      totalRevenue: data.total_revenue || 0,
      totalSales: data.total_sales || 0,
      totalOrders: data.total_orders || 0,
      avgOrderValue: data.avg_order_value || 0,
      monthlyTrends: data.monthly_trends || [],
      customerPreferences: {
        ageGroups: data.customer_preferences?.age_groups || [],
        genderPreference: data.customer_preferences?.gender_preference || [],
        colorPreferences: colorPreferencesByPercentage
      },
      performanceMetrics: {
        conversionRate: data.performance_metrics?.conversion_rate || 0,
        averageOrderValue: data.performance_metrics?.average_order_value || 0,
        customerLifetimeValue: data.performance_metrics?.customer_lifetime_value || 0,
        returnRate: data.performance_metrics?.return_rate || 0,
        customerSatisfaction: data.performance_metrics?.customer_satisfaction || 0,
        repeatPurchaseRate: data.performance_metrics?.repeat_purchase_rate || 0
      },
      marketTrends: {
        seasonalTrends: data.market_trends?.seasonal_trends || [],
        emergingTrends: data.market_trends?.emerging_trends || []
      }
    };
  };

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const analyticsResponse = await axios.get('http://localhost:3000/admin/analytics', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          period: selectedPeriod,
          limit: 100 
        }
      });

      const ordersResponse = await axios.get('http://localhost:3000/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Analytics data from backend:', analyticsResponse.data);
      console.log('Orders data from backend:', ordersResponse.data);
      
      setOrders(ordersResponse.data);
      
      const mappedData = mapBackendData(analyticsResponse.data);
      
      const ordersMetrics = getOrdersMetrics(ordersResponse.data);
      
      const combinedData = {
        ...mappedData,
        totalOrders: ordersMetrics.totalOrders,
        totalRevenue: ordersMetrics.totalRevenue,
        totalSales: ordersMetrics.totalSales,
        avgOrderValue: ordersMetrics.avgOrderValue
      };
      
      console.log('Combined analytics data:', combinedData);
      setAnalyticsData(combinedData);
      
    } catch (error) {
      console.error('Analytics error:', error);
      let errorMessage = 'Error al obtener datos de analytics';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Token inválido o expirado. Por favor, inicia sesión nuevamente.';
        } else if (error.response.status === 404) {
          errorMessage = 'Endpoint de analytics no encontrado. Verifica la URL del servidor.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Error del servidor. Intenta más tarde.';
        } else {
          errorMessage = `Error ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:3000';
      } else {
        errorMessage = error.message || 'Error desconocido';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAnalyticsData();
    } else {
      setLoading(false);
    }
  }, [fetchAnalyticsData]);

  const periods = [
    { id: 'all', label: 'Todo el tiempo' },
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

  const handleAuthError = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/admin/login');
  }, [navigate]);

  const handleViewChange = useCallback((viewId) => {
    setSelectedView(viewId);
  }, []);

  const handlePeriodChange = useCallback((periodId) => {
    setSelectedPeriod(periodId);
  }, []);


  const handleRefresh = useCallback(() => {
    setError(null);
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 font-mono mb-2">CARGANDO_ANALYTICS...</p>
          <p className="text-sm text-gray-500 font-mono">
            PROCESANDO_DATOS_OPTIMIZADOS
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="p-3 rounded-xl bg-red-100 mb-4">
            <Terminal size={24} className="text-red-600 mx-auto" />
          </div>
          <p className="text-red-600 font-mono mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={handleRefresh}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-mono"
            >
              REINTENTAR
            </button>
            {error.includes('Token') || error.includes('401') ? (
              <button 
                onClick={handleAuthError}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-mono"
              >
                LIMPIAR_TOKEN
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">
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
            <p className="text-gray-600 font-mono text-sm">v1.0.0 - Optimized Data Analysis</p>
            <p className="text-gray-500 font-mono text-xs">* Métricas básicas desde órdenes reales</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.label}</option>
            ))}
          </select>
          <button 
            onClick={handleRefresh}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-mono flex items-center gap-2 shadow-lg"
          >
            <RefreshCw size={16} />
            REFRESH_DATA
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="TOTAL_REVENUE"
          value={`S/ ${(analyticsData.totalRevenue || 0).toLocaleString()}`}
          change={analyticsData.performanceMetrics?.conversionRate || 0}
          icon={DollarSign}
          color="green"
          subtitle="conversion rate"
        />
        <MetricCard
          title="TOTAL_SALES"
          value={(analyticsData.totalSales || 0).toLocaleString()}
          change={analyticsData.performanceMetrics?.repeatPurchaseRate || 0}
          icon={ShoppingCart}
          color="blue"
          subtitle="repeat purchase rate"
        />
        <MetricCard
          title="TOTAL_ORDERS"
          value={(analyticsData.totalOrders || 0).toLocaleString()}
          change={analyticsData.performanceMetrics?.customerSatisfaction || 0}
          icon={Package}
          color="purple"
          subtitle="customer satisfaction"
        />
        <MetricCard
          title="AVG_ORDER_VALUE"
          value={`S/ ${(analyticsData.avgOrderValue || 0).toFixed(2)}`}
          change={analyticsData.performanceMetrics?.returnRate || 0}
          icon={Target}
          color="yellow"
          subtitle="return rate"
        />
      </div>

      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-4 mb-8">
        <div className="flex flex-wrap gap-2">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => handleViewChange(view.id)}
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

      <AnimatePresence mode="wait">
        {selectedView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {analyticsData.topProducts.length > 0 ? (
              <TopProductsTable products={analyticsData.topProducts} title="TOP_PRODUCTS_BY_REVENUE" />
            ) : (
              <div className="text-center py-8 text-gray-500 font-mono bg-white rounded-xl border border-gray-200">
                NO_HAY_DATOS_DE_PRODUCTOS
              </div>
            )}
            {analyticsData.topCategories.length > 0 ? (
              <CategoryAnalysis 
                topCategories={analyticsData.topCategories} 
                lowCategories={analyticsData.lowCategories}
                title="CATEGORIES_BY_REVENUE"
              />
            ) : (
              <div className="text-center py-8 text-gray-500 font-mono bg-white rounded-xl border border-gray-200">
                NO_HAY_DATOS_DE_CATEGORIAS
              </div>
            )}
          </motion.div>
        )}

        {selectedView === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {analyticsData.topProductsBySales?.length > 0 ? (
              <TopProductsTable products={analyticsData.topProductsBySales} title="TOP_PRODUCTS_BY_SALES" />
            ) : (
              <div className="text-center py-8 text-gray-500 font-mono bg-white rounded-xl border border-gray-200">
                NO_HAY_DATOS_DE_PRODUCTOS
              </div>
            )}
            
            {analyticsData.lowProductsBySales?.length > 0 && (
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-pink-500">
                    <TrendingDown size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 font-mono">LOW_PERFORMING_PRODUCTS</h3>
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
                      </tr>
                    </thead>
                                          <tbody>
                        {analyticsData.lowProductsBySales.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center border border-red-200">
                                <span className="text-sm font-mono text-red-700">{index + 1}</span>
                              </div>
                              <span className="font-mono text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm font-mono text-gray-600">{product.category}</td>
                          <td className="py-3 px-4 text-sm font-mono text-gray-900">{product.sales.toLocaleString()}</td>
                          <td className="py-3 px-4 text-sm font-mono text-red-600">S/ {product.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`text-sm font-mono ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {product.growth > 0 ? '+' : ''}{product.growth.toFixed(1)}%
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {selectedView === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {analyticsData.topCategoriesBySales?.length > 0 ? (
              <CategoryAnalysis 
                topCategories={analyticsData.topCategoriesBySales} 
                lowCategories={analyticsData.lowCategoriesBySales}
                title="CATEGORIES_BY_SALES"
              />
            ) : (
              <div className="text-center py-8 text-gray-500 font-mono bg-white rounded-xl border border-gray-200">
                NO_HAY_DATOS_DE_CATEGORIAS
              </div>
            )}
          </motion.div>
        )}

        {selectedView === 'customers' && (
          <motion.div
            key="customers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CustomerPreferences preferences={analyticsData.customerPreferences} />
          </motion.div>
        )}

        {selectedView === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MarketTrends trends={analyticsData.marketTrends} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Analytics; 