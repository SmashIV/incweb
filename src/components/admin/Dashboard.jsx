import React from 'react';
import { ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const metrics = {
    totalSales: 125000,
    totalOrders: 156,
    totalProducts: 89,
    totalCustomers: 234,
    monthlyTarget: 150000,
    salesGrowth: 12.5,
    orderGrowth: 8.3,
    customerGrowth: 15.2
  };

  const recentOrders = [
    { id: 1, customer: 'Juan Pérez', amount: 250.00, status: 'Completado', date: '2024-03-15' },
    { id: 2, customer: 'María García', amount: 180.50, status: 'Pendiente', date: '2024-03-15' },
    { id: 3, customer: 'Carlos López', amount: 320.75, status: 'Completado', date: '2024-03-14' },
  ];

  const topProducts = [
    { id: 1, name: 'Chompa Alpaca', sales: 45, revenue: 4500 },
    { id: 2, name: 'Chalina Alpaca', sales: 38, revenue: 3800 },
    { id: 3, name: 'Manta Alpaca', sales: 32, revenue: 3200 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="text-2xl font-bold text-gray-900">S/ {metrics.totalSales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600">+{metrics.salesGrowth}%</span>
              <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Totales</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Package className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600">+{metrics.orderGrowth}%</span>
              <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalProducts}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">En inventario</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalCustomers}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600">+{metrics.customerGrowth}%</span>
              <span className="text-sm text-gray-500 ml-2">vs mes anterior</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Meta Mensual</h2>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progreso</span>
            <span className="font-medium text-gray-900">
              {((metrics.totalSales / metrics.monthlyTarget) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-gray-900 h-2.5 rounded-full"
              style={{ width: `${(metrics.totalSales / metrics.monthlyTarget) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">S/ {metrics.totalSales.toLocaleString()}</span>
            <span className="text-gray-600">Meta: S/ {metrics.monthlyTarget.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">S/ {order.amount.toFixed(2)}</p>
                    <p className={`text-sm ${
                      order.status === 'Completado' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Productos Más Vendidos</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} unidades</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">S/ {product.revenue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Ingresos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;