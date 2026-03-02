import { ContentStatus } from "@/components/dashboard/ContentStatus";
import { LatestProducts } from "@/components/dashboard/LatestProducts";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/hooks/use-toast";
import {
  CategorySplitItem,
  ContentStatusItem,
  DashboardGrowth,
  dashboardService,
  DashboardStats,
  LastestProduct,
} from "@/services/dashboard.service";
import { FileText, FolderOpen, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const DashboardOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [growth, setGrowth] = useState<DashboardGrowth | null>(null);
  const [categorySplit, setCategorySplit] = useState<CategorySplitItem[]>([]);
  const [latestProducts, setLatestProducts] = useState<LastestProduct[]>([]);
  const [contentStatusItem, setContentStatusItem] = useState<ContentStatusItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard stats",
          variant: "destructive",
        })
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchGrowth = async () => {
      try {
        const data = await dashboardService.getGrowth();
        setGrowth(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch dashboard growth",
          variant: "destructive",
        })
      }
    };
    fetchGrowth();
  }, []);

  useEffect(() => {
    const fetchCategorySplit = async () => {
      try {
        const data = await dashboardService.getCategorySplit();
        setCategorySplit(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch category split",
          variant: "destructive",
        })
      }
    };
    fetchCategorySplit();
  }, []);

  const growthChartData = useMemo(() => {
    if (!growth) return [];

    return growth.labels.map((label, index) => {
      const row: any = { month: label };

      growth.datasets.forEach((dataset) => {
        row[dataset.name] = dataset.data[index];
      });

      return row;
    });
  }, [growth]);

  const PIE_COLORS = [
    "hsl(245,75%,60%)",
    "hsl(152,70%,45%)",
    "hsl(38,95%,55%)",
    "hsl(0,75%,55%)",
    "hsl(260,70%,60%)",
  ];

  const categoryData = useMemo(() => {
    return categorySplit.map((item, index) => ({
      ...item,
      color: PIE_COLORS[index % PIE_COLORS.length],
    }));
  }, [categorySplit]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const data = await dashboardService.getLatestProducts();
        setLatestProducts(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch latest products",
          variant: "destructive",
        })
      }
    };
    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const fetchContentStatus = async () => {
      try {
        const data = await dashboardService.getContentStatus();
        setContentStatusItem(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch content status",
          variant: "destructive",
        })
      }
    };
    fetchContentStatus();
  }, []);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Dashboard Overview"
        description="System management and detailed overview."
      />

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Platform Users"
          value={stats ? stats.totalUsers : 0}
          icon={Users}
          trend={{ value: "+8.2%", isPositive: true }}
          iconBgColor="bg-accent"
          iconColor="text-primary"
        />
        <StatCard
          title="Published Pages"
          value={stats ? stats.publishedPages : 0}
          icon={FileText}
          trend={{ value: "+4.3%", isPositive: true }}
          iconBgColor="bg-info/10"
          iconColor="text-info"
        />
        <StatCard
          title="Stored Documents"
          value={stats ? stats.totalDocuments : 0}
          icon={FolderOpen}
          trend={{ value: "-1.2%", isPositive: false }}
          iconBgColor="bg-muted"
          iconColor="text-muted-foreground"
        />
      </div>

      {/* Charts Section */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Platform Growth Chart */}
        <div className="lg:col-span-2 flex">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card h-full flex flex-col w-full">
            <h3 className="text-lg font-semibold text-foreground">
              Platform Growth
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              User engagement and activity trends over the last 7 months.
            </p>
            <div className="mt-6 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthChartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(245, 75%, 60%)"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(245, 75%, 60%)"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(220, 15%, 90%)"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 15%, 90%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Users"
                    stroke="hsl(245, 75%, 60%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Split Chart */}
        <div className="flex">
          <div className="rounded-xl border border-border bg-card p-6 shadow-card h-full flex flex-col w-full">
            <h3 className="text-lg font-semibold text-foreground">
              Category Split
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Distribution of products across main categories.
            </p>
            <div className="mt-6 h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-foreground"
                  >
                    <tspan x="50%" dy="-0.5em" fontSize="28" fontWeight="bold">
                      {categoryData.length}
                    </tspan>
                    <tspan
                      x="50%"
                      dy="1.5em"
                      fontSize="12"
                      className="fill-success"
                    >
                      TOTAL ITEMS
                    </tspan>
                  </text>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 space-y-3">
              {categoryData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>

                  <span className="font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <LatestProducts products={latestProducts} />
        </div>

        <div className="lg:col-span-5">
          <ContentStatus pages={contentStatusItem} />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
