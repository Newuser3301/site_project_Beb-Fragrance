import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { AnalyticsClient } from './AnalyticsClient';

export const metadata: Metadata = {
  title: 'Analytics | Beb Fragrance Admin',
  description: 'View sales, products, and customer trends',
};

export default async function AdminAnalyticsPage() {
  // Fetch active orders (excluding cancelled / refunded)
  const orders = await prisma.order.findMany({
    where: {
      status: { notIn: ['CANCELLED', 'REFUNDED'] },
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  }).catch(() => []);

  // Fetch customer count
  const customerCount = await prisma.user.count({
    where: { role: 'CUSTOMER' },
  }).catch(() => 0);

  // Fetch order items to calculate bestsellers
  const orderItems = await prisma.orderItem.findMany({
    include: {
      product: {
        select: {
          name: true,
          images: {
            where: { isPrimary: true },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  }).catch(() => []);

  // 1. Total Metrics
  let totalRevenue = 0;
  const totalOrders = orders.length;

  orders.forEach((o) => {
    totalRevenue += Number(o.total);
  });

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // 2. Best-selling Products (Top 5)
  const productQuantities: Record<string, { name: string; image: string; quantity: number; totalSales: number }> = {};
  orderItems.forEach((item) => {
    const prodId = item.productId;
    const name = item.product.name;
    const image = item.product.images[0]?.url || '/images/products/placeholder.png';
    const quantity = item.quantity;
    const totalSales = Number(item.total);

    if (!productQuantities[prodId]) {
      productQuantities[prodId] = { name, image, quantity: 0, totalSales: 0 };
    }
    productQuantities[prodId].quantity += quantity;
    productQuantities[prodId].totalSales += totalSales;
  });

  const bestSellers = Object.values(productQuantities)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // 3. Group by Month (Past 6 Months)
  const monthlyData: Record<string, { label: string; sales: number; count: number }> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyData[key] = {
      label: `${monthNames[d.getMonth()]} ${d.getFullYear()}`,
      sales: 0,
      count: 0,
    };
  }

  orders.forEach((o) => {
    const date = new Date(o.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyData[key]) {
      monthlyData[key].sales += Number(o.total);
      monthlyData[key].count += 1;
    }
  });

  const monthlySales = Object.values(monthlyData);

  // 4. Group by Day (Past 7 Days)
  const dailyData: Record<string, { label: string; sales: number; count: number }> = {};
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dailyData[key] = {
      label: `${dayNames[d.getDay()]} (${d.getDate()})`,
      sales: 0,
      count: 0,
    };
  }

  orders.forEach((o) => {
    const date = new Date(o.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (dailyData[key]) {
      dailyData[key].sales += Number(o.total);
      dailyData[key].count += 1;
    }
  });

  const dailySales = Object.values(dailyData);

  // 5. Cumulative Revenue Trend
  let cumulative = 0;
  const revenueTrend = orders.map((o) => {
    cumulative += Number(o.total);
    return {
      date: new Date(o.createdAt).toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit' }),
      amount: cumulative,
      saleAmount: Number(o.total),
    };
  });

  return (
    <div className="space-y-6 p-1 lg:p-4">
      <AnalyticsClient
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        customerCount={customerCount}
        averageOrderValue={averageOrderValue}
        bestSellers={bestSellers}
        monthlySales={monthlySales}
        dailySales={dailySales}
        revenueTrend={revenueTrend}
      />
    </div>
  );
}
